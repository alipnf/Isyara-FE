'use client';

// Types for hand landmarks
interface Landmark {
  x: number;
  y: number;
  z: number;
}

type Coordinate = [number, number, number];

// Flip landmarks horizontally to handle left/right hand differences
function flipLandmarksHorizontal(landmarks: Landmark[]): Landmark[] {
  const flipped = landmarks.map((lm) => ({
    x: 1.0 - lm.x, // Flip X coordinate
    y: lm.y,
    z: lm.z,
  }));

  // MediaPipe Hand Landmark mapping untuk mirroring
  // Tukar landmark points yang berpasangan (thumb, fingers, dll)
  const landmarkPairs = [
    [2, 3], // Thumb tip connections
    [5, 17], // Index finger MCP ⟷ Pinky MCP
    [6, 18], // Index finger PIP ⟷ Pinky PIP
    [7, 19], // Index finger DIP ⟷ Pinky DIP
    [8, 20], // Index finger tip ⟷ Pinky tip
    [9, 13], // Middle finger MCP ⟷ Ring finger MCP
    [10, 14], // Middle finger PIP ⟷ Ring finger PIP
    [11, 15], // Middle finger DIP ⟷ Ring finger DIP
    [12, 16], // Middle finger tip ⟷ Ring finger tip
  ];

  // Swap landmarks untuk mirroring yang benar
  for (const [i, j] of landmarkPairs) {
    const temp = flipped[i];
    flipped[i] = flipped[j];
    flipped[j] = temp;
  }

  return flipped;
}

// Extract features with optional horizontal flip correction
function extractFeaturesInternal(
  landmarks: Landmark[] | Landmark[][] | null | undefined,
  applyFlipCorrection: boolean = false
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

  for (let hand of hands) {
    if (!hand || hand.length !== 21) continue;

    // Apply horizontal flip correction if requested
    if (applyFlipCorrection) {
      hand = flipLandmarksHorizontal(hand);
    }

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

// Main extraction function - tries both normal and flipped approaches
// Returns the features that would give better prediction confidence
export function extractFeatures(
  landmarks: Landmark[] | Landmark[][] | null | undefined
): Float32Array | null {
  // For now, just use normal extraction (backward compatibility)
  // The dual prediction will be handled in HandDetection component
  return extractFeaturesInternal(landmarks, false);
}

// Dual extraction for better left/right hand handling
export function extractFeaturesWithDualApproach(
  landmarks: Landmark[] | Landmark[][] | null | undefined
): { normal: Float32Array | null; flipped: Float32Array | null } {
  const normal = extractFeaturesInternal(landmarks, false);
  const flipped = extractFeaturesInternal(landmarks, true);

  return { normal, flipped };
}
