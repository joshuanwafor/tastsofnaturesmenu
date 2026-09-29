'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import { CourseOption, SIGNATURE_DINING, countSignaturePackages, signatureCourses } from '../data/menu';

const courses = [
  {
    title: 'Starter',
    hint: 'One to share',
    label: 'Starter',
    units: ['starter', 'starters'],
    limit: 1,
    options: signatureCourses.starters,
    grid: 'md:grid-cols-2',
  },
  {
    title: 'Signature Main',
    hint: 'One per guest',
    label: 'Mains',
    units: ['main', 'mains'],
    limit: SIGNATURE_DINING.guestsPerPackage,
    options: signatureCourses.mains,
    grid: 'md:grid-cols-2 lg:grid-cols-3',
  },
  {
    title: 'Dessert',
    hint: 'One per guest',
    label: 'Desserts',
    units: ['dessert', 'desserts'],
    limit: SIGNATURE_DINING.guestsPerPackage,
    options: signatureCourses.desserts,
    grid: 'md:grid-cols-3',
  },
];

// How many of each option is picked, per course, in the same order as `courses`
type Picks = number[][];

const emptyPicks = (): Picks => courses.map((course) => course.options.map(() => 0));

const sum = (counts: number[]) => counts.reduce((total, count) => total + count, 0);

function describePicks(options: CourseOption[], counts: number[]): string {
  return options
    .flatMap((option, i) => {
      if (counts[i] === 0) return [];
      return counts[i] > 1 ? `${option.name} ×${counts[i]}` : option.name;
    })
    .join(', ');
}

const stepperClasses =
  'h-9 w-9 flex items-center justify-center border border-white/15 text-white/70 transition-colors hover:border-gold/60 hover:text-gold disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15 disabled:hover:text-white/70';

export function SignatureDiningBuilder() {
  const { items, addToCart } = useCart();
  const [picks, setPicks] = useState<Picks>(emptyPicks);

  const isComplete = courses.every((course, i) => sum(picks[i]) === course.limit);
  const packagesInCart = countSignaturePackages(items);
  const remaining = courses.flatMap((course, i) => {
    const left = course.limit - sum(picks[i]);
    if (left === 0) return [];
    return `${left} ${left === 1 ? course.units[0] : course.units[1]}`;
  });

  const change = (courseIndex: number, optionIndex: number, delta: 1 | -1) => {
    setPicks((prev) =>
      prev.map((counts, i) => {
        if (i !== courseIndex) return counts;
        const { limit } = courses[i];
        // A single-choice course swaps its pick rather than blocking
        if (delta === 1 && limit === 1) return counts.map((_, j) => (j === optionIndex ? 1 : 0));
        if (delta === 1 && sum(counts) >= limit) return counts;
        return counts.map((count, j) => (j === optionIndex ? Math.max(count + delta, 0) : count));
      })
    );
  };

  const addPackage = () => {
    if (!isComplete) return;
    addToCart({
      // Same choices give the same id, so identical packages stack as quantity
      id: `signature-dining-${picks.map((counts) => counts.join('')).join('-')}`,
      name: SIGNATURE_DINING.name,
      price: SIGNATURE_DINING.price,
      courses: courses.map((course, i) => `${course.label}: ${describePicks(course.options, picks[i])}`),
    });
    setPicks(emptyPicks());
  };

  return (
    <div>
      {courses.map((course, courseIndex) => {
        const chosen = sum(picks[courseIndex]);
        const isFull = chosen === course.limit;
        return (
          <section key={course.title} className="mb-14 sm:mb-20">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-[0.08em] text-gold">{course.title}</h3>
                <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.25em] text-white/50">{course.hint}</p>
              </div>
              <p
                aria-live="polite"
                className={`text-[11px] sm:text-xs uppercase tracking-[0.2em] whitespace-nowrap ${isFull ? 'text-gold' : 'text-white/40'}`}
              >
                {chosen} of {course.limit} chosen
              </p>
            </div>

            <div className={`grid grid-cols-1 ${course.grid} gap-4`}>
              {course.options.map((option, optionIndex) => {
                const count = picks[courseIndex][optionIndex];
                const canAdd = course.limit === 1 ? count === 0 : !isFull;
                return (
                  <div
                    key={option.name}
                    className={`flex flex-col border p-5 sm:p-6 transition-colors duration-300 ${
                      count > 0 ? 'border-gold/50 bg-gold/[0.05]' : 'border-white/10'
                    }`}
                  >
                    <h4 className="font-serif text-xl sm:text-2xl leading-tight text-white">{option.name}</h4>
                    <p className="mt-2 text-sm text-white/55 font-light leading-relaxed">{option.description}</p>
                    <div className="mt-auto pt-5 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => change(courseIndex, optionIndex, -1)}
                        disabled={count === 0}
                        aria-label={`Remove ${option.name}`}
                        className={stepperClasses}
                      >
                        −
                      </button>
                      <span className={`w-5 text-center font-serif text-xl ${count > 0 ? 'text-gold' : 'text-white/40'}`}>
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => change(courseIndex, optionIndex, 1)}
                        disabled={!canAdd}
                        aria-label={`Add ${option.name}`}
                        className={stepperClasses}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <div className="border border-gold/30 bg-gradient-to-b from-gold/[0.04] to-transparent p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Your selection</p>
        <dl className="mt-6 space-y-4">
          {courses.map((course, i) => (
            <div key={course.title} className="grid grid-cols-1 sm:grid-cols-[8rem_1fr] gap-1 sm:gap-6">
              <dt className="text-[11px] uppercase tracking-[0.25em] text-white/40 sm:pt-1.5">{course.label}</dt>
              <dd className="font-serif text-lg sm:text-xl text-white">
                {describePicks(course.options, picks[i]) || <span className="text-white/25">—</span>}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-sm text-white/50 font-light">
          800 ml Voss Premium Water included. Each package serves {SIGNATURE_DINING.guestsPerPackage} guests.
        </p>
        <button
          type="button"
          onClick={addPackage}
          disabled={!isComplete}
          className="mt-8 w-full bg-gold py-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-black transition-colors hover:bg-gold/85 disabled:cursor-not-allowed disabled:opacity-35"
        >
          Add to reservation · {formatPrice(SIGNATURE_DINING.price)}
        </button>
        {!isComplete && (
          <p className="mt-3 text-center text-xs text-white/40 font-light">Still to choose: {remaining.join(', ')}</p>
        )}
      </div>

      {packagesInCart > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 border border-white/10 p-6">
          <div className="text-sm font-light">
            <p className="text-white/80">
              <span className="text-gold">✓</span> {packagesInCart} {packagesInCart === 1 ? 'package' : 'packages'} in
              your reservation — seats up to {packagesInCart * SIGNATURE_DINING.guestsPerPackage} guests
            </p>
            <p className="mt-1 text-white/45">Larger party? Build another package above.</p>
          </div>
          <Link
            href="/checkout"
            className="shrink-0 border border-gold px-6 py-3 text-center text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-black"
          >
            Continue to reservation
          </Link>
        </div>
      )}
    </div>
  );
}
