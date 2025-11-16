import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export function ReviewCameraSection({
  isDetecting,
  currentItem,
  confidence,
  onDetection,
  onLiveUpdate,
  onSkip,
}: ReviewCameraSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Kamera & Deteksi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera with proper aspect ratio */}
        <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
          <HandDetection
            isDetecting={isDetecting}
            onDetection={onDetection}
            onLiveUpdate={onLiveUpdate}
            showLandmarks={true}
            expectedLabel={currentItem}
            confidenceThreshold={0.75}
            holdDuration={2}
            containerClassName="rounded-lg"
          />
        </div>

        {/* Confidence Meter */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Tingkat Keyakinan</span>
            <span className="text-lg font-bold text-primary">
              {confidence}%
            </span>
          </div>
          <Progress value={confidence} className="h-3" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onSkip}>
            Lewati
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
