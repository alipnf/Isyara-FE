import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      {/* Background Blobs */}
      {/* Background Blobs Removed */}

      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl">
          <main className="flex flex-col gap-20 sm:gap-24 md:gap-32 py-20 sm:py-24 md:py-32">
            {/* Hero Section */}
            <section className="text-center">
              <div className="flex flex-col items-center gap-6">
                <h1 className="text-4xl font-black leading-tight tracking-tighter sm:text-5xl md:text-6xl text-gray-900 dark:text-white">
                  Belajar Bahasa Isyarat Indonesia dengan AI
                </h1>
                <p className="max-w-2xl text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  Jadikan belajar Bahasa Isyarat Indonesia mudah dan
                  menyenangkan dengan pelacakan tangan AI real-time kami.
                </p>
                <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-primary/40 hover:shadow-glow-primary transition-all duration-300">
                  <span className="truncate">Mulai Belajar</span>
                </button>
              </div>
            </section>

            {/* Features Section */}
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-1 flex-col gap-4 rounded-xl p-6 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      photo_camera
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Deteksi Real-time
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Gunakan kamera perangkat Anda untuk pelacakan tangan dan
                      pengenalan gerakan secara langsung.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 rounded-xl p-6 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      bolt
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Umpan Balik Instan
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI cerdas kami memberikan koreksi langsung untuk membantu
                      Anda belajar lebih cepat.
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 rounded-xl p-6 bg-white/40 dark:bg-white/5 border border-white/50 dark:border-white/10 shadow-lg backdrop-blur-xl">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-3xl">
                      emoji_events
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Pembelajaran Gamifikasi
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Dapatkan poin, buka level baru, dan ambil tantangan untuk
                      tetap termotivasi.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="flex flex-col items-center gap-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Pertanyaan yang Sering Diajukan
                </h2>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  Tidak menemukan jawaban yang Anda cari? Hubungi tim kami.
                </p>
              </div>
              <div className="w-full max-w-3xl flex flex-col">
                <Accordion type="single" collapsible className="w-full">
                  {[
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
                  ].map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index + 1}`}
                      className="border-b border-gray-200 dark:border-white/10"
                    >
                      <AccordionTrigger className="text-base font-medium text-gray-800 dark:text-gray-200 hover:no-underline py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600 dark:text-gray-400 pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
