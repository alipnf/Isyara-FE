import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function LeaderboardActions() {
  return (
    <div className="text-center mt-6 sm:mt-8 mb-4">
      <Button asChild size="lg" className="w-full sm:w-auto">
        <Link href="/learn">
          <Star className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">
            Mulai Belajar untuk Naik Peringkat
          </span>
        </Link>
      </Button>
    </div>
  );
}
