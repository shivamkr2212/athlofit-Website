'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { getCart, removeFromCart, updateQuantity, getCartTotal, getCartTotalCoins } from '@/lib/cart';

export default function CartView() {
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(getCart());
    const update = () => setCart(getCart());
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
  }, []);

  if (!mounted) return <div className="pt-32 text-center text-gray-400">Loading cart…</div>;

  const total = getCartTotal();
  const totalCoins = getCartTotalCoins();

  if (cart.length === 0) {
    return (
      <div className="pt-20 container-w py-32 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6">Start shopping to add products!</p>
        <Link href="/shop" className="btn-brand">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="container-w py-10">
        <h1 className="section-heading mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.lineId || item.productId} className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4">
                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300"><ShoppingBag size={24} /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-gray-900 truncate">{item.name}</h2>
                  {item.variantLabel && <p className="text-xs text-brand-600 font-medium mt-0.5">{item.variantLabel}</p>}
                  <p className="text-sm text-gray-500 mt-0.5">₹{item.price} / 🪙 {item.price * 10} coins</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.lineId || item.productId, item.quantity - 1)} className="p-2 hover:bg-gray-50"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.lineId || item.productId, item.quantity + 1)} className="p-2 hover:bg-gray-50"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.lineId || item.productId)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" aria-label="Remove">
                      <Trash2 size={16} />
                    </button>
                    <span className="ml-auto font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-medium">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm bg-yellow-50 rounded-lg p-3">
                <span className="text-yellow-700 font-medium">🪙 Or pay with coins</span>
                <span className="font-bold text-yellow-700">{totalCoins.toLocaleString()} coins</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-brand w-full py-4">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
