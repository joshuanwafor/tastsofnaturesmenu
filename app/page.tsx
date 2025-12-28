'use client';

import Image from 'next/image';
import { useCart } from './contexts/CartContext';
import { formatPrice } from './utils/format';

const solsticeMenuItems = {
  appetizers: [
    { name: "Caramelized Pineapple Kabobs", price: 20000 },
    { name: "Red Potato Crackers with Fruity Yoghurt Dip", price: 20000 },
    { name: "Smoked Chicken Spring Rolls", price: 20000 },
    { name: "Ram Samosa", price: 25000 },
  ],
  salads: [
    { 
      name: "Mesclun Salad", 
      description: "Kale, coriander, lettuce, arugula, spinach, celery. Tangy-Tangy or Angel splash dressing.",
      price: 25000 
    },
    { 
      name: "Mexican Salad", 
      description: "Potato, beetroot, avocado, seasoned with olive oil.",
      price: 25000 
    },
    { 
      name: "Lamo Salad", 
      description: "Chicken and rice salad",
      price: 50000 
    },
    { 
      name: "Salad Of The Day", 
      description: "Build your favourite salad platter from our daily selection of fresh vegetable and dressings.",
      price: 45000 
    },
    { 
      name: "Steamed Aromatic Compound Salad", 
      price: 40000 
    },
  ],
  mains: [
    { 
      name: "Rice 16", 
      description: "A sixteen-ingredient special signature basmati rice served with your choice of Turkey or Prawns, or Ram strips.",
      price: 60000 
    },
    { 
      name: "Seafood Party", 
      description: "A luxurious mix of prawns, shrimps, calamari, octopus, white fish, and snail, served with three sides, three salads, and a signature lemon sauce.",
      price: 150000 
    },
    { 
      name: "Joplan Bowl", 
      description: "Caribbean-inspired platter of grilled fruits, plantain, and jerky rice. Choice of two proteins.",
      price: 57000 
    },
    { 
      name: "Natures Pot", 
      description: "Cajun ram and vegetable stew, served with grilled vegetables or brown basmati rice.",
      price: 57000 
    },
  ],
  desserts: [
    { name: "Pineapple Upside-Down Cake", price: 25000 },
    { name: "Chocolate-Dipped Strawberries", price: 25000 },
    { name: "Fruicuterie Board", price: 25000 },
    { name: "Mixed Berry Tart", price: 25000 },
  ],
};

function generateId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}

export default function Home() {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sleek Header */}
      <header className="border-b border-gray-900/50 sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-20 sm:h-24 md:h-28 py-2">
          <img
                src="/logo.png"
                alt="Nature's Crunch & Burst Logo"
                className="relative w-full h-[300px] object-contain"
               
              />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-32">
        {/* Elegant Page Title */}
        <div className="text-center mb-16 sm:mb-24 md:mb-32">
          <div className="inline-block mb-4 sm:mb-6">
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-500 font-light">Seasonal</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white mb-4 sm:mb-6 md:mb-8 tracking-tight leading-none">
            SOLSTICE
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extralight text-white mb-8 sm:mb-10 md:mb-12 tracking-tight leading-none">
            MENU
          </h2>
          <div className="w-16 sm:w-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="text-sm sm:text-base text-white/60 font-light tracking-wide max-w-2xl mx-auto px-4">
            A minimum spend of ₦150,000 is required for checkout. Your order total is calculated by multiplying selected items by the number of guests in your party.
          </p>
        </div>

        {/* Appetizers Section */}
        <section className="mb-16 sm:mb-24 md:mb-32">
          <div className="flex items-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-white/30"></div>
            <h3 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 font-light px-4 sm:px-6 md:px-8">Appetizers</h3>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-white/30"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {solsticeMenuItems.appetizers.map((item, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-950/50 to-black/50 border border-white/5 rounded-none p-6 sm:p-8 md:p-10 hover:border-white/10 transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-950/70 hover:to-black/70"
              >
                <div className="flex flex-col justify-between h-full min-h-[160px] sm:min-h-[180px]">
                  <h4 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4 tracking-tight leading-tight">{item.name}</h4>
                  <div className="mt-auto">
                    <p className="text-lg sm:text-xl font-extralight text-white/80 mb-3 sm:mb-4">{formatPrice(item.price)}</p>
                    <button
                      onClick={() => addToCart({
                        id: generateId(item.name),
                        name: item.name,
                        price: item.price,
                      })}
                      className="w-full border border-white/20 py-2 sm:py-2.5 text-xs sm:text-sm font-light hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-px bg-white/20 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Salad Bar Section */}
        <section className="mb-16 sm:mb-24 md:mb-32">
          <div className="flex items-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-white/30"></div>
            <h3 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 font-light px-4 sm:px-6 md:px-8">Salad Bar</h3>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-white/30"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {solsticeMenuItems.salads.map((item, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-950/50 to-black/50 border border-white/5 rounded-none p-6 sm:p-8 md:p-10 hover:border-white/10 transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-950/70 hover:to-black/70"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2 sm:gap-0">
                  <h4 className="text-xl sm:text-2xl font-light text-white pr-0 sm:pr-4 tracking-tight leading-tight flex-1">{item.name}</h4>
                  <p className="text-lg sm:text-xl font-extralight text-white/80 whitespace-nowrap">{formatPrice(item.price)}</p>
                </div>
                {item.description && (
                  <p className="text-xs sm:text-sm text-gray-400/80 leading-relaxed font-light tracking-wide mt-4 sm:mt-6 mb-4 sm:mb-6">{item.description}</p>
                )}
                <button
                  onClick={() => addToCart({
                    id: generateId(item.name),
                    name: item.name,
                    price: item.price,
                    description: item.description,
                  })}
                  className="w-full border border-white/20 py-2 sm:py-2.5 text-xs sm:text-sm font-light hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Add to Cart
                </button>
                <div className="absolute bottom-0 left-0 w-0 h-px bg-white/20 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Courses Section */}
        <section className="mb-16 sm:mb-24 md:mb-32">
          <div className="flex items-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-white/30"></div>
            <h3 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 font-light px-4 sm:px-6 md:px-8">Main Courses</h3>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-white/30"></div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {solsticeMenuItems.mains.map((item, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-950/40 to-black/60 border border-white/5 rounded-none p-6 sm:p-8 md:p-10 lg:p-12 hover:border-white/10 transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-950/60 hover:to-black/80"
              >
                <div className="flex justify-between items-start mb-4 sm:mb-6 flex-col md:flex-row gap-4 sm:gap-6">
                  <h4 className="text-2xl sm:text-3xl md:text-4xl font-extralight text-white tracking-tight leading-tight">{item.name}</h4>
                  <p className="text-xl sm:text-2xl font-extralight text-white/80 whitespace-nowrap">{formatPrice(item.price)}</p>
                </div>
                {item.description && (
                  <p className="text-sm sm:text-base text-gray-300/70 leading-relaxed font-light tracking-wide max-w-2xl mb-4 sm:mb-6">{item.description}</p>
                )}
                <button
                  onClick={() => addToCart({
                    id: generateId(item.name),
                    name: item.name,
                    price: item.price,
                    description: item.description,
                  })}
                  className="border border-white/20 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-light hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                >
                  Add to Cart
                </button>
                <div className="absolute bottom-0 left-0 w-0 h-px bg-white/20 group-hover:w-full transition-all duration-700"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Desserts Section */}
        <section className="mb-12 sm:mb-16 md:mb-24">
          <div className="flex items-center mb-8 sm:mb-12 md:mb-16">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-white/30"></div>
            <h3 className="text-xs sm:text-sm uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-400 font-light px-4 sm:px-6 md:px-8">Desserts</h3>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-white/30"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {solsticeMenuItems.desserts.map((item, index) => (
              <div 
                key={index} 
                className="group relative bg-gradient-to-br from-gray-950/50 to-black/50 border border-white/5 rounded-none p-6 sm:p-8 md:p-10 hover:border-white/10 transition-all duration-500 hover:bg-gradient-to-br hover:from-gray-950/70 hover:to-black/70"
              >
                <div className="flex flex-col justify-between h-full min-h-[160px] sm:min-h-[180px]">
                  <h4 className="text-lg sm:text-xl font-light text-white mb-3 sm:mb-4 tracking-tight leading-tight">{item.name}</h4>
                  <div className="mt-auto">
                    <p className="text-lg sm:text-xl font-extralight text-white/80 mb-3 sm:mb-4">{formatPrice(item.price)}</p>
                    <button
                      onClick={() => addToCart({
                        id: generateId(item.name),
                        name: item.name,
                        price: item.price,
                      })}
                      className="w-full border border-white/20 py-2 sm:py-2.5 text-xs sm:text-sm font-light hover:border-white/40 hover:bg-white/5 transition-all duration-300"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-0 h-px bg-white/20 group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
