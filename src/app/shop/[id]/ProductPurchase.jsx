'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Minus, Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '@/lib/cart';

export default function ProductPurchase({ product }) {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${product.name} × ${qty} added to cart`);
  };

  return (
    <div>
      <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-4 relative">
        {product.images?.[selectedImage] ? (
          <Image
            src={product.images[selectedImage]}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Package size={64} />
          </div>
        )}
      </div>

      {product.images?.length > 1 && (
        <div className="flex gap-2 mb-6">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 ${i === selectedImage ? 'border-brand-600' : 'border-gray-200'}`}
            >
              <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {product.stock > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-50" aria-label="Decrease quantity"><Minus size={16} /></button>
            <span className="w-12 text-center font-medium">{qty}</span>
            <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-3 hover:bg-gray-50" aria-label="Increase quantity"><Plus size={16} /></button>
          </div>
          <button onClick={handleAdd} className="btn-brand flex-1 py-4">
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
