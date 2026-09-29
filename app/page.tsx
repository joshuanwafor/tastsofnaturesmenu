import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/logo-gold.png';
import { Ornament } from './components/Ornament';

export default function Home() {
  return (
    <main className="relative isolate min-h-svh overflow-hidden bg-black text-white flex flex-col items-center justify-center px-6 pb-36">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(28,72,46,0.45),transparent_65%)]"
      />

      <div className="flex flex-col items-center text-center motion-safe:animate-rise">
        <div className="relative w-72 sm:w-96 md:w-[30rem]">
          <Image src={logo} alt="Nature's Crunch & Burst" priority className="block w-full h-auto" />
          {/* Foil glint, masked to the logo's shape */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_40%,rgb(255_248_228/0.9)_50%,transparent_60%)] bg-size-[250%_100%] bg-position-[150%_0] mix-blend-screen motion-safe:animate-sheen"
            style={{
              maskImage: `url(${logo.src})`,
              WebkitMaskImage: `url(${logo.src})`,
              maskSize: '100% 100%',
              WebkitMaskSize: '100% 100%',
            }}
          />
        </div>
        <Ornament className="mt-10 mb-6 w-48 sm:w-64" />
        <p className="text-[11px] sm:text-xs uppercase tracking-[0.4em] text-gold">
          Where taste meets distinction
        </p>
      </div>

      {/* Floating CTA */}
      <div className="fixed inset-x-0 bottom-10 sm:bottom-14 z-50 flex justify-center px-6 motion-safe:animate-rise [animation-delay:700ms]">
        <Link href="/experience" className="group motion-safe:animate-float">
          <span className="flex items-center gap-3 whitespace-nowrap rounded-full border border-gold bg-black/70 backdrop-blur-md px-7 sm:px-10 py-4 text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gold shadow-[0_0_36px_rgb(201_164_92/0.18)] motion-safe:animate-beacon transition-colors duration-300 group-hover:bg-gold group-hover:text-black">
            Choose Your Experience
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5l7 7-7 7M20 12H4" />
            </svg>
          </span>
        </Link>
      </div>
    </main>
  );
}
