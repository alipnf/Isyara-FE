import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
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
  const progressPercentage = groupItems.length
    ? Math.round((completedItems.size / groupItems.length) * 100)
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm text-muted-foreground">Progress</p>
              <p className="text-sm font-semibold text-primary">
                {progressPercentage}%
              </p>
            </div>
            <Progress
              value={
                groupItems.length
                  ? (completedItems.size / groupItems.length) * 100
                  : 0
              }
              className="h-3 w-full"
            />
          </div>
        </div>
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

