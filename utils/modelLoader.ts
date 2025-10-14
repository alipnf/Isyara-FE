import * as tf from '@tensorflow/tfjs';

function baseUrlOf(url: string): string {
  const i = url.lastIndexOf('/');
  return i >= 0 ? url.slice(0, i + 1) : '';
}

function resolveUrl(path: string, base: string): string {
  // Handle absolute URLs
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('/')
  ) {
    return path;
  }
  // Resolve relative path
  if (base.startsWith('http://') || base.startsWith('https://')) {
    return new URL(path, base).toString();
  }
  // Both are relative paths, concatenate them
  return base + path;
}

async function fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.arrayBuffer();
}

function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
  const total = buffers.reduce((sum, b) => sum + b.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const b of buffers) {
    out.set(new Uint8Array(b), offset);
    offset += b.byteLength;
  }
  return out.buffer;
}

interface WeightSpec {
  name: string;
  shape: number[];
  dtype: string;
}

function rewriteWeightNames(
  weightSpecs: WeightSpec[],
  strategy: 'drop_prefix' | 'sequential_1' = 'drop_prefix'
): WeightSpec[] {
  return weightSpecs.map((w) => {
    const spec = { ...w };
    if (typeof spec.name === 'string') {
      const parts = spec.name.split('/');
      if (strategy === 'drop_prefix' && parts.length > 1) {
        spec.name = parts.slice(1).join('/');
      } else if (strategy === 'sequential_1' && parts[0] === 'sequential') {
        parts[0] = 'sequential_1';
        spec.name = parts.join('/');
      }
    }
    return spec;
  });
}

async function loadPatchedLayersModel(
  modelUrl: string
): Promise<tf.LayersModel> {
  console.log('🔧 Patched loader trying URL:', modelUrl);

  // 1) Fetch model.json and read manifest
  const modelJsonRes = await fetch(modelUrl);
  if (!modelJsonRes.ok)
    throw new Error(`Cannot fetch model.json: ${modelJsonRes.status}`);
  const modelJson = await modelJsonRes.json();
  const modelTopology = modelJson.modelTopology;
  const weightsManifest = modelJson.weightsManifest || [];
  const root = baseUrlOf(modelUrl);

  console.log('🔧 Base URL:', root);

  // 2) Fetch all shard files and concat
  const shardUrls: string[] = [];
  const originalSpecs: WeightSpec[] = [];
  for (const group of weightsManifest) {
    for (const p of group.paths) {
      const resolvedUrl = resolveUrl(p, root);
      console.log('🔧 Resolved shard URL:', p, '->', resolvedUrl);
      shardUrls.push(resolvedUrl);
    }
    for (const ws of group.weights) originalSpecs.push(ws);
  }
  const buffers: ArrayBuffer[] = [];
  for (const u of shardUrls) {
    console.log('📥 Fetching weight shard:', u);
    buffers.push(await fetchArrayBuffer(u));
  }
  const weightData = concatArrayBuffers(buffers);
  console.log('✅ Concatenated weight data:', weightData.byteLength, 'bytes');

  // 3) Try strategies to patch names and load from memory
  const strategies: Array<'drop_prefix' | 'sequential_1'> = [
    'drop_prefix',
    'sequential_1',
  ];
  let lastErr: any;

  console.log(
    '🔧 Original weight specs sample:',
    originalSpecs.slice(0, 3).map((s) => s.name)
  );

  for (const s of strategies) {
    const patchedSpecs = rewriteWeightNames(originalSpecs, s);
    console.log(
      `🔧 Trying strategy "${s}", sample patched names:`,
      patchedSpecs.slice(0, 3).map((ps) => ps.name)
    );

    const handler = tf.io.fromMemory({
      modelTopology,
      weightSpecs: patchedSpecs,
      weightData,
    });
    try {
      const m = await tf.loadLayersModel(handler);
      console.log('✅ Patched strategy succeeded:', s);
      return m;
    } catch (e: any) {
      lastErr = e;
      console.warn(`❌ Patched strategy "${s}" failed:`, e?.message || e);
    }
  }
  throw lastErr || new Error('Patched loading failed');
}

export async function loadModelWithFallback(
  urls: string[]
): Promise<tf.LayersModel> {
  let lastErr: any;
  for (const url of urls) {
    // First, try patched loader directly (safer approach)
    try {
      const m = await loadPatchedLayersModel(url);
      console.log('✅ Loaded model with patched loader from:', url);
      return m;
    } catch (patchErr: any) {
      console.warn(
        '⚠️ Patched load failed for:',
        url,
        patchErr?.message || patchErr
      );
      lastErr = patchErr;

      // If patched loader fails, try normal loader as fallback
      try {
        const m = await tf.loadLayersModel(url);
        console.log('✅ Loaded model normally from:', url);
        return m;
      } catch (normalErr: any) {
        console.warn(
          '⚠️ Normal load also failed:',
          normalErr?.message || normalErr
        );
        lastErr = normalErr;
      }
    }
  }
  throw lastErr || new Error('Unable to load model from any provided URL');
}

export async function fetchJSONWithFallback(urls: string[]): Promise<any> {
  let lastErr: any;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      console.log('Loaded metadata from:', url);
      return await res.json();
    } catch (e: any) {
      console.warn('Failed to fetch metadata:', url, e?.message || e);
      lastErr = e;
    }
  }
  throw lastErr || new Error('Unable to load metadata from any provided URL');
}
