'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Circle, Square } from 'lucide-react';

interface PerformanceSnapshot {
  timestamp: number;
  fps: number;
  modelLatency: number;
  totalLatency: number;
  memory: number;
  tensors: number;
  backend: string;
}

export interface RecordedData {
  backend: string;
  device_info: {
    userAgent: string;
    platform: string;
    cores: number;
    browserName: string;
    browserVersion: string;
  };
  recording_duration_seconds: number;
  fps_samples: number[];
  avg_fps: number;
  min_fps: number;
  max_fps: number;
  model_latency_ms: number;
  total_latency_ms: number;
  memory_mb: number;
  tensors_count: number;
  sample_count: number;
  recorded_at: string;
}

interface PerformanceRecorderInlineProps {
  isRecording?: boolean;
  onRecordingComplete?: (data: RecordedData) => void;
}

export function PerformanceRecorderInline({
  isRecording: externalIsRecording,
  onRecordingComplete,
}: PerformanceRecorderInlineProps = {}) {
  const [internalIsRecording, setInternalIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordedData, setRecordedData] = useState<RecordedData | null>(null);
  const [sampleCount, setSampleCount] = useState(0);
  const samplesRef = useRef<PerformanceSnapshot[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const isControlled = typeof externalIsRecording !== 'undefined';
  const isRecording = isControlled ? externalIsRecording : internalIsRecording;

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    if (ua.includes('Firefox/')) {
      browserName = 'Firefox';
      browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Edg/')) {
      browserName = 'Edge';
      browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Chrome/')) {
      browserName = 'Chrome';
      browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || 'Unknown';
    } else if (ua.includes('Safari/')) {
      browserName = 'Safari';
      browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || 'Unknown';
    }

    return { browserName, browserVersion };
  };

  const collectSample = () => {
    const perfPanel = document.querySelector(
      '[data-performance-panel]'
    ) as HTMLElement;
    if (!perfPanel) return;

    const backend = perfPanel.getAttribute('data-backend') || 'webgl';
    const fps = parseFloat(perfPanel.getAttribute('data-fps') || '0');
    const modelLatency = parseFloat(
      perfPanel.getAttribute('data-model-latency') || '0'
    );
    const totalLatency = parseFloat(
      perfPanel.getAttribute('data-total-latency') || '0'
    );
    const memory = parseFloat(perfPanel.getAttribute('data-memory') || '0');
    const tensors = parseInt(perfPanel.getAttribute('data-tensors') || '0');

    if (fps > 0) {
      samplesRef.current.push({
        timestamp: performance.now(),
        fps,
        modelLatency,
        totalLatency,
        memory,
        tensors,
        backend,
      });
      setSampleCount(samplesRef.current.length);
    }
  };

  const startRecording = () => {
    samplesRef.current = [];
    startTimeRef.current = performance.now();
    if (!isControlled) setInternalIsRecording(true);
    setDuration(0);
    setSampleCount(0);
    setRecordedData(null);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      collectSample();
      const elapsed = Math.floor(
        (performance.now() - startTimeRef.current) / 1000
      );
      setDuration(elapsed);
    }, 500);
  };

  const stopRecording = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!isControlled) setInternalIsRecording(false);

    const samples = samplesRef.current;
    if (samples.length === 0) {
      // If controlled, we might just return null or empty data
      if (!isControlled) {
        alert(
          'Tidak ada data terekam. Pastikan Performance Stats aktif dan camera running.'
        );
      }
      return;
    }

    const fpsSamples = samples.map((s) => s.fps);
    const avgFps = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
    const minFps = Math.min(...fpsSamples);
    const maxFps = Math.max(...fpsSamples);

    const avgModelLatency =
      samples.reduce((a, b) => a + b.modelLatency, 0) / samples.length;
    const avgTotalLatency =
      samples.reduce((a, b) => a + b.totalLatency, 0) / samples.length;
    const avgMemory =
      samples.reduce((a, b) => a + b.memory, 0) / samples.length;
    const avgTensors = Math.round(
      samples.reduce((a, b) => a + b.tensors, 0) / samples.length
    );

    const backend = samples[samples.length - 1].backend;
    const { browserName, browserVersion } = getBrowserInfo();

    const data: RecordedData = {
      backend: backend.toUpperCase(),
      device_info: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        cores: navigator.hardwareConcurrency || 4,
        browserName,
        browserVersion,
      },
      recording_duration_seconds:
        (performance.now() - startTimeRef.current) / 1000,
      fps_samples: fpsSamples,
      avg_fps: avgFps,
      min_fps: minFps,
      max_fps: maxFps,
      model_latency_ms: avgModelLatency,
      total_latency_ms: avgTotalLatency,
      memory_mb: avgMemory,
      tensors_count: avgTensors,
      sample_count: samples.length,
      recorded_at: new Date().toISOString(),
    };

    setRecordedData(data);
    if (onRecordingComplete) {
      onRecordingComplete(data);
    } else {
      console.log('📊 Performance recording complete:', data);
      // Only auto-download if not controlled (legacy behavior)
      if (!isControlled) {
        downloadData(data);
      }
    }
  };

  const downloadData = (data: RecordedData) => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'real_world_performance.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Effect to handle external control
  useEffect(() => {
    if (isControlled) {
      if (externalIsRecording) {
        startRecording();
      } else {
        // Only stop if we were actually recording (to avoid initial mount stop)
        if (intervalRef.current) {
          stopRecording();
        }
      }
    }
  }, [externalIsRecording]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // If controlled, render nothing (headless mode)
  if (isControlled) {
    return null;
  }

  // Legacy UI for manual mode
  if (recordedData) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border-2 border-green-500 rounded-lg shadow-2xl p-4 max-w-xs z-50">
        <div className="text-sm font-bold text-green-600 mb-2">
          ✅ Recording Complete!
        </div>
        <div className="text-xs space-y-1 mb-3">
          <div>
            Duration:{' '}
            <strong>
              {recordedData.recording_duration_seconds.toFixed(1)}s
            </strong>
          </div>
          <div>
            Samples: <strong>{recordedData.sample_count}</strong>
          </div>
          <div>
            Avg FPS: <strong>{recordedData.avg_fps.toFixed(1)}</strong>
          </div>
          <div>
            Latency:{' '}
            <strong>{recordedData.model_latency_ms.toFixed(2)}ms</strong>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => downloadData(recordedData)}
            className="flex-1 text-xs h-8"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setRecordedData(null)}
            className="flex-1 text-xs h-8"
          >
            ✓ Done
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          File saved: real_world_performance.json
        </div>
      </div>
    );
  }

  if (isRecording) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-600 text-white rounded-lg shadow-2xl p-4 max-w-xs z-50 animate-pulse">
        <div className="flex items-center gap-2 mb-2">
          <Circle className="w-3 h-3 fill-white animate-pulse" />
          <span className="font-bold text-sm">RECORDING</span>
        </div>
        <div className="text-xs space-y-1 mb-3">
          <div>
            Duration: <strong>{duration}s</strong>
          </div>
          <div>
            Samples: <strong>{sampleCount}</strong>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={stopRecording}
          className="w-full text-xs h-8"
        >
          <Square className="w-3 h-3 mr-1" />
          Stop Recording
        </Button>
        <div className="text-xs mt-2 opacity-90">
          Gunakan aplikasi seperti biasa...
        </div>
      </div>
    );
  }

  return (
    <Button
      size="sm"
      onClick={startRecording}
      className="fixed bottom-4 right-4 shadow-lg z-50 h-10 px-4"
      variant="default"
    >
      <Circle className="w-3 h-3 mr-2 fill-red-500 text-red-500" />
      <span className="text-sm font-medium">Record Performance</span>
    </Button>
  );
}
