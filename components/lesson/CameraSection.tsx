import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HandDetection } from '@/components/hand-detection/HandDetection';
import { Camera, CameraOff, CheckCircle, XCircle } from 'lucide-react';
import { LessonSettings } from './types';
import { SettingsDialog } from './SettingsDialog';

interface CameraSectionProps {
  cameraEnabled: boolean;
  isDetecting: boolean;
  settings: LessonSettings;
  confidence: number;
  isCorrect: boolean | null;
  selectedItem: string;
  completedItemsSize: number;
  groupItemsLength: number;
  onToggleCamera: () => void;
  onSettingsChange: (settings: LessonSettings) => void;
  onDetection: (label: string, confidence: number) => void;
  onLiveUpdate: (label: string | null, confidencePct: number) => void;
  onStatusChange: (status: 'inactive' | 'active' | 'error') => void;
}

export function CameraSection({
  cameraEnabled,
  isDetecting,
  settings,
  confidence,
  isCorrect,
  selectedItem,
  onToggleCamera,
  onSettingsChange,
  onDetection,
  onLiveUpdate,
  onStatusChange,
}: CameraSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium">Kecocokan Soal</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(confidence)}%
            </span>
            <Progress
              value={Math.max(0, Math.min(100, Math.round(confidence)))}
              className="h-3.5 w-full sm:h-2.5 sm:flex-1 sm:max-w-[240px]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={onToggleCamera}
              className={
                cameraEnabled ? 'bg-primary text-primary-foreground' : ' '
              }
              aria-label={
                cameraEnabled ? 'Nonaktifkan kamera' : 'Aktifkan kamera'
              }
            >
              {cameraEnabled ? (
                <Camera className="h-4 w-4 mr-0 sm:mr-2" />
              ) : (
                <CameraOff className="h-4 w-4 mr-0 sm:mr-2" />
              )}
              <span className="hidden sm:inline">
                {cameraEnabled ? 'Aktif' : 'Nonaktif'}
              </span>
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
              expectedLabel={selectedItem}
            />
          )}

          {!cameraEnabled && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <CameraOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Kamera Tidak Aktif</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Aktifkan kamera untuk memulai latihan
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Match Feedback */}
        {isCorrect !== null && (
          <div
            className={`flex items-center justify-center p-3 sm:p-4 rounded-lg mt-3 sm:mt-4 ${
              isCorrect ? 'bg-green-50' : 'bg-red-50'
            }`}
          >
            {isCorrect ? (
              <div className="flex items-center gap-2 text-green-700 text-sm sm:text-base">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Gerakan Benar</span>
                <span className="text-sm text-green-600">
                  ({selectedItem} terdeteksi)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700 text-sm sm:text-base">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Coba Lagi</span>
                <span className="text-sm text-red-600">
                  Sesuaikan posisi tangan
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
