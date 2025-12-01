import Link from 'next/link';
import { Github, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-gray-200/50 dark:border-white/10 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hak Cipta: {currentYear} alipnf
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com/alipnf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com/in/alipnf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link
              href="https://instagram.com/_alipnf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
