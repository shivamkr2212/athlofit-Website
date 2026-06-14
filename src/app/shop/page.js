import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { apiGetSafe, SITE_URL } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShopFilters from './ShopFilters';

export const revalidate = 60;

export const metadata = {
  title: 'Shop',
  description:
    'Browse premium fitness gear, supplements, and health products. Buy with earned coins or INR. Free shipping on all orders.',
  alternates: { canonical: `${SITE_URL}/shop` },
};

export default async function ShopPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1', 10);
  const category = searchParams?.category || '';
  const sort = searchParams?.sort || 'newest';
  const search = searchParams?.search || '';

  const query = new URLSearchParams({ page: String(page), limit: '12', sort });
  if (category) query.set('category', category);
  if (search) query.set('search', search);

  const [productData, categories] = await Promise.all([
    apiGetSafe(`/shop/products?${query.toString()}`, { products: [], pagination: {} }, { revalidate: 60 }),
    apiGetSafe('/shop/categories', [], { revalidate: 300 }),
  ]);

  const products = productData?.products || [];
  const pagination = productData?.pagination || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Athlofit Shop',
    description: 'Premium fitness products you can buy with earned coins or INR.',
    url: `${SITE_URL}/shop`,
  };

  // Build pagination URLs preserving filters
  const buildPageHref = (p) => {
    const q = new URLSearchParams({ sort });
    if (category) q.set('category', category);
    if (search) q.set('search', search);
    q.set('page', String(p));
    return `/shop?${q.toString()}`;
  };

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Shop' }]} />

      <div className="container-w py-10">
        <div className="mb-8">
          <h1 className="section-heading">Shop</h1>
          <p className="text-gray-500 mt-1">Redeem your coins or purchase with ₹</p>
        </div>

        <ShopFilters categories={categories} category={category} sort={sort} search={search} />

        {products.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={buildPageHref(p)}
                className={`w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center ${
                  p === page ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
