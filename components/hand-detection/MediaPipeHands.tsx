'use client';

import { useEffect, useRef, MutableRefObject } from 'react';

// Declare global window properties for TypeScript
declare global {
  interface Window {
    Hands?: any;
    drawConnectors?: any;
    drawLandmarks?: any;
    HAND_CONNECTIONS?: any;
    Camera?: any;
  }
}

// Types for landmarks and drawing
type HandLandmark = {
  x: number;
  y: number;
  z: number;
};

type DrawOptions = {
  color: string;
  lineWidth: number;
  radius?: number;
};

export function useMediaPipeHands(): MutableRefObject<any> {
  const handsRef = useRef<any>(null);

  useEffect(() => {
    let pollId: any = null;

    const init = () => {
      if (handsRef.current) return true;
      const Hands = window.Hands;
      if (!Hands) return false;

      const hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 2,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
        modelComplexity: 1,
      });

      handsRef.current = hands;
      return true;
    };

    // Try immediate init; if scripts not ready, poll briefly until available
    if (!init()) {
      pollId = setInterval(() => {
        if (init()) {
          clearInterval(pollId);
          pollId = null;
        }
      }, 250);
    }

    return () => {
      if (pollId) clearInterval(pollId);
      const hands = handsRef.current;
      try {
        hands?.close?.();
      } catch (e) {
        /* noop */
      }
      handsRef.current = null;
    };
  }, []);

  return handsRef;
}

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmark[][],
  width: number,
  height: number
): void {
  const { drawConnectors, drawLandmarks: mpDrawLandmarks } = window;

  // Try to use MediaPipe's built-in drawing utilities
  if (drawConnectors && mpDrawLandmarks) {
    const HAND_CONNECTIONS =
      window.HAND_CONNECTIONS || (window as any).Hands?.HAND_CONNECTIONS;

    for (const lm of landmarks) {
      if (HAND_CONNECTIONS) {
        drawConnectors(ctx, lm, HAND_CONNECTIONS, {
          color: '#34d399',
          lineWidth: 3,
        } as DrawOptions);
      }
      mpDrawLandmarks(ctx, lm, {
        color: '#60a5fa',
        lineWidth: 1,
        radius: 2,
      } as DrawOptions);
    }
  } else {
    // Fallback: draw landmarks manually
    for (const lm of landmarks) {
      // Draw points
      ctx.fillStyle = '#60a5fa';
      for (const point of lm) {
        ctx.beginPath();
        ctx.arc(point.x * width, point.y * height, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Draw connections (simplified - just wrist to fingertips)
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;

      // Connection indices for hand (simplified)
      const connections = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 4], // Thumb
        [0, 5],
        [5, 6],
        [6, 7],
        [7, 8], // Index
        [0, 9],
        [9, 10],
        [10, 11],
        [11, 12], // Middle
        [0, 13],
        [13, 14],
        [14, 15],
        [15, 16], // Ring
        [0, 17],
        [17, 18],
        [18, 19],
        [19, 20], // Pinky
        [5, 9],
        [9, 13],
        [13, 17], // Palm
      ];

      for (const [start, end] of connections) {
        if (lm[start] && lm[end]) {
          ctx.beginPath();
          ctx.moveTo(lm[start].x * width, lm[start].y * height);
          ctx.lineTo(lm[end].x * width, lm[end].y * height);
          ctx.stroke();
        }
      }
    }
  }
}
