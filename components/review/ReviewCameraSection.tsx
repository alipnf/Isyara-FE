import { Button } from '@/components/ui/button';

import { Progress } from '@/components/ui/progress';
import { HandDetection } from '@/components/hand-detection/HandDetection';
import { Camera } from 'lucide-react';

interface ReviewCameraSectionProps {
  isDetecting: boolean;
  currentItem: string;
  confidence: number;
  onDetection: (label: string, confidence: number) => void;
  onLiveUpdate: (label: string | null, confidence: number) => void;
  onSkip: () => void;
  onExit: () => void;
}

export function ReviewCameraSection({
  isDetecting,
  currentItem,
  confidence,
  onDetection,
  onLiveUpdate,
  onSkip,
  onExit,
}: ReviewCameraSectionProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl h-full">
      {/* Header: Title & Confidence */}
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

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
          >
            Keluar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSkip}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 shrink-0"
          >
            Lewati
          </Button>
        </div>
      </div>

      {/* Camera Feed */}
      <div className="relative w-full aspect-video bg-gray-900/50 dark:bg-black/50 rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl backdrop-blur-md flex items-center justify-center">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-green-500/10 to-orange-500/10 pointer-events-none"></div>

        <HandDetection
          isDetecting={isDetecting}
          onDetection={onDetection}
          onLiveUpdate={onLiveUpdate}
          showLandmarks={true}
          expectedLabel={currentItem}
          confidenceThreshold={0.75}
          holdDuration={2}
          containerClassName="rounded-xl w-full h-full relative z-10"
        />
      </div>
    </div>
  );
}
