import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryKey } from './types';

interface ReferenceCardProps {
  categoryName: string;
  selectedItem: string;
  selectedCategory: CategoryKey;
  groupItems: string[];
  completedItems: Set<string>;
  onItemSelect: (item: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function ReferenceCard({
  categoryName,
  selectedItem,
  selectedCategory,
  groupItems,
  completedItems,
  onItemSelect,
  onPrevious,
  onNext,
}: ReferenceCardProps) {
  const currentIndex = groupItems.indexOf(selectedItem);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === groupItems.length - 1;
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {categoryName} • {selectedItem}
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={isFirst}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={isLast}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="text-sm">
          Ikuti referensi gerakan di samping
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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

        {/* Inline Item */}
        <div className="flex justify-between gap-2">
          {groupItems.map((item) => {
            const isSelected = selectedItem === item;
            const isDone = completedItems.has(item);
            const variant = isSelected || isDone ? 'default' : 'outline';
            return (
              <Button
                key={item}
                variant={variant as any}
                size="sm"
                onClick={() => onItemSelect(item)}
                className={`aspect-square p-0 font-semibold ${
                  isDone
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                    : ''
                } ${selectedCategory === 'kata' ? 'text-xs' : ''}`}
                title={isDone ? 'Sudah benar' : 'Belum selesai'}
              >
                {item}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
