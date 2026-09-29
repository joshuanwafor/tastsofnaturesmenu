import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SignatureDiningBuilder } from '../components/SignatureDiningBuilder';
import { Cart } from '../components/Cart';
import { SIGNATURE_DINING } from '../data/menu';
import { formatPrice } from '../utils/format';

export const metadata: Metadata = {
  title: 'Signature Dining',
};

const includes = [
  ['Starter', 'to share'],
  ['Signature Main', 'per guest'],
  ['Dessert', 'per guest'],
  ['800 ml', 'Voss Premium Water'],
];

export default function SignatureDiningPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader backHref="/experience" backLabel="Experiences" />

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-32">
        <div className="text-center mb-14 sm:mb-20 motion-safe:animate-rise">
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl uppercase tracking-[0.06em] text-gold">
            Signature Dining
          </h1>
          <p className="mt-4 text-[11px] sm:text-xs uppercase tracking-[0.35em] text-white/60">Reservation required</p>
          <div className="mx-auto my-8 h-px w-20 bg-gold/50" />
          <p className="font-serif text-gold">
            <span className="text-5xl sm:text-6xl">{formatPrice(SIGNATURE_DINING.price)}</span>
            <span className="ml-3 text-sm uppercase tracking-[0.25em]">for two</span>
          </p>
          <p className="mt-4 text-sm sm:text-base text-white/70 font-light">
            A curated three-course dining experience for two.
          </p>
        </div>

        <div className="mb-16 sm:mb-24">
          <p className="mb-5 text-center text-xs uppercase tracking-[0.35em] text-gold">Includes</p>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/10 bg-white/10">
            {includes.map(([item, detail]) => (
              <li key={item} className="bg-black px-4 py-5 text-center text-sm font-light">
                <span className="block text-white/85">{item}</span>
                <span className="block text-white/50">{detail}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-[0.06em] text-white">Choose Your Courses</h2>
          <p className="mt-3 text-sm text-white/55 font-light">
            A starter to share, then a main and a dessert for each guest.
          </p>
        </div>

        <SignatureDiningBuilder />

        <div className="mt-16 sm:mt-24 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gold">Dining note</p>
          <p className="mt-3 text-sm text-white/60 font-light">
            Additional beverages ordered during your dining experience are charged separately.
          </p>
          <Link
            href="/menu#beverages"
            className="mt-4 inline-block text-xs uppercase tracking-[0.25em] text-white/50 underline underline-offset-8 decoration-white/20 hover:text-gold hover:decoration-gold/60 transition-colors"
          >
            View the beverage collection
          </Link>
        </div>
      </main>

      <Cart />
    </div>
  );
}
