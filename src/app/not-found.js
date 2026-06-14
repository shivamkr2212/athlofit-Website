import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="pt-20 container-w py-32 text-center min-h-screen">
      <p className="text-7xl font-black text-brand-600 mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn-brand">Back to Home</Link>
    </div>
  );
}
