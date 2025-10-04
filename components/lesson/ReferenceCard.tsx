import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryKey } from './types';

interface ReferenceCardProps {
  categoryName: string;
  selectedItem: string;
  selectedCategory: CategoryKey;
  completedItemsSize: number;
  groupItemsLength: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function ReferenceCard({
  categoryName,
  selectedItem,
  selectedCategory,
  onPrevious,
  onNext,
}: ReferenceCardProps) {
  return (
    <div className="space-y-4">
      {/* Reference Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {categoryName} • {selectedItem}
          </CardTitle>
          <CardDescription>Ikuti referensi gerakan di samping</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {/* Reference Image */}
            <div className="aspect-square rounded-xl border bg-background overflow-hidden shadow-sm">
              <img
                src={
                  selectedCategory === 'huruf'
                    ? `/hand/${selectedItem}/body%20dot%20(1).jpg`
                    : `/bisindo-sign-language-hand-gesture-for-letter-.jpg`
                }
                alt={`Gerakan tangan BISINDO untuk ${selectedItem}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-2 text-center">
              Pastikan posisi tangan jelas dan stabil.
            </p>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-4">
              <Button variant="outline" size="sm" onClick={onPrevious}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>
              <div className="text-sm text-center">
                <Badge variant="outline">{selectedItem}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={onNext}>
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
