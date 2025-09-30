import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookOpen, Camera, Users, Zap, Shield } from 'lucide-react';

export default function Home() {
  const features = [
    {
      key: 'realtime',
      Icon: Camera,
      title: 'Deteksi Real-time',
      desc: 'Teknologi AI mendeteksi gerakan tangan Anda secara langsung dengan akurasi tinggi menggunakan kamera perangkat.',
    },
    {
      key: 'feedback',
      Icon: Zap,
      title: 'Umpan Balik Instan',
      desc: 'Dapatkan respon langsung apakah gerakan tangan Anda sudah benar dengan indikator visual yang jelas dan mudah dipahami.',
    },
    {
      key: 'leaderboard',
      Icon: Users,
      title: 'Leaderboard XP',
      desc: 'Kumpulkan XP dari belajar dan kuis, naikkan peringkat Anda, dan lihat posisi Anda di antara pengguna lain.',
    },
  ] as const;

  const faqs = [
    {
      q: 'Apakah kamera saya aman?',
      a: 'Semua pemrosesan dilakukan secara lokal di perangkat Anda. Tidak ada data gambar yang dikirim ke server.',
    },
    {
      q: 'Perangkat apa yang didukung?',
      a: 'Browser modern di desktop dan mobile yang mendukung akses kamera (Chrome, Edge, Safari terbaru).',
    },
    {
      q: 'Apakah ISYARA gratis?',
      a: 'Fitur inti belajar dan kuis gratis. Fitur lanjutan akan diumumkan kemudian.',
    },
    {
      q: 'Apakah cocok untuk pemula?',
      a: 'Ya. Materi disusun bertahap dari dasar (A–Z) dengan latihan praktis dan umpan balik instan, sehingga pemula bisa mengikuti dengan nyaman.',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Belajar{' '}
            <span className="text-primary">Bahasa Isyarat Indonesia</span>{' '}
            dengan Sistem Pembelajaran Bertahap
          </h2>
          <p className="text-xl text-muted-foreground text-balance mb-8 leading-relaxed">
            ISYARA menghadirkan pembelajaran bertahap dengan gamifikasi,
            pencatatan progres, dan deteksi tangan real-time untuk pengalaman
            belajar BISINDO yang menyenangkan dan efektif.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/learn">
                <BookOpen className="mr-2 h-5 w-5" />
                Mulai Belajar
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center mb-12">
            Fitur Unggulan
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ key, Icon, title, desc }) => (
              <div key={key} className="group">
                <Card className="h-full flex flex-col bg-muted/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-border transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105 text-center">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4`}
                    >
                      <Icon className={`h-6 w-6 text-primary`} />
                    </div>
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="leading-relaxed">
                      {desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-12">FAQ</h3>
          <div className="space-y-4">
            {faqs.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card/50 backdrop-blur transition-all duration-300 hover:shadow-md"
              >
                <input
                  id={`faq-${idx}`}
                  type="checkbox"
                  className="peer hidden"
                />
                <label
                  htmlFor={`faq-${idx}`}
                  className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4"
                >
                  <span className="font-medium">{item.q}</span>
                  <span className="text-muted-foreground transition-transform duration-300 peer-checked:rotate-180">
                    ▾
                  </span>
                </label>
                <label
                  htmlFor={`faq-${idx}`}
                  className="block px-5 pb-4 pt-0 text-sm text-muted-foreground leading-relaxed hidden peer-checked:block"
                >
                  {item.a}
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
