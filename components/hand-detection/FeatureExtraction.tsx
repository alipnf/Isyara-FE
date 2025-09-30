'use client';

// Types for hand landmarks
interface Landmark {
  x: number;
  y: number;
  z: number;
}

type Coordinate = [number, number, number];

// Feature extraction function from hand landmarks
// This is a direct port of the logic in the web implementation
export function extractFeatures(
  landmarks: Landmark[] | null | undefined
): Float32Array | null {
  // landmarks: array of 21 with {x, y, z} normalized (0..1)
  if (!landmarks || landmarks.length !== 21) return null;

  // Extract coordinates from landmarks (21x3)
  const coords: Coordinate[] = landmarks.map(
    (lm: Landmark): Coordinate => [lm.x, lm.y, lm.z]
  );

  // Use wrist as reference point
  const wrist = coords[0];

  // Calculate relative positions to wrist
  const rel: Coordinate[] = coords.map((coord): Coordinate => {
    const [x, y, z] = coord;
    return [x - wrist[0], y - wrist[1], z - wrist[2]];
  });

  // Calculate radii for normalization
  const radii: number[] = rel.map((coord) => {
    const [x, y] = coord;
    return Math.hypot(x, y);
  });

  let maxRadius = Math.max(...radii);
  if (!isFinite(maxRadius) || maxRadius < 1e-6) maxRadius = 1.0;

  // Scale by max radius to normalize
  const relScaled: Coordinate[] = rel.map((coord): Coordinate => {
    const [x, y, z] = coord;
    return [x / maxRadius, y / maxRadius, z / maxRadius];
  });

  // Flatten to 63 features (21 landmarks x 3 coordinates)
  const features = new Float32Array(63);
  let k = 0;
  for (let i = 0; i < 21; i++) {
    features[k++] = relScaled[i][0];
    features[k++] = relScaled[i][1];
    features[k++] = relScaled[i][2];
  }

  return features;
}

