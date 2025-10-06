'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { HandDetection } from '@/components/hand-detection/HandDetection';
import { RefreshCcw, Camera, CameraOff, Play, ArrowLeft } from 'lucide-react';
import { CategoryData } from '@type/review';

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
  const handleStartReview = () => {
    if (!cameraEnabled) {
      alert('Silakan aktifkan kamera terlebih dahulu');
      return;
    }
    onStart();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h3 className="font-semibold">Review {category.name}</h3>
          <p className="text-sm text-muted-foreground">
            {category.description}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Card: Review Info & Rules */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCcw className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Review {category.name}</CardTitle>
            <CardDescription>
              Mengingat kembali materi yang sudah dipelajari dengan lebih santai
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Review Rules */}
            <div className="bg-muted/50 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-4">Informasi Review:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • {Math.min(10, category.items.length)} item acak dari
                  kategori {category.name}
                </li>
                <li>• Tidak ada batas waktu per item</li>
                <li>• Tunjukkan gerakan tangan sesuai yang ditampilkan</li>
                <li>• Santai dan nikmati proses mengingat kembali</li>
              </ul>
            </div>

            <Button
              onClick={handleStartReview}
              size="lg"
              className="w-full"
              disabled={!cameraEnabled}
            >
              <Play className="h-5 w-5 mr-2" />
              Mulai Review {category.name}
            </Button>
          </CardContent>
        </Card>

        {/* Right Card: Camera Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Kamera
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleCamera}
                className={
                  cameraEnabled ? 'bg-primary text-primary-foreground' : ''
                }
              >
                {cameraEnabled ? 'Aktif' : 'Nonaktif'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cameraEnabled ? (
              <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                <HandDetection
                  isDetecting={true}
                  showLandmarks={true}
                  onStatusChange={(status) => {
                    if (status === 'error') {
                      onCameraError();
                    }
                  }}
                  containerClassName="rounded-lg"
                  holdDuration={2}
                  expectedLabel=""
                />
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <CameraOff className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Kamera Tidak Aktif</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Aktifkan kamera untuk memulai review
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
