import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CategoryKey } from './types';

interface ReferenceCardProps {
  categoryName: string;
  selectedItem: string;
  selectedCategory: CategoryKey;
  groupItems: string[];
  completedItems: Set<string>;
  onItemSelect: (item: string) => void;
}

export function ReferenceCard({
  categoryName,
  selectedItem,
  selectedCategory,
  groupItems,
  completedItems,
  onItemSelect,
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

            {/* Inline Item */}
            <div className="space-y-2 mt-5">
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
            </div>

            {/* No middle badge; selection shown by button state */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
