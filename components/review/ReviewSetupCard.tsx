'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HandDetection } from '@/components/hand-detection/HandDetection';
import { CategoryData } from '@type/review';
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Brain,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

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
  // Auto-enable camera on mount
  useEffect(() => {
    if (!cameraEnabled) {
      onToggleCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    if (!cameraEnabled) {
      alert('Silakan aktifkan kamera terlebih dahulu');
      return;
    }
    onStart();
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <Button
          variant="outline"
          onClick={onBack}
          className="rounded-full border-slate-200 dark:border-slate-700/80 hover:bg-muted dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Info & Instructions */}
        <div className="flex flex-col gap-6 p-8 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl h-full">
          <div className="flex-1 space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 grid w-14 h-14 place-items-center bg-primary/10 rounded-xl text-primary">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Kilas Balik Materi: {category.name}
                </h1>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Panduan Kilas Balik:
              </h2>
              <ul className="space-y-3">
                {[
                  'Ikuti gerakan tangan yang ditampilkan',
                  'Pastikan pencahayaan cukup',
                  'Tahan posisi tangan selama 2 detik',
                  'Gunakan tombol "Hint" jika lupa gerakan',
                ].map((rule, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/5"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground text-sm font-medium">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            onClick={handleStart}
            className="w-full h-14 text-lg font-bold rounded-full shadow-lg shadow-primary/40 hover:shadow-glow-primary transition-all duration-300 hover:scale-[1.02] mt-auto"
            disabled={!cameraEnabled}
          >
            Mulai Kilas Balik
          </Button>
        </div>

        {/* Right Column: Camera Setup */}
        <div className="flex flex-col gap-6 p-8 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Pengaturan Kamera
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Kamera Aktif
              </span>
              <button
                role="switch"
                aria-checked={cameraEnabled}
                onClick={onToggleCamera}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  cameraEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    cameraEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="w-full aspect-video bg-gray-900/50 dark:bg-black/50 rounded-xl flex flex-col items-center justify-center overflow-hidden border border-slate-200 dark:border-white/10 relative flex-1 min-h-[240px] shadow-2xl backdrop-blur-md">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-green-500/10 to-orange-500/10 pointer-events-none"></div>

            {cameraEnabled ? (
              <HandDetection
                isDetecting={true}
                showLandmarks={true}
                onDetection={() => {}}
                onLiveUpdate={() => {}}
                onStatusChange={(status) => {
                  if (status === 'error') {
                    onCameraError();
                  }
                }}
                containerClassName="w-full h-full relative z-10"
                holdDuration={2}
                expectedLabel=""
              />
            ) : (
              <div className="text-center p-4 relative z-10">
                <CameraOff className="h-12 w-12 text-white/50 mx-auto mb-3" />
                <p className="text-white/70 font-medium">
                  Umpan Kamera AI akan muncul di sini
                </p>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-orange-700 dark:text-orange-400 text-sm">
                  Tips Pencahayaan
                </h3>
                <p className="text-sm text-orange-600/80 dark:text-orange-400/80 mt-1">
                  Pastikan Anda berada di area yang terang agar AI dapat
                  mendeteksi gerakan tangan Anda dengan lebih baik.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
