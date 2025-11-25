import { CheckCircle, Eye } from 'lucide-react';

import { CategoryType } from '@type/review';

interface ReviewHintSectionProps {
  showHint: boolean;
  currentItem: string;
  selectedCategory: CategoryType;
}

export function ReviewHintSection({
  showHint,
  currentItem,
  selectedCategory,
}: ReviewHintSectionProps) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl h-full min-h-0">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          {showHint ? 'Referensi Gerakan' : 'Instruksi'}
        </h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {showHint ? (
          <div className="space-y-4 h-full flex flex-col">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden shrink-0">
              <img
                src={`/hand/${currentItem}/body dot (1).jpg`}
                alt={`Gerakan ${currentItem}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-hand.png';
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Referensi gerakan untuk{' '}
                <span className="font-bold text-foreground">{currentItem}</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 h-full flex flex-col justify-center">
            <div className="text-center py-4">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-primary/5">
                <span className="text-5xl font-bold text-primary">
                  {currentItem}
                </span>
              </div>
              <p className="text-lg text-muted-foreground">
                Tunjukkan gerakan untuk{' '}
                {selectedCategory === 'huruf'
                  ? 'huruf'
                  : selectedCategory === 'angka'
                    ? 'angka'
                    : 'kata'}{' '}
                ini
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/5">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Posisi Jelas</p>
                  <p className="text-xs text-muted-foreground">
                    Pastikan tangan terlihat jelas di kamera
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/5">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Tahan 2 Detik</p>
                  <p className="text-xs text-muted-foreground">
                    Tahan posisi saat terdeteksi benar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-white/30 dark:bg-white/5 rounded-lg border border-white/20 dark:border-white/5">
                <Eye className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Lupa Gerakannya?</p>
                  <p className="text-xs text-muted-foreground">
                    Klik tombol "Hint" untuk melihat referensi
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
