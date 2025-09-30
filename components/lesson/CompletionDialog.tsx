import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award } from 'lucide-react';

interface CompletionDialogProps {
  open: boolean;
  categoryName: string;
}

export function CompletionDialog({
  open,
  categoryName,
}: CompletionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="[&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Pelajaran Selesai</DialogTitle>
          <DialogDescription>
            Anda sudah menyelesaikan semua {categoryName} dalam grup ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-6 rounded-lg text-center">
            <div className="relative inline-block">
              <Award
                className="h-16 w-16 text-yellow-500 mx-auto mb-3 fill-yellow-400 stroke-yellow-600 drop-shadow-lg"
                strokeWidth={2}
              />
            </div>
            <p className="font-bold text-xl text-yellow-700 mb-1">
              +50 XP Diperoleh
            </p>
            <p className="text-sm text-yellow-600/80 font-medium">
              Lanjutkan ke level berikutnya
            </p>
          </div>
          <div className="flex justify-center">
            <Button asChild className="w-full">
              <Link href="/learn">Lanjutkan</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

