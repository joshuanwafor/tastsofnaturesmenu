import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo-trimmed.png';

interface SiteHeaderProps {
  backHref: string;
  backLabel: string;
  children?: React.ReactNode;
}

export function SiteHeader({ backHref, backLabel, children }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 grid grid-cols-[1fr_auto_1fr] items-center">
        <Link
          href={backHref}
          className="justify-self-start flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="sr-only sm:not-sr-only">{backLabel}</span>
        </Link>
        <Link href="/" aria-label="Nature's Crunch & Burst home">
          <Image src={logo} alt="Nature's Crunch & Burst" className="h-9 sm:h-11 w-auto" priority />
        </Link>
      </div>
      {children}
    </header>
  );
}
