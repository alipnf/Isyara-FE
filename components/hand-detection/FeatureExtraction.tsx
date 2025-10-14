'use client';

// Types for hand landmarks
interface Landmark {
  x: number;
  y: number;
  z: number;
}

type Coordinate = [number, number, number];

// Extract 126-dim features from up to two hands (matching web implementation)
// Normalization: relative to wrist + scaled by max 3D distance
// Returns Float32Array(126) following Python preprocessing
export function extractFeatures(
  landmarks: Landmark[] | Landmark[][] | null | undefined
): Float32Array | null {
  if (!landmarks) return null;

  // Determine if input is multi-hand (array of arrays) or single-hand
  const isMultiHand = Array.isArray(landmarks[0]);

  let hands: Landmark[][] = [];
  if (isMultiHand) {
    hands = (landmarks as Landmark[][]).slice(0, 2);
  } else {
    hands = [landmarks as Landmark[]];
  }

  if (hands.length === 0) return null;

  const features: number[] = [];

  for (const hand of hands) {
    if (!hand || hand.length !== 21) continue;

    // Convert to array of [x,y,z]
    const points: Coordinate[] = hand.map(
      (lm: Landmark): Coordinate => [lm.x, lm.y, lm.z]
    );

    // Wrist is index 0 in MediaPipe
    const wrist = points[0];

    // Subtract wrist (relative coordinates)
    const rel: Coordinate[] = points.map(
      (p): Coordinate => [p[0] - wrist[0], p[1] - wrist[1], p[2] - wrist[2]]
    );

    // Scale by max distance from wrist (3D distance)
    let maxDist = 0;
    for (const r of rel) {
      const d = Math.hypot(r[0], r[1], r[2]);
      if (d > maxDist) maxDist = d;
    }

    const norm: Coordinate[] =
      maxDist > 0
        ? rel.map(
            (r): Coordinate => [r[0] / maxDist, r[1] / maxDist, r[2] / maxDist]
          )
        : rel;

    // Flatten [x0, y0, z0, x1, y1, z1, ...]
    for (const n of norm) {
      features.push(n[0], n[1], n[2]);
    }
  }

  // Pad if only 1 hand detected (to 126 dims)
  if (hands.length === 1) {
    for (let i = 0; i < 63; i++) features.push(0);
  }

  return new Float32Array(features);
}
