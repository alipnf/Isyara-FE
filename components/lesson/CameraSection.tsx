import { HandDetection } from '@/components/hand-detection/HandDetection';
import { LessonSettings } from '@type/lesson';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SettingsDialog } from './SettingsDialog';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      {/* Controls: Confidence Bar, Camera Toggle, Settings, Exit */}
      <div className="flex items-center gap-4 p-4 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 backdrop-blur-xl rounded-xl">
        <div className="flex-1 flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Kecocokan
          </span>
          <Progress
            value={Math.max(0, Math.min(100, Math.round(confidence)))}
            className="h-2.5 flex-1"
          />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
            {Math.round(confidence)}%
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={cameraEnabled ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleCamera}
            className="gap-2"
          >
            <span className="material-symbols-outlined text-base">
              {cameraEnabled ? 'videocam' : 'videocam_off'}
            </span>
            <span className="hidden sm:inline">
              {cameraEnabled ? 'Aktif' : 'Nonaktif'}
            </span>
          </Button>
          <SettingsDialog
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
          <button
            onClick={() => router.push('/learn')}
            className="flex items-center justify-center w-9 h-9 rounded-md bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors border border-red-500/30"
            title="Keluar dari Lesson"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      {/* Camera Feed */}
      <div className="relative w-full aspect-[4/3] bg-gray-900/50 dark:bg-black/50 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md overflow-hidden flex items-center justify-center">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-green-500/10 to-orange-500/10"></div>

        {/* Camera feed or placeholder */}
        {cameraEnabled ? (
          <HandDetection
            isDetecting={isDetecting}
            showLandmarks={settings.showHandLandmarks}
            showPerformanceStats={settings.showPerformanceStats}
            onDetection={onDetection}
            onLiveUpdate={onLiveUpdate}
            onStatusChange={onStatusChange}
            containerClassName="rounded-2xl"
            holdDuration={settings.holdDuration[0]}
            confidenceThreshold={settings.confidenceThreshold[0] / 100}
            expectedLabel={selectedItem}
          />
        ) : (
          <div className="text-center p-8">
            <span className="material-symbols-outlined text-6xl text-white/50 mb-4">
              videocam
            </span>
            <p className="text-white/70">Umpan Kamera AI akan muncul di sini</p>
          </div>
        )}

        {/* Correct Feedback Overlay */}
        {isCorrect === true && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 flex items-center justify-center bg-green-500/80 rounded-full shadow-glow-green border-4 border-white">
                <span className="material-symbols-outlined text-6xl text-white">
                  check
                </span>
              </div>
              <p className="text-2xl font-bold text-white">Benar!</p>
            </div>
          </div>
        )}

        {/* Incorrect Feedback Overlay */}
        {isCorrect === false && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 flex items-center justify-center bg-red-500/80 rounded-full shadow-glow-red border-4 border-white">
                <span className="material-symbols-outlined text-6xl text-white">
                  close
                </span>
              </div>
              <p className="text-2xl font-bold text-white">Coba Lagi</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
