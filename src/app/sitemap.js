import { apiGetSafe, SITE_URL } from '@/lib/api';

export const revalidate = 3600; // regenerate hourly

const LEGAL_TYPES = [
  'terms', 'privacy', 'coin-earning', 'coin-redemption',
  'community-guidelines', 'data-deletion', 'medical-disclaimer', 'refund',
];

export default async function sitemap() {
  const now = new Date();

  // Static routes
  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/shop`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/blogs`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/delete-account`, changeFrequency: 'yearly', priority: 0.4 },
  ].map((r) => ({ ...r, lastModified: now }));

  // Legal pages
  const legalRoutes = LEGAL_TYPES.map((t) => ({
    url: `${SITE_URL}/legal/${t}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  // Dynamic products (first 100 active)
  const productData = await apiGetSafe('/shop/products?limit=100', { products: [] }, { revalidate: 3600 });
  const productRoutes = (productData?.products || []).map((p) => ({
    url: `${SITE_URL}/shop/${p._id}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Dynamic blogs (first 100 published)
  const blogData = await apiGetSafe('/blog?limit=100', { blogs: [] }, { revalidate: 3600 });
  const blogRoutes = (blogData?.blogs || []).map((b) => ({
    url: `${SITE_URL}/blogs/${b.slug}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...legalRoutes, ...productRoutes, ...blogRoutes];
}
