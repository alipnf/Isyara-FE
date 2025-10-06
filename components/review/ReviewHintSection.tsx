import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>{showHint ? 'Referensi Gerakan' : 'Instruksi'}</CardTitle>
      </CardHeader>
      <CardContent>
        {showHint ? (
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
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
          <div className="space-y-6">
            <div className="text-center py-8">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Posisi Jelas</p>
                  <p className="text-xs text-muted-foreground">
                    Pastikan tangan terlihat jelas di kamera
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Tahan 2 Detik</p>
                  <p className="text-xs text-muted-foreground">
                    Tahan posisi saat terdeteksi benar
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
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
      </CardContent>
    </Card>
  );
}
