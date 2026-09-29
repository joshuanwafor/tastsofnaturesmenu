import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { Ornament } from '../components/Ornament';
import { SIGNATURE_DINING } from '../data/menu';
import { formatPrice } from '../utils/format';

export const metadata: Metadata = {
  title: 'Choose Your Experience',
};

interface ExperienceCardProps {
  href: string;
  title: string;
  requirement: string;
  cta: string;
  index: number;
  children: React.ReactNode;
}

function ExperienceCard({ href, title, requirement, cta, index, children }: ExperienceCardProps) {
  return (
    // Cards rise in one after the other; their border lights run half a turn apart
    <div className="flex motion-safe:animate-rise" style={{ animationDelay: `${150 + index * 150}ms` }}>
      <Link
        href={href}
        style={{ animationDelay: `${index * -3}s` }}
        className="group flex w-full flex-col p-8 sm:p-10 sweep-border [--sweep-fill:linear-gradient(to_bottom,#0d0d0d,#000)] hover:[--sweep-base:rgb(201_164_92/0.45)] motion-safe:animate-sweep transition-transform duration-300 active:scale-[0.98]"
      >
        <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-[0.06em] text-gold">{title}</h2>
        <p className="mt-2 text-[11px] sm:text-xs uppercase tracking-[0.3em] text-white/60">{requirement}</p>
        <div className="mt-6 mb-8 h-px w-16 bg-gold/50" />
        <div className="space-y-3 text-sm sm:text-base text-white/75 font-light leading-relaxed">{children}</div>
        <span className="mt-auto pt-10 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold">
          {cta}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-safe:animate-nudge"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M20 12H4" />
          </svg>
        </span>
      </Link>
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader backHref="/" backLabel="Home" />

      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="text-center mb-12 sm:mb-16 motion-safe:animate-rise">
          <h1 className="font-serif uppercase text-gold leading-none">
            <span className="block text-4xl sm:text-6xl tracking-[0.08em]">Choose Your</span>
            <span className="block mt-2 text-5xl sm:text-7xl tracking-[0.06em]">Experience</span>
          </h1>
          <Ornament className="mx-auto mt-8 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          <ExperienceCard
            href="/signature"
            index={0}
            title="Signature Dining"
            requirement="Reservation required"
            cta="Reserve a table"
          >
            <p className="font-serif text-gold">
              <span className="text-4xl sm:text-5xl">{formatPrice(SIGNATURE_DINING.price)}</span>
              <span className="ml-2 text-xs uppercase tracking-[0.25em]">for two</span>
            </p>
            <p>A three-course dining experience for two.</p>
            <p>
              <span className="whitespace-nowrap">Starter to share &nbsp;•</span>{' '}
              <span className="whitespace-nowrap">Main per guest &nbsp;•</span>{' '}
              <span className="whitespace-nowrap">Dessert per guest</span>
            </p>
            <p>800 ml Voss Premium Water included</p>
          </ExperienceCard>

          <ExperienceCard
            href="/menu"
            index={1}
            title="Walk-In Dining"
            requirement="No reservation required"
            cta="View the menu"
          >
            <p>Enjoy Nature&apos;s at your own pace.</p>
            <p>Choose individually from our selection of</p>
            <p className="font-serif text-lg sm:text-xl text-white">
              Starters &nbsp;•&nbsp; Mains &nbsp;•&nbsp; Desserts
            </p>
          </ExperienceCard>
        </div>
      </main>
    </div>
  );
}
