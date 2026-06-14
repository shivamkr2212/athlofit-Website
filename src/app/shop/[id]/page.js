import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Package } from 'lucide-react';
import { apiGetSafe, SITE_URL } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductPurchase from './ProductPurchase';

export const revalidate = 60;

async function getProduct(id) {
  return apiGetSafe(`/shop/products/${id}`, null, { revalidate: 60 });
}

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) {
    return { title: 'Product Not Found', robots: { index: false } };
  }
  const price = product.discountedPrice ?? product.price;
  const desc = product.description?.slice(0, 160) || `Buy ${product.name} on Athlofit.`;
  return {
    title: product.name,
    description: desc,
    alternates: { canonical: `${SITE_URL}/shop/${product._id}` },
    openGraph: {
      title: product.name,
      description: desc,
      type: 'website',
      url: `${SITE_URL}/shop/${product._id}`,
      images: product.images?.length ? [{ url: product.images[0] }] : [],
    },
    other: { 'product:price:amount': String(price), 'product:price:currency': 'INR' },
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);
  if (!product) notFound();

  const price = product.discountedPrice ?? product.price;
  const coinPrice = price * 10;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product._id,
    brand: { '@type': 'Brand', name: 'Athlofit' },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'INR',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/shop/${product._id}`,
    },
    ...(product.rating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount || 0,
          },
        }
      : {}),
  };

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Shop', href: '/shop' }, { label: product.name }]} />

      <div className="container-w py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images + purchase are interactive — handled client-side */}
          <ProductPurchase product={product} />

          <div>
            <p className="text-sm text-brand-600 font-medium mb-2">{product.category?.name}</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating?.toFixed(1)} ({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-gray-900">₹{price}</span>
              {product.discountedPrice && <span className="text-xl text-gray-400 line-through">₹{product.price}</span>}
              <span className="ml-auto text-lg font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">🪙 {coinPrice} coins</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            <p className={`text-sm mb-6 ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of Stock'}
            </p>

            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((t) => (
                  <span key={t} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {product.reviews?.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({product.reviewCount})</h2>
            <div className="space-y-4">
              {product.reviews.slice(0, 5).map((r, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700">
                      {r.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{r.user?.name || 'User'}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={12} className={j < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
