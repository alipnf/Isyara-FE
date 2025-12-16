'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HandDetection } from '@/components/hand-detection/HandDetection';
import { SettingsDialog } from '@/components/lesson/SettingsDialog';
import { Camera, CameraOff, XCircle, X } from 'lucide-react';
import type { LessonSettings } from '@type/lesson';

interface QuizCameraSectionProps {
  cameraEnabled: boolean;
  isDetecting: boolean;
  confidence: number;
  isCorrect: boolean | null;
  expectedLabel: string;
  settings: LessonSettings;
  onToggleCamera: () => void;
  onDetection: (label: string | null, confidence: number) => void;
  onLiveUpdate: (label: string | null, confidence: number) => void;
  onStatusChange: (isDetecting: boolean) => void;
  onSettingsChange: (settings: LessonSettings) => void;
  onExit: () => void;
}

export function QuizCameraSection({
  cameraEnabled,
  isDetecting,
  confidence,
  isCorrect,
  expectedLabel,
  settings,
  onToggleCamera,
  onDetection,
  onLiveUpdate,
  onStatusChange,
  onSettingsChange,
  onExit,
}: QuizCameraSectionProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl h-full">
      {/* Header: Title, Confidence & Exit */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 shrink-0">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-foreground hidden sm:block">
              Kamera
            </h2>
          </div>

          {/* Confidence Bar Restored */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-medium text-muted-foreground">
                Kecocokan
              </span>
              <span className="text-xs font-bold text-primary">
                {Math.round(confidence)}%
              </span>
            </div>
            <Progress
              value={Math.max(0, Math.min(100, Math.round(confidence)))}
              className="h-2 w-full"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
        >
          <X className="h-5 w-5 mr-2" />
          Keluar
        </Button>
      </div>

      {/* Camera Feed */}
      <div className="relative w-full aspect-video bg-gray-900/50 dark:bg-black/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-md flex items-center justify-center">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-green-500/10 to-orange-500/10 pointer-events-none"></div>

        {cameraEnabled ? (
          <HandDetection
            isDetecting={isDetecting}
            showLandmarks={settings.showHandLandmarks}
            showPerformanceStats={settings.showPerformanceStats}
            onDetection={onDetection}
            onLiveUpdate={onLiveUpdate}
            onStatusChange={(status) => onStatusChange(status === 'active')}
            containerClassName="rounded-xl w-full h-full relative z-10"
            holdDuration={settings.holdDuration[0]}
            confidenceThreshold={settings.confidenceThreshold[0] / 100}
            expectedLabel={expectedLabel}
          />
        ) : (
          <div className="flex items-center justify-center h-full relative z-10">
            <div className="text-center p-4">
              <CameraOff className="h-12 w-12 text-white/50 mx-auto mb-3" />
              <p className="text-white/70 font-medium">
                Umpan Kamera AI akan muncul di sini
              </p>
            </div>
          </div>
        )}

        {/* Feedback Overlay */}
        {isCorrect !== null && !isCorrect && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
            <XCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Sesuaikan posisi tangan</span>
          </div>
        )}
      </div>
    </div>
  );
}
