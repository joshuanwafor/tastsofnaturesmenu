'use client';

import { useCart } from '../contexts/CartContext';

interface AddToCartButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    description?: string;
  };
  variant?: 'default' | 'main-course';
}

export function AddToCartButton({ item, variant = 'default' }: AddToCartButtonProps) {
  const { addToCart, removeFromCart, items: cartItems } = useCart();

  const cartItem = cartItems.find(cartItem => cartItem.name === item.name);
  const isItemInCart = !!cartItem;

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      removeFromCart(cartItem.id);
    }
  };

  const baseClasses = 'font-light transition-all duration-300';
  const addedClasses = 'border-white/40 bg-white/10 text-white/60';
  const enabledClasses = 'border-white/20 hover:border-white/40 hover:bg-white/5';

  if (variant === 'main-course') {
    return (
      <button
        onClick={isItemInCart ? handleRemove : handleAdd}
        className={`w-full border py-2.5 sm:py-3 text-xs sm:text-sm ${baseClasses} ${
          isItemInCart ? addedClasses : enabledClasses
        } flex items-center justify-center gap-2`}
      >
        {isItemInCart ? (
          <>
            <span>✓ Added</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
          </>
        ) : (
          'Add to Cart'
        )}
      </button>
    );
  }

  return (
    <button
      onClick={isItemInCart ? handleRemove : handleAdd}
      className={`w-full border py-2 sm:py-2.5 text-xs sm:text-sm ${baseClasses} ${
        isItemInCart ? addedClasses : enabledClasses
      } flex items-center justify-center gap-2`}
    >
      {isItemInCart ? (
        <>
          <span>✓ Added</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
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
        </>
      ) : (
        'Add to Cart'
      )}
    </button>
  );
}

