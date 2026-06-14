import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getAppConfig } from '@/lib/config';
import { SITE_URL } from '@/lib/api';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Dynamic, config-driven default metadata (server-rendered for SEO).
export async function generateMetadata() {
  const cfg = await getAppConfig();
  const { siteName, defaultMetaTitle, defaultMetaDescription, ogImage } = cfg.website;
  const image = ogImage || `${SITE_URL}/og-image.png`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: defaultMetaTitle,
      template: `%s | ${siteName}`,
    },
    description: defaultMetaDescription,
    keywords: [
      'fitness app', 'step counter', 'earn coins walking',
      'health rewards', 'fitness shop', 'workout tracker', 'athlofit',
    ],
    authors: [{ name: siteName }],
    openGraph: {
      type: 'website',
      siteName,
      title: defaultMetaTitle,
      description: defaultMetaDescription,
      url: SITE_URL,
      images: [{ url: image, width: 1200, height: 630 }],
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultMetaTitle,
      description: defaultMetaDescription,
      images: [image],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: SITE_URL },
  };
}

export default async function RootLayout({ children }) {
  const cfg = await getAppConfig();

  // Organization + MobileApplication structured data
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: cfg.website.siteName,
      url: SITE_URL,
      logo: cfg.website.ogImage || `${SITE_URL}/og-image.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        email: cfg.support.email,
        telephone: cfg.support.phone,
        contactType: 'customer service',
      },
      sameAs: Object.values(cfg.social).filter(Boolean),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'MobileApplication',
      name: cfg.website.siteName,
      operatingSystem: 'iOS, Android',
      applicationCategory: 'HealthApplication',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    },
  ];

  return (
    <html lang="en" className={inter.className}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar config={cfg} />
        <main className="min-h-screen">{children}</main>
        <Footer config={cfg} />
        <Toaster
          position="top-center"
          toastOptions={{ duration: 3000, style: { borderRadius: '12px', fontSize: '14px' } }}
        />
      </body>
    </html>
  );
}
