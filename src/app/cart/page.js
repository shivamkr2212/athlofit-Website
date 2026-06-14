import CartView from './CartView';

export const metadata = {
  title: 'Cart',
  description: 'Review your Athlofit cart items before checkout.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
