'use client';

import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="mb-8">
          <svg
            className="w-20 h-20 mx-auto text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extralight mb-4">Order Confirmed</h1>
        <p className="text-white/60 font-light mb-8">
          Thank you for your order! We&apos;ll prepare your meal and contact you shortly.
        </p>
        <Link
          href="/"
          className="inline-block border border-white/20 px-8 py-3 font-light hover:border-white/40 transition-colors"
        >
          Return to Menu
        </Link>
      </div>
    </div>
  );
}

