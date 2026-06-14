import { SITE_URL } from '@/lib/api';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/login', '/cart', '/checkout'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
