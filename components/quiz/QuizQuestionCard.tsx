'use client';

interface QuizQuestionCardProps {
  currentItem: string;
}

export function QuizQuestionCard({ currentItem }: QuizQuestionCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl rounded-2xl text-center h-full min-h-0">
      <h2 className="text-base font-semibold text-foreground mb-2">
        Tunjukkan Huruf
      </h2>
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-2 ring-4 ring-primary/5 shrink-0">
        <span className="text-5xl font-black text-primary">{currentItem}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Tunjukkan gerakan tangan untuk huruf ini
      </p>
    </div>
  );
}
