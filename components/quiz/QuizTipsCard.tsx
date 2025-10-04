'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function QuizTipsCard() {
  return (
    <Card className="bg-blue-50/50 border-blue-200/50">
      <CardHeader>
        <CardTitle className="text-blue-700">Tips Kuis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          • Gerakan harus jelas dan stabil
        </p>
        <p className="text-sm text-muted-foreground">
          • Jangan terburu-buru, fokus pada akurasi
        </p>
        <p className="text-sm text-muted-foreground">
          • Gunakan seluruh waktu yang tersedia
        </p>
      </CardContent>
    </Card>
  );
}
