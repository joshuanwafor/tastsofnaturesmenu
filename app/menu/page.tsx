import type { Metadata } from 'next';
import { SiteHeader } from '../components/SiteHeader';
import { Ornament } from '../components/Ornament';
import { SectionNav } from '../components/SectionNav';
import { walkInMenu, beverageCollection, cigarCollection, MenuItem } from '../data/menu';
import { formatPrice } from '../utils/format';

export const metadata: Metadata = {
  title: 'Walk-In Menu',
};

const collections = [
  { id: 'food', label: 'Food' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'cigars', label: 'Cigars' },
];

function CollectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.06em] text-white">{title}</h2>
      <p className="mt-4 text-[11px] sm:text-xs uppercase tracking-[0.35em] text-gold/80">{subtitle}</p>
    </div>
  );
}

function MenuList({ title, items }: { title?: string; items: MenuItem[] }) {
  return (
    <div className="mb-12 sm:mb-16">
      {title && (
        <>
          <h3 className="text-xs sm:text-sm uppercase tracking-[0.35em] text-gold">{title}</h3>
          <div aria-hidden className="mt-3 mb-2 flex items-center">
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
            <span className="h-px w-24 bg-gold/60" />
          </div>
        </>
      )}
      <ul>
        {items.map((item) => (
          <MenuRow key={`${item.name}-${item.note ?? ''}`} item={item} />
        ))}
      </ul>
    </div>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <li className="py-5 sm:py-6 border-b border-white/[0.07] last:border-0">
      <div className="flex items-baseline justify-between gap-6">
        <h4 className="font-serif text-xl sm:text-2xl text-white leading-snug">{item.name}</h4>
        <p className="font-serif text-lg sm:text-xl text-gold whitespace-nowrap">{formatPrice(item.price)}</p>
      </div>
      {item.note && (
        <p className="mt-1 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/45">{item.note}</p>
      )}
      {item.description && (
        <p className="mt-2 max-w-md text-sm text-white/55 font-light leading-relaxed">{item.description}</p>
      )}
    </li>
  );
}

function Tagline({ children }: { children: React.ReactNode }) {
  return <p className="text-center text-xs sm:text-sm uppercase tracking-[0.4em] text-white/70">{children}</p>;
}

export default function WalkInMenuPage() {
  return (
    <div className="relative isolate min-h-screen bg-black text-white">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(22,64,40,0.5),transparent_70%)]"
      />

      <SiteHeader backHref="/experience" backLabel="Experiences">
        <SectionNav sections={collections} />
      </SiteHeader>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <section id="food" className="scroll-mt-40">
          <CollectionTitle title="Walk-In Menu" subtitle="No reservation required" />
          {walkInMenu.map((section) => (
            <MenuList key={section.title} title={section.title} items={section.items} />
          ))}
        </section>

        <Ornament className="my-16 sm:my-24" />

        <section id="beverages" className="scroll-mt-40">
          <CollectionTitle title="Beverage Collection" subtitle="A curated selection for the evening" />
          {beverageCollection.map((section) => (
            <MenuList key={section.title} title={section.title} items={section.items} />
          ))}
          <Tagline>Pour &nbsp;•&nbsp; Sip &nbsp;•&nbsp; Unwind</Tagline>
        </section>

        <Ornament className="my-16 sm:my-24" />

        <section id="cigars" className="scroll-mt-40">
          <CollectionTitle title="Cigar Collection" subtitle="A curated selection for the evening" />
          <MenuList items={cigarCollection} />
          <Tagline>Cut &nbsp;•&nbsp; Light &nbsp;•&nbsp; Unwind</Tagline>
          <p className="mt-4 text-center text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-white/45">
            Whiskey pours available to complement your selection.
          </p>
        </section>

        <footer className="mt-20 sm:mt-28">
          <Ornament className="mx-auto w-full max-w-md" />
          <p className="mt-6 text-center text-[11px] sm:text-xs uppercase tracking-[0.4em] text-gold/80">
            Where taste meets distinction
          </p>
        </footer>
      </main>
    </div>
  );
}
