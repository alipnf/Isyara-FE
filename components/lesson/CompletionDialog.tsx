import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Award, Download, Activity, Cpu, Zap } from 'lucide-react';
import { RecordedData } from './PerformanceRecorderInline';

interface CompletionDialogProps {
  open: boolean;
  categoryName: string;
  xpReward?: number | null;
  performanceData?: RecordedData | null;
}

export function CompletionDialog({
  open,
  categoryName,
  xpReward,
  performanceData,
}: CompletionDialogProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);
  const hasReward = typeof xpReward === 'number' && xpReward > 0;

  useEffect(() => {
    if (open && hasReward) {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push('/learn');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [open, hasReward, router]);

  const downloadReport = () => {
    if (!performanceData) return;
    const dataStr = JSON.stringify(performanceData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `isyara_performance_${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="[&>button]:hidden max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Pelajaran Selesai</DialogTitle>
          <DialogDescription>
            Anda sudah menyelesaikan semua {categoryName} dalam grup ini.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4">
          {hasReward ? (
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-6 rounded-lg text-center">
              <div className="relative inline-block">
                <Award
                  className="h-16 w-16 text-yellow-500 mx-auto mb-3 fill-yellow-400 stroke-yellow-600 drop-shadow-lg"
                  strokeWidth={2}
                />
              </div>
              <p className="font-bold text-xl text-yellow-700 mb-1">
                +{xpReward} XP Diperoleh
              </p>
              <p className="text-sm text-yellow-600/80 font-medium">
                Lanjutkan ke level berikutnya
              </p>
            </div>
          ) : (
            <div className="bg-muted/40 border border-muted p-6 rounded-lg text-center">
              <p className="font-semibold text-foreground mb-1">
                Latihan Ulang
              </p>
              <p className="text-sm text-muted-foreground">
                Pelajaran ini sudah pernah selesai. XP tidak bertambah.
              </p>
            </div>
          )}

          {/* Performance Report Section */}
          {performanceData && (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Laporan Performa
                </h3>
                <span className="text-xs text-muted-foreground bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {performanceData.backend}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 text-center">
                  <div className="text-[10px] text-muted-foreground mb-0.5">
                    FPS
                  </div>
                  <div className="font-bold text-lg text-green-600">
                    {performanceData.avg_fps.toFixed(0)}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 text-center">
                  <div className="text-[10px] text-muted-foreground mb-0.5">
                    Latency
                  </div>
                  <div className="font-bold text-lg text-blue-600">
                    {performanceData.model_latency_ms.toFixed(1)}
                    <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                      ms
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700 text-center">
                  <div className="text-[10px] text-muted-foreground mb-0.5">
                    Memory
                  </div>
                  <div className="font-bold text-lg text-purple-600">
                    {performanceData.memory_mb.toFixed(0)}
                    <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
                      MB
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-8 gap-2"
                onClick={downloadReport}
              >
                <Download className="w-3 h-3" />
                Download JSON Report
              </Button>
            </div>
          )}

          <div className="flex justify-center">
            <Button className="w-full" onClick={() => router.push('/learn')}>
              Lanjutkan {hasReward && countdown > 0 ? `(${countdown})` : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
