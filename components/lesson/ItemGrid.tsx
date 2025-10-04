import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryKey } from './types';

interface ItemGridProps {
  groupItems: string[];
  selectedItem: string;
  completedItems: Set<string>;
  selectedCategory: CategoryKey;
  onItemSelect: (item: string) => void;
}

export function ItemGrid({
  groupItems,
  selectedItem,
  completedItems,
  selectedCategory,
  onItemSelect,
}: ItemGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pilih Huruf</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
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
