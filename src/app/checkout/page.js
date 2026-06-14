import CheckoutView from './CheckoutView';
import { getAppConfig } from '@/lib/config';

export const metadata = {
  title: 'Checkout',
  description: 'Complete your Athlofit purchase securely. Pay with coins or via Razorpay.',
  robots: { index: false, follow: true },
};

export default async function CheckoutPage() {
  const cfg = await getAppConfig();
  return <CheckoutView razorpayEnabled={!!cfg.website?.razorpayEnabled} />;
}
