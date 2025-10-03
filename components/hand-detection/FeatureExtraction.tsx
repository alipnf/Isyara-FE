'use client';

// Types for hand landmarks
interface Landmark {
  x: number;
  y: number;
  z: number;
}

type Coordinate = [number, number, number];

// Build per-hand 63-dim features from a single hand (21 landmarks x 3)
function extractSingleHand63(
  hand: Landmark[] | null | undefined
): Float32Array | null {
  if (!hand || hand.length !== 21) return null;

  const coords: Coordinate[] = hand.map(
    (lm: Landmark): Coordinate => [lm.x, lm.y, lm.z]
  );

  // Use wrist as reference point
  const wrist = coords[0];

  // Relative to wrist
  const rel: Coordinate[] = coords.map((coord): Coordinate => {
    const [x, y, z] = coord;
    return [x - wrist[0], y - wrist[1], z - wrist[2]];
  });

  // Normalize by max XY radius
  const radii: number[] = rel.map((coord) => Math.hypot(coord[0], coord[1]));
  let maxRadius = Math.max(...radii);
  if (!isFinite(maxRadius) || maxRadius < 1e-6) maxRadius = 1.0;

  const relScaled: Coordinate[] = rel.map(
    (coord): Coordinate => [
      coord[0] / maxRadius,
      coord[1] / maxRadius,
      coord[2] / maxRadius,
    ]
  );

  // Flatten to 63 features
  const out = new Float32Array(63);
  let k = 0;
  for (let i = 0; i < 21; i++) {
    out[k++] = relScaled[i][0];
    out[k++] = relScaled[i][1];
    out[k++] = relScaled[i][2];
  }
  return out;
}

// Extract 127-dim features from up to two hands: 63 per hand + 1 hand_count
// Accepts either a single-hand array (Landmark[]) or multi-hand array (Landmark[][])
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

  const detectedHands = hands.length;

  // Prepare output: 126 for two hands + 1 for hand_count
  const features = new Float32Array(127);
  // Fill first 126 with per-hand features; default zeros if a hand missing
  for (let i = 0; i < 2; i++) {
    const start = i * 63;
    const hand = hands[i];
    const f = extractSingleHand63(hand);
    if (f) {
      features.set(f, start);
    } else {
      // leave zeros if no hand
    }
  }

  // Append hand count as last feature
  features[126] = detectedHands;

  return features;
}
