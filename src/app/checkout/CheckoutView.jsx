'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CreditCard, Coins, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCart, getCartTotal, getCartTotalCoins, clearCart } from '@/lib/cart';
import { apiPost } from '@/lib/api';
import { useRazorpay } from '@/lib/useRazorpay';

export default function CheckoutView({ razorpayEnabled }) {
  const router = useRouter();
  const razorpayReady = useRazorpay();
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('coins'); // 'coins' | 'razorpay'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });

  useEffect(() => {
    setMounted(true);
    setCart(getCart());
    try {
      setUser(JSON.parse(localStorage.getItem('athlofit_user')));
      setToken(localStorage.getItem('athlofit_token'));
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (mounted && cart.length === 0 && !success) router.push('/cart');
  }, [mounted, cart, success, router]);

  if (!mounted) return <div className="pt-32 text-center text-gray-400">Loading…</div>;

  const total = getCartTotal();
  const totalCoins = getCartTotalCoins();

  const validate = () => {
    if (!user || !token) {
      toast.error('Please login to place an order');
      router.push('/login');
      return false;
    }
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      toast.error('Please fill in all address fields');
      return false;
    }
    return true;
  };

  const handleCoinPurchase = async () => {
    const items = cart.map((i) => ({ productId: i.productId, quantity: i.quantity }));
    await apiPost('/shop/cart/buy-with-coins', { items, shippingAddress: address }, token);
    clearCart();
    setSuccess(true);
    toast.success('Order placed successfully!');
  };

  const handleRazorpay = async () => {
    if (!razorpayReady || !window.Razorpay) {
      toast.error('Payment gateway is still loading. Please try again.');
      return;
    }
    const items = cart.map((i) => ({ productId: i.productId, quantity: i.quantity }));
    const order = await apiPost(
      '/payment/create-order',
      { items, shippingAddress: address, contactEmail: user?.email },
      token,
    );

    const rzp = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'Athlofit',
      description: 'Order Payment',
      order_id: order.razorpayOrderId,
      prefill: { name: user?.name || '', email: user?.email || '' },
      theme: { color: '#146ff5' },
      handler: async (response) => {
        try {
          await apiPost(
            '/payment/verify',
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
            token,
          );
          clearCart();
          setSuccess(true);
          toast.success('Payment successful! Order confirmed.');
        } catch (err) {
          toast.error(err.message || 'Payment verification failed');
        }
      },
      modal: {
        ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }),
      },
    });
    rzp.on('payment.failed', (resp) => {
      toast.error(resp.error?.description || 'Payment failed');
    });
    rzp.open();
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (paymentMethod === 'coins') {
        await handleCoinPurchase();
      } else {
        await handleRazorpay();
      }
    } catch (err) {
      toast.error(err.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-20 container-w py-32 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">Your order has been placed successfully. You can track it in the app.</p>
        <Link href="/shop" className="btn-brand">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="container-w py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 mb-6">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="section-heading mb-8">Checkout</h1>

        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
            <p className="text-sm text-yellow-800">
              You need to <Link href="/login" className="font-bold underline">sign in</Link> to complete your purchase.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street *</label>
                  <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="123 Main Street" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50" value={address.country} readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'coins' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="coins" checked={paymentMethod === 'coins'} onChange={() => setPaymentMethod('coins')} className="accent-brand-600" />
                  <Coins size={20} className="text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pay with Coins</p>
                    <p className="text-xs text-gray-500">Use your earned coins (10 coins = ₹1)</p>
                  </div>
                  <span className="ml-auto font-bold text-yellow-600">{totalCoins.toLocaleString()} coins</span>
                </label>

                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${!razorpayEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${paymentMethod === 'razorpay' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" value="razorpay" disabled={!razorpayEnabled} checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="accent-brand-600" />
                  <CreditCard size={20} className="text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pay with ₹ (UPI / Card)</p>
                    <p className="text-xs text-gray-500">{razorpayEnabled ? 'Secure payment via Razorpay' : 'Currently unavailable'}</p>
                  </div>
                  <span className="ml-auto font-bold text-gray-900">₹{total.toLocaleString()}</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 h-fit sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1">{item.name} × {item.quantity}</span>
                  <span className="font-medium ml-2">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl">
                  {paymentMethod === 'coins' ? `🪙 ${totalCoins.toLocaleString()} coins` : `₹${total.toLocaleString()}`}
                </span>
              </div>
            </div>
            <button onClick={handlePlaceOrder} disabled={loading || !user} className="btn-brand w-full py-4 disabled:opacity-50">
              {loading ? 'Processing…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
