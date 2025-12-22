'use client';

import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/format';
import Link from 'next/link';

export function Cart() {
  const { items, removeFromCart, updateQuantity, getTotal, getItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-white text-black px-6 py-4 rounded-full shadow-2xl hover:bg-gray-100 transition-all duration-300 flex items-center gap-3"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span className="font-light">Cart</span>
        {getItemCount() > 0 && (
          <span className="bg-black text-white rounded-full px-2 py-1 text-xs font-light">
            {getItemCount()}
          </span>
        )}
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-black border-l border-white/10 z-50 overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-light text-white">Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 font-light">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-6 mb-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-white/10 pb-6 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-light mb-1">{item.name}</h3>
                        <p className="text-white/60 text-sm font-extralight">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-white/40 hover:text-white transition-colors ml-4"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center font-light"
                      >
                        −
                      </button>
                      <span className="text-white font-light w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center font-light"
                      >
                        +
                      </button>
                      <span className="ml-auto text-white font-light">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white/60 font-light">Total</span>
                  <span className="text-2xl text-white font-light">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-white text-black py-4 text-center font-light hover:bg-gray-100 transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

