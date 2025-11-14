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
import { Brain, Camera, CameraOff, Play, ArrowLeft } from 'lucide-react';
import type { CategoryType } from '@type/quiz';
import { categories } from './quizData';

interface QuizSetupCardProps {
  selectedCategory: CategoryType;
  cameraEnabled: boolean;
  onBack: () => void;
  onStartQuiz: () => void;
  onToggleCamera: () => void;
  onDetection?: (label: string) => void;
  onLiveUpdate?: (label: string | null, confidence: number) => void;
  onStatusChange?: (status: 'inactive' | 'active' | 'error') => void;
}

export function QuizSetupCard({
  selectedCategory,
  cameraEnabled,
  onBack,
  onStartQuiz,
  onToggleCamera,
  onDetection,
  onLiveUpdate,
  onStatusChange,
}: QuizSetupCardProps) {
  const handleStartQuiz = () => {
    if (!cameraEnabled) {
      alert('Silakan aktifkan kamera terlebih dahulu');
      return;
    }
    onStartQuiz();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h3 className="font-semibold">
            Kuis {categories[selectedCategory].name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {categories[selectedCategory].description}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Card: Quiz Info & Rules */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              Kuis {categories[selectedCategory].name}
            </CardTitle>
            <CardDescription>
              Uji kemampuan Anda dengan soal acak dalam waktu terbatas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quiz Rules */}
            <div className="bg-muted/50 rounded-lg p-6 text-left">
              <h3 className="font-semibold mb-4">Aturan Kuis:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  • {Math.min(10, categories[selectedCategory].items.length)}{' '}
                  soal acak dari kategori {categories[selectedCategory].name}
                </li>
                <li>• Waktu 15 detik per soal</li>
                <li>• Tunjukkan gerakan tangan sesuai yang diminta</li>
                <li>• Skor minimum 70% untuk lulus</li>
              </ul>
            </div>

            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="w-full"
              disabled={!cameraEnabled}
            >
              <Play className="h-5 w-5 mr-2" />
              Mulai Kuis {categories[selectedCategory].name}
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
                {cameraEnabled ? 'Nonaktif' : 'Aktif'}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cameraEnabled ? (
              <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                <HandDetection
                  isDetecting={true}
                  showLandmarks={true}
                  onDetection={onDetection || (() => {})}
                  onLiveUpdate={onLiveUpdate || (() => {})}
                  onStatusChange={onStatusChange || (() => {})}
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
                    Aktifkan kamera untuk memulai kuis
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
