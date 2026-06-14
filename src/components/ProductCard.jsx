'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '@/lib/cart';

export default function ProductCard({ product: p }) {
  const price = p.discountedPrice ?? p.price;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(p);
    toast.success(`${p.name} added to cart`);
  };

  return (
    <Link
      href={`/shop/${p._id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all block"
    >
      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        {p.images?.[0] ? (
          <Image
            src={p.images[0]}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingBag size={48} />
          </div>
        )}
        {p.isFeatured && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full z-10">
            Featured
          </span>
        )}
        <button
          onClick={handleAdd}
          aria-label="Add to cart"
          className="absolute bottom-3 right-3 w-10 h-10 bg-brand-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-brand-700 z-10"
        >
          <ShoppingCart size={16} />
        </button>
      </div>
      <div className="p-5">
        <p className="text-xs text-brand-600 font-medium mb-1">{p.category?.name}</p>
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-1">
          {p.name}
        </h3>
        <div className="flex items-center gap-1 mt-2">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-gray-600">
            {p.rating?.toFixed(1)} ({p.reviewCount})
          </span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-bold text-gray-900">₹{price}</span>
            {p.discountedPrice && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{p.price}</span>
            )}
          </div>
          <span className="text-xs text-yellow-600 font-semibold bg-yellow-50 px-2 py-0.5 rounded-full">
            🪙 {price * 10}
          </span>
        </div>
      </div>
    </Link>
  );
}
