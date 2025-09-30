import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HandDetection } from '@/components/hand-detection/HandDetection';
import { Camera, CameraOff, Play, ArrowLeft, RefreshCcw } from 'lucide-react';
import { CategoryData } from './types';

interface ReviewSetupCardProps {
  category: CategoryData;
  cameraEnabled: boolean;
  onToggleCamera: () => void;
  onStart: () => void;
  onBack: () => void;
  onCameraError: () => void;
}

export function ReviewSetupCard({
  category,
  cameraEnabled,
  onToggleCamera,
  onStart,
  onBack,
  onCameraError,
}: ReviewSetupCardProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h3 className="font-semibold">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>
      </div>

      <Card className="text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCcw className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">{category.name}</CardTitle>
          <CardDescription>
            Mengingat kembali materi yang sudah dipelajari dengan lebih santai
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Review Info */}
          <div className="bg-muted/50 rounded-lg p-6 text-left">
            <h3 className="font-semibold mb-4">Informasi:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • {Math.min(10, category.items.length)} item acak dari kategori{' '}
                {category.name}
              </li>
              <li>• Tidak ada batas waktu per item</li>
              <li>• Tunjukkan gerakan tangan sesuai yang ditampilkan</li>
              <li>• Santai dan nikmati proses mengingat kembali</li>
            </ul>
          </div>

          {/* Camera Setup */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Kamera</span>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={onToggleCamera}
                className={
                  cameraEnabled ? 'bg-primary text-primary-foreground' : ''
                }
              >
                {cameraEnabled ? (
                  <Camera className="h-4 w-4 mr-2" />
                ) : (
                  <CameraOff className="h-4 w-4 mr-2" />
                )}
                {cameraEnabled ? 'Aktif' : 'Nonaktif'}
              </Button>
            </div>

            {cameraEnabled && (
              <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                <HandDetection
                  isDetecting={true}
                  showLandmarks={true}
                  onStatusChange={(status) => {
                    if (status === 'error') {
                      onCameraError();
                    }
                  }}
                  containerClassName="rounded-lg overflow-hidden"
                />
              </div>
            )}
          </div>

          <Button
            onClick={onStart}
            size="lg"
            className="w-full"
            disabled={!cameraEnabled}
          >
            <Play className="h-5 w-5 mr-2" />
            Mulai {category.name}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
