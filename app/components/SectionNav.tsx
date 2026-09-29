'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: string;
  label: string;
}

export function SectionNav({ sections }: { sections: Section[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    // The section crossing a thin band just above mid-screen is the one being read
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -59% 0px' }
    );
    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    const section = document.getElementById(id);
    if (!section) return;
    e.preventDefault();
    setActiveId(id);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav className="border-t border-gold/20">
      <ul className="max-w-5xl mx-auto flex justify-center gap-3 sm:gap-5 px-4 py-3">
        {sections.map((section, index) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(e) => scrollTo(e, section.id)}
                aria-current={isActive ? 'true' : undefined}
                style={{ animationDelay: `${index * -2}s` }}
                className={`block rounded-full px-4 sm:px-5 py-2 text-[11px] sm:text-xs uppercase tracking-[0.3em] transition-colors duration-300 ${
                  isActive
                    ? 'border border-gold bg-gold text-black'
                    : 'sweep-border [--sweep-base:rgb(201_164_92/0.3)] motion-safe:animate-sweep text-gold/90 hover:text-gold'
                }`}
              >
                {/* Offset the trailing letter-spacing so the label sits centred */}
                <span className="-mr-[0.3em]">{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
