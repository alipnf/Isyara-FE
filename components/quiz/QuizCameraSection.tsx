'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HandDetection } from '@/components/hand-detection/HandDetection';
import { SettingsDialog } from '@/components/lesson/SettingsDialog';
import { Camera, CameraOff, XCircle } from 'lucide-react';
import type { LessonSettings } from '@/components/lesson/types';

interface QuizCameraSectionProps {
  cameraEnabled: boolean;
  isDetecting: boolean;
  confidence: number;
  isCorrect: boolean | null;
  expectedLabel: string;
  settings: LessonSettings;
  onToggleCamera: () => void;
  onDetection: (label: string, confidence: number) => void;
  onLiveUpdate: (label: string | null, confidence: number) => void;
  onStatusChange: (status: 'inactive' | 'active' | 'error') => void;
  onSettingsChange: (settings: LessonSettings) => void;
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
}: QuizCameraSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Kamera & Deteksi
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onToggleCamera}
              className={
                cameraEnabled ? 'bg-primary text-primary-foreground' : ' '
              }
            >
              {cameraEnabled ? (
                <Camera className="h-4 w-4 mr-2" />
              ) : (
                <CameraOff className="h-4 w-4 mr-2" />
              )}
              {cameraEnabled ? 'Aktif' : 'Nonaktif'}
            </Button>
            <SettingsDialog
              settings={settings}
              onSettingsChange={onSettingsChange}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Hand Detection Component */}
        <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
          {cameraEnabled && (
            <HandDetection
              isDetecting={isDetecting}
              showLandmarks={settings.showHandLandmarks}
              onDetection={onDetection}
              onLiveUpdate={onLiveUpdate}
              onStatusChange={onStatusChange}
              containerClassName="rounded-lg"
              holdDuration={settings.holdDuration[0]}
              expectedLabel={expectedLabel}
            />
          )}

          {!cameraEnabled && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <CameraOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Kamera Tidak Aktif</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Aktifkan kamera untuk memulai kuis
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Match Feedback */}
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Kecocokan Jawaban</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(confidence)}%
              </span>
            </div>
            <Progress
              value={Math.max(0, Math.min(100, Math.round(confidence)))}
              className="h-2.5"
            />
          </div>

          {isCorrect !== null && !isCorrect && (
            <div className="flex items-center justify-center p-4 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 text-red-700">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Coba Lagi</span>
                <span className="text-sm text-red-600">
                  Sesuaikan posisi tangan
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
