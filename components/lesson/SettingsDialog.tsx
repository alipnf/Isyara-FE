import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';
import { LessonSettings } from '@type/lesson';

interface SettingsDialogProps {
  settings: LessonSettings;
  onSettingsChange: (settings: LessonSettings) => void;
}

export function SettingsDialog({
  settings,
  onSettingsChange,
}: SettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Pengaturan">
          <Settings className="h-4 w-4 mr-0 sm:mr-2" />
          <span className="hidden sm:inline">Pengaturan</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pengaturan Kamera & Deteksi</DialogTitle>
          <DialogDescription>
            Sesuaikan pengaturan untuk pengalaman latihan yang optimal
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Hold Duration */}
          <div className="grid gap-2">
            <Label>Durasi Tahan: {settings.holdDuration[0]} detik</Label>
            <Slider
              value={settings.holdDuration}
              onValueChange={(value) =>
                onSettingsChange({
                  ...settings,
                  holdDuration: value as [number],
                })
              }
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Berapa lama gerakan harus dipertahankan untuk konfirmasi
            </p>
          </div>

          {/* Confidence Threshold */}
          <div className="grid gap-2">
            <Label>Ambang Kecocokan: {settings.confidenceThreshold[0]}%</Label>
            <Slider
              value={settings.confidenceThreshold}
              onValueChange={(value) =>
                onSettingsChange({
                  ...settings,
                  confidenceThreshold: value as [number],
                })
              }
              max={95}
              min={50}
              step={5}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Persentase kecocokan minimum agar gerakan dianggap benar
            </p>
          </div>

          {/* Toggle Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tampilkan Hand Landmarks</Label>
                <p className="text-xs text-muted-foreground">
                  Menampilkan titik-titik deteksi tangan
                </p>
              </div>
              <Switch
                checked={settings.showHandLandmarks}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    showHandLandmarks: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Advance</Label>
                <p className="text-xs text-muted-foreground">
                  Otomatis lanjut ke item berikutnya
                </p>
              </div>
              <Switch
                checked={settings.autoAdvance}
                onCheckedChange={(checked) =>
                  onSettingsChange({
                    ...settings,
                    autoAdvance: checked,
                  })
                }
              />
            </div>
          </div>

          {/* Performance stats toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tampilkan Metrik Kinerja</Label>
              <p className="text-xs text-muted-foreground">
                Backend, FPS, latensi, dan memori TFJS pada tampilan kamera
              </p>
            </div>
            <Switch
              checked={settings.showPerformanceStats}
              onCheckedChange={(checked) =>
                onSettingsChange({
                  ...settings,
                  showPerformanceStats: checked,
                })
              }
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
