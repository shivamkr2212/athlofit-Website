'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ShoppingCart, Minus, Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { addToCart } from '@/lib/cart';

export default function ProductPurchase({ product }) {
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');

  const hasVariants = product.hasVariants && product.variants?.length > 0;

  const sizes = useMemo(
    () => [...new Set((product.variants || []).map((v) => v.size).filter(Boolean))],
    [product.variants],
  );
  const colors = useMemo(
    () => [...new Set((product.variants || []).map((v) => v.color).filter(Boolean))],
    [product.variants],
  );

  const matchedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (product.variants || []).find(
      (v) => (sizes.length === 0 || v.size === size) && (colors.length === 0 || v.color === color),
    );
  }, [hasVariants, product.variants, size, color, sizes.length, colors.length]);

  const variantStock = matchedVariant?.stock ?? 0;
  const inStock = hasVariants ? variantStock > 0 : product.stock > 0;

  const handleAdd = () => {
    if (hasVariants) {
      if (sizes.length && !size) { toast.error('Please select a size'); return; }
      if (colors.length && !color) { toast.error('Please select a colour'); return; }
      if (!matchedVariant) { toast.error('This combination is unavailable'); return; }
      if (matchedVariant.stock < qty) { toast.error('Not enough stock for this variant'); return; }
      addToCart(product, qty, {
        variantId: matchedVariant._id,
        size: matchedVariant.size,
        color: matchedVariant.color,
        priceOverride: matchedVariant.priceOverride,
      });
      toast.success(`${product.name} (${[matchedVariant.size, matchedVariant.color].filter(Boolean).join('/')}) × ${qty} added`);
    } else {
      addToCart(product, qty);
      toast.success(`${product.name} × ${qty} added to cart`);
    }
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

      {/* Variant selectors */}
      {hasVariants && (
        <div className="space-y-4 mb-6">
          {sizes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                      size === s ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {colors.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Colour</p>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium capitalize transition ${
                      color === c ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className={`text-sm ${inStock ? 'text-green-600' : 'text-red-500'}`}>
            {matchedVariant
              ? (variantStock > 0 ? `✓ In stock (${variantStock} available)` : '✕ Out of stock')
              : 'Select options to see availability'}
          </p>
        </div>
      )}

      {inStock && (
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 hover:bg-gray-50" aria-label="Decrease quantity"><Minus size={16} /></button>
            <span className="w-12 text-center font-medium">{qty}</span>
            <button onClick={() => setQty(qty + 1)} className="p-3 hover:bg-gray-50" aria-label="Increase quantity"><Plus size={16} /></button>
          </div>
          <button onClick={handleAdd} className="btn-brand flex-1 py-4">
            <ShoppingCart size={18} /> Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
