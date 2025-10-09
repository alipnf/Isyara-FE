'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { useMediaPipeHands, drawLandmarks } from './MediaPipeHands';
import { extractFeatures } from './FeatureExtraction';

interface HandDetectionProps {
  onDetection?: (label: string, confidence: number) => void;
  onStatusChange?: (status: 'inactive' | 'active' | 'error') => void;
  onLiveUpdate?: (label: string | null, confidence: number) => void; // per-frame label + confidence (0-100)
  isDetecting: boolean;
  showLandmarks?: boolean;
  width?: number;
  height?: number;
  confidenceThreshold?: number;
  modelPath?: string;
  classesPath?: string;
  containerClassName?: string;
  holdDuration?: number; // Hold duration in seconds
  expectedLabel?: string; // Expected label to match (e.g., "A", "B", etc.)
}

export function HandDetection({
  onDetection,
  onStatusChange,
  onLiveUpdate,
  isDetecting,
  showLandmarks = true,
  width = 640,
  height = 480,
  confidenceThreshold = 0.75,
  modelPath = '/models/model.json',
  classesPath = '/models/classes.json',
  containerClassName = '',
  holdDuration = 3, // Default 3 seconds
  expectedLabel = '', // Expected label (e.g. the letter being practiced)
}: HandDetectionProps) {
  // Temporary toggle to disable per-letter hand-count requirements
  const DISABLE_HAND_REQUIREMENTS = true;
  // Smoothing and hysteresis settings
  const SMOOTH_ALPHA = 0.8; // 0..1, higher = smoother (slower to react)
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const handsRef = useMediaPipeHands();
  const cameraRef = useRef<any>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [classes, setClasses] = useState<string[]>([]);
  const [handRequirements, setHandRequirements] = useState<
    Record<string, 'single' | 'two' | 'flexible' | string>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const lastDimsRef = useRef({
    width: 0,
    height: 0,
    videoWidth: 0,
    videoHeight: 0,
  });
  const [currentDetectedLabel, setCurrentDetectedLabel] = useState<
    string | null
  >(null);
  const [showHoldAlert, setShowHoldAlert] = useState(false);
  const startWaitTimerRef = useRef<NodeJS.Timeout | null>(null);
  const expectedLabelRef = useRef<string>(expectedLabel);
  const onDetectionRef = useRef<typeof onDetection>(onDetection);
  const onLiveUpdateRef = useRef<typeof onLiveUpdate>(onLiveUpdate);
  const [handReqMessage, setHandReqMessage] = useState<string | null>(null);
  // Exponential moving average for expected-label confidence
  const emaConfRef = useRef<number>(0);

  // References for hold timer
  const detectionTimerRef = useRef<{
    label: string;
    confidence: number;
    startTime: number;
    timerId: NodeJS.Timeout | null;
  } | null>(null);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);

  // Keep latest onDetection callback to avoid stale closure in MediaPipe callback
  useEffect(() => {
    onDetectionRef.current = onDetection;
  }, [onDetection]);

  // Keep latest onLiveUpdate callback
  useEffect(() => {
    onLiveUpdateRef.current = onLiveUpdate;
  }, [onLiveUpdate]);

  // Load TFJS model and classes
  useEffect(() => {
    let mounted = true;

    const loadModel = async () => {
      try {
        await tf.ready();
        try {
          await tf.setBackend('webgl');
        } catch (_) {}

        // Try loading model from different paths
        const tryPaths = async (
          candidates: string[],
          loader: (url: string) => Promise<any>
        ) => {
          let lastErr = null;
          for (const url of candidates) {
            try {
              return await loader(url);
            } catch (e) {
              lastErr = e;
            }
          }
          throw lastErr || new Error('All paths failed');
        };

        // Load model and classes metadata in parallel
        const [loadedModel, meta] = await Promise.all([
          tryPaths([modelPath, '/model.json', 'models/model.json'], (u) =>
            tf.loadLayersModel(u)
          ),
          tryPaths(
            [classesPath, '/classes.json', 'models/classes.json'],
            async (u) => {
              const r = await fetch(u);
              if (!r.ok) throw new Error(`HTTP ${r.status} on ${u}`);
              return await r.json();
            }
          ),
        ]);

        if (!mounted) return;

        setModel(loadedModel);
        const loadedClasses = Array.isArray(meta)
          ? (meta as string[])
          : meta.classes || [];
        setClasses(loadedClasses);
        const reqs = (meta && meta.hand_requirements) || {};
        setHandRequirements(reqs);

        if (onStatusChange) {
          onStatusChange('inactive');
        }
      } catch (err: any) {
        console.error('Failed to load model/classes', err);
        setError(
          `Failed to load model/classes: ${err?.message || String(err)}`
        );
        if (onStatusChange) {
          onStatusChange('error');
        }
      }
    };

    loadModel();

    return () => {
      mounted = false;
    };
  }, [modelPath, classesPath, onStatusChange]);

  // Start/stop detection based on isDetecting prop
  useEffect(() => {
    if (isDetecting && !isRunning) {
      // If MediaPipe or Camera script isn't loaded yet, retry until ready
      const tryStart = () => {
        const ready =
          !!handsRef.current &&
          typeof window !== 'undefined' &&
          !!(window as any).Camera &&
          !!model;
        if (ready) {
          startWaitTimerRef.current && clearTimeout(startWaitTimerRef.current);
          startWaitTimerRef.current = null;
          startDetection();
        } else {
          startWaitTimerRef.current = setTimeout(tryStart, 250);
        }
      };
      tryStart();
    } else if (!isDetecting && isRunning) {
      stopDetection();
    }

    // Clear any pending hold timer if detection is toggled
    if (!isDetecting && detectionTimerRef.current?.timerId) {
      clearTimeout(detectionTimerRef.current.timerId);
      detectionTimerRef.current = null;
      setShowHoldAlert(false);
    }
    return () => {
      if (startWaitTimerRef.current) {
        clearTimeout(startWaitTimerRef.current);
        startWaitTimerRef.current = null;
      }
    };
  }, [isDetecting, isRunning, model]);

  // Start detection
  const startDetection = async () => {
    if (!handsRef.current || isRunning) {
      return;
    }

    setIsRunning(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set initial size based on container's actual box (fill parent)
      const resize = () => {
        if (!containerRef.current || !canvas) return;
        const rect = containerRef.current.getBoundingClientRect();
        const cssW = Math.max(1, Math.floor(rect.width));
        const cssH = Math.max(1, Math.floor(rect.height));
        canvas.width = cssW;
        canvas.height = cssH;
      };
      resize();

      // Configure MediaPipe Hands
      handsRef.current.onResults((results: any) => {
        if (!ctx || !canvas || !containerRef.current) return;

        // Adapt canvas size to container size (respect parent layout)
        const img = results.image;
        const rect = containerRef.current.getBoundingClientRect();
        const cssW = Math.max(1, Math.floor(rect.width));
        const cssH = Math.max(1, Math.floor(rect.height));
        const srcW = (img && img.width) || video.videoWidth || width;
        const srcH = (img && img.height) || video.videoHeight || height;

        const last = lastDimsRef.current;
        if (
          last.width !== cssW ||
          last.height !== cssH ||
          last.videoWidth !== srcW ||
          last.videoHeight !== srcH
        ) {
          canvas.width = cssW;
          canvas.height = cssH;
          lastDimsRef.current = {
            width: cssW,
            height: cssH,
            videoWidth: srcW,
            videoHeight: srcH,
          };
        }

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw video frame with mirror effect, preserving aspect ratio (contain)
        try {
          const dstW = canvas.width;
          const dstH = canvas.height;
          const srcW2 = srcW;
          const srcH2 = srcH;
          const dstAR = dstW / dstH;
          const srcAR = srcW2 / srcH2;

          let drawW = dstW;
          let drawH = dstH;
          if (srcAR > dstAR) {
            // source is wider -> fit width
            drawW = dstW;
            drawH = Math.max(1, Math.floor(dstW / srcAR));
          } else {
            // source is taller/narrower -> fit height
            drawH = dstH;
            drawW = Math.max(1, Math.floor(dstH * srcAR));
          }
          const dx = Math.floor((dstW - drawW) / 2);
          const dy = Math.floor((dstH - drawH) / 2);

          // Mirror horizontally then draw inside letterboxed region
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          if (img) {
            ctx.drawImage(img, 0, 0, srcW2, srcH2, dx, dy, drawW, drawH);
          }
        } catch (_) {}

        // Restore context for landmarks drawing (so they're drawn correctly)
        ctx.restore();
        ctx.save();

        // Draw hand landmarks if enabled (with mirror + contain mapping)
        if (
          showLandmarks &&
          results.multiHandLandmarks &&
          results.multiHandLandmarks.length
        ) {
          // Recompute draw rect (same as video) so overlay aligns
          const dstW = canvas.width;
          const dstH = canvas.height;
          const srcW2 = (img && img.width) || video.videoWidth || width;
          const srcH2 = (img && img.height) || video.videoHeight || height;
          const dstAR = dstW / dstH;
          const srcAR = srcW2 / srcH2;

          let drawW = dstW;
          let drawH = dstH;
          if (srcAR > dstAR) {
            drawW = dstW;
            drawH = Math.max(1, Math.floor(dstW / srcAR));
          } else {
            drawH = dstH;
            drawW = Math.max(1, Math.floor(dstH * srcAR));
          }
          const dx = Math.floor((dstW - drawW) / 2);
          const dy = Math.floor((dstH - drawH) / 2);

          // Mirror, then map normalized coords into the letterboxed region
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
          ctx.translate(dx, dy);
          ctx.scale(drawW / canvas.width, drawH / canvas.height);

          drawLandmarks(
            ctx,
            results.multiHandLandmarks,
            canvas.width,
            canvas.height
          );
        }

        // Make prediction if model is loaded
        if (
          model &&
          results.multiHandLandmarks &&
          results.multiHandLandmarks.length
        ) {
          // Build combined features for up to 2 hands: 127 dims (63x2 + hand_count)
          const feat = extractFeatures(results.multiHandLandmarks);
          if (feat) {
            const input = tf.tensor(feat, [1, 127], 'float32');
            const probs = model.predict(input) as tf.Tensor;
            const pData = probs.dataSync();
            input.dispose();
            probs.dispose();

            // Argmax label
            let bestIdx = 0;
            for (let j = 1; j < pData.length; j++) {
              if (pData[j] > pData[bestIdx]) bestIdx = j;
            }

            const conf = pData[bestIdx];
            const lbl = classes[bestIdx] ?? `${bestIdx}`;

            // For UI
            let bestLabelAny = lbl;
            let bestConf = conf >= confidenceThreshold ? conf : -1;
            let bestLabel = bestConf >= 0 ? lbl : '';

            // Confidence for expected label (if provided)
            const currentExpected = expectedLabelRef.current || '';
            const expectedIdx = currentExpected
              ? classes.indexOf(currentExpected)
              : -1;
            const expectedConf = expectedIdx >= 0 ? pData[expectedIdx] : 0;

            // Validate hand count vs requirement for expected label
            let isHandCountValid = true;
            let validationMsg: string | null = null;
            if (!DISABLE_HAND_REQUIREMENTS && currentExpected) {
              const detectedCount = Math.min(
                2,
                results.multiHandLandmarks.length
              );
              const req =
                (handRequirements?.[currentExpected] as string) || 'single';
              if (req === 'single' && detectedCount !== 1) {
                isHandCountValid = false;
                validationMsg =
                  'Gunakan 1 tangan untuk huruf ' + currentExpected;
              } else if (req === 'two' && detectedCount !== 2) {
                isHandCountValid = false;
                validationMsg =
                  'Gunakan 2 tangan untuk huruf ' + currentExpected;
              } else if (req === 'flexible') {
                isHandCountValid = true;
                validationMsg = null;
              }
            }
            setHandReqMessage(DISABLE_HAND_REQUIREMENTS ? null : validationMsg);

            // Always show the best current label (even if below threshold)
            if (bestLabelAny) {
              setCurrentDetectedLabel(bestLabelAny);
            } else {
              setCurrentDetectedLabel(null);
            }
            // Exponential moving average smoothing for expected label confidence
            const rawExpected = Math.max(0, Math.min(1, expectedConf));
            const prev = emaConfRef.current || 0;
            const smoothed =
              prev === 0
                ? rawExpected
                : prev * SMOOTH_ALPHA + rawExpected * (1 - SMOOTH_ALPHA);
            emaConfRef.current = smoothed;

            // Emit live update using smoothed expected confidence percent (0-100)
            onLiveUpdateRef.current?.(
              bestLabelAny || null,
              Math.round(smoothed * 100)
            );

            // Handle the hold duration timer - only start timer if the detected label matches expected label and hand count is valid
            const now = Date.now();
            const isCorrectGesture =
              !!currentExpected && bestLabel === currentExpected;

            // Hysteresis thresholds: start higher, keep with slightly lower
            const startThreshold = confidenceThreshold; // e.g., 0.75
            const keepThreshold = Math.max(0.5, startThreshold - 0.1); // e.g., 0.65

            const canStart =
              isCorrectGesture &&
              isHandCountValid &&
              emaConfRef.current >= startThreshold;
            const canKeep =
              isHandCountValid && emaConfRef.current >= keepThreshold;

            if (!detectionTimerRef.current) {
              if (canStart) {
                setShowHoldAlert(true);
                // Start a new timer
                const timerId = setTimeout(() => {
                  if (onDetectionRef.current && detectionTimerRef.current) {
                    onDetectionRef.current(
                      detectionTimerRef.current.label,
                      detectionTimerRef.current.confidence
                    );
                  }
                  detectionTimerRef.current = null;
                  setShowHoldAlert(false);
                }, holdDuration * 1000);

                detectionTimerRef.current = {
                  // Tie the timer to the expected label for stability
                  label: currentExpected,
                  confidence: Math.round(emaConfRef.current * 100),
                  startTime: now,
                  timerId,
                };
              } else {
                setShowHoldAlert(false);
              }
            } else {
              // Timer is running; keep it as long as confidence stays above keepThreshold
              if (canKeep) {
                setShowHoldAlert(true);
              } else {
                if (detectionTimerRef.current?.timerId) {
                  clearTimeout(detectionTimerRef.current.timerId);
                }
                detectionTimerRef.current = null;
                setShowHoldAlert(false);
              }
            }
          } else {
            setCurrentDetectedLabel(null);
            onLiveUpdateRef.current?.(null, 0);
          }

          // Close outer if (model && landmarks)
        } else {
          // Model not loaded or no landmarks
          setCurrentDetectedLabel(null);
          onLiveUpdateRef.current?.(null, 0);
        }

        ctx.restore();
      });

      // Start camera via MediaPipe helper
      const Camera = (window as any).Camera;
      if (!Camera) {
        // Defer starting until camera_utils is loaded; a retry loop above will handle this
        setIsRunning(false);
        return;
      }

      const camera = new Camera(video, {
        onFrame: async () => {
          try {
            if (handsRef.current && video) {
              await handsRef.current.send({ image: video });
            }
          } catch (e) {
            console.warn('hands.send error', e);
          }
        },
        width,
        height,
      });

      await camera.start();
      cameraRef.current = camera;

      if (onStatusChange) {
        onStatusChange('active');
      }

      // Handle resizing
      const ro = new ResizeObserver(() => resize());
      if (containerRef.current) {
        ro.observe(containerRef.current);
      }

      return () => {
        ro.disconnect();
      };
    } catch (err) {
      console.error('Error starting detection:', err);
      setError(`Error starting detection: ${err}`);
      setIsRunning(false);

      if (onStatusChange) {
        onStatusChange('error');
      }
    }
  };

  // Keep expected label updated for onResults closure
  useEffect(() => {
    expectedLabelRef.current = expectedLabel;
  }, [expectedLabel]);

  // Reset hold state when expected label changes (e.g., auto-advance)
  useEffect(() => {
    // Clear any running hold timer and hide alert so the next item can start fresh
    if (detectionTimerRef.current?.timerId) {
      clearTimeout(detectionTimerRef.current.timerId);
    }
    detectionTimerRef.current = null;
    setShowHoldAlert(false);
  }, [expectedLabel]);

  // Stop detection and camera
  const stopDetection = () => {
    // Clear any pending detection timer
    if (detectionTimerRef.current?.timerId) {
      clearTimeout(detectionTimerRef.current.timerId);
      detectionTimerRef.current = null;
      setShowHoldAlert(false);
    }

    setIsRunning(false);
    setCurrentDetectedLabel(null);

    try {
      if (cameraRef.current) {
        cameraRef.current.stop();
        cameraRef.current = null;
      }
    } catch (e) {
      console.warn('Error stopping camera:', e);
    }

    const stream = videoRef.current?.srcObject;
    if (stream) {
      try {
        const tracks = (stream as MediaStream).getTracks();
        for (const track of tracks) {
          track.stop();
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      } catch (e) {
        console.warn('Error stopping video tracks:', e);
      }
    }

    if (onStatusChange) {
      onStatusChange('inactive');
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${containerClassName}`}
      style={{ width: '100%', height: '100%' }}
    >
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-0 h-0 invisible"
        autoPlay
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      {error && (
        <div className="absolute top-2 left-2 bg-red-500/90 text-white px-2 py-1 text-sm rounded">
          {error}
        </div>
      )}
      {handReqMessage && !error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-3 py-1.5 text-sm rounded shadow">
          {handReqMessage}
        </div>
      )}
      {!isRunning && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
          <div className="text-center">
            <div className="text-xl font-semibold mb-2">Menyiapkan kamera</div>
            <div className="text-sm text-white/70">
              Memuat model & MediaPipe...
            </div>
          </div>
        </div>
      )}

      {/* Current detection display */}
      {currentDetectedLabel && (
        <div className="absolute top-2 right-2 bg-black/60 text-white px-3 py-1.5 text-sm rounded">
          Deteksi: <span className="font-bold">{currentDetectedLabel}</span>
        </div>
      )}

      {/* Hold alert overlay */}
      {showHoldAlert && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-green-600/50 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg text-white text-center">
            <div className="text-xl font-bold mb-2">Posisi Benar!</div>
            <div className="text-base">
              Tahan posisi selama {holdDuration} detik
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
