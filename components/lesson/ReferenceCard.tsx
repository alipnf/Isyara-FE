import { Button } from '@/components/ui/button';
import { CategoryKey } from '@type/lesson';
import { useEffect, useMemo } from 'react';

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
  selectedItem,
  selectedCategory,
  groupItems,
  completedItems,
  onPrevious,
  onNext,
}: ReferenceCardProps) {
  const currentIndex = groupItems.indexOf(selectedItem);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === groupItems.length - 1;

  // Preload images for huruf category
  useEffect(() => {
    if (selectedCategory !== 'huruf') return;
    groupItems.forEach((item) => {
      const img = new Image();
      img.src = `/hand/${item}/body%20dot%20(1).jpg`;
    });
  }, [selectedCategory, groupItems]);

  const imageSrc = useMemo(() => {
    return selectedCategory === 'huruf'
      ? `/hand/${selectedItem}/body%20dot%20(1).jpg`
      : `/bisindo-sign-language-hand-gesture-for-letter-.jpg`;
  }, [selectedCategory, selectedItem]);

  // Simple instruction text
  const getInstructionText = () => {
    return `Ikuti gerakan tangan sesuai referensi di atas.`;
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6 p-6 sm:p-8 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-2xl backdrop-blur-xl rounded-2xl">
      {/* Header with Progress Counter */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gerakan Saat Ini ({currentIndex + 1}/{groupItems.length} •{' '}
          {completedItems.size} Benar)
        </h2>
      </div>

      {/* Progress Bar - Visual representation */}
      <div className="flex gap-1">
        {groupItems.map((item, index) => (
          <div
            key={item}
            className={`h-2 flex-1 rounded-full transition-all ${
              completedItems.has(item)
                ? 'bg-green-500'
                : index === currentIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
            }`}
            title={
              completedItems.has(item)
                ? `${item} - Benar`
                : index === currentIndex
                  ? `${item} - Saat ini`
                  : `${item} - Belum`
            }
          />
        ))}
      </div>

      {/* Reference Image */}
      <div className="aspect-video w-full bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
        <img
          key={selectedItem}
          src={imageSrc}
          alt={`Gerakan tangan BISINDO untuk ${selectedItem}`}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Current Gesture Info */}
      <div className="flex flex-col gap-3">
        <h3 className="text-3xl sm:text-4xl font-black text-primary">
          "{selectedItem}"
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400">
          {getInstructionText()}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onPrevious}
          disabled={isFirst}
          className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-gray-200/80 dark:bg-white/10 text-gray-800 dark:text-white font-bold hover:bg-gray-300/80 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Sebelumnya
        </button>
        <button
          onClick={onNext}
          disabled={isLast}
          className="flex-1 flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/40 hover:shadow-glow-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Berikutnya
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
