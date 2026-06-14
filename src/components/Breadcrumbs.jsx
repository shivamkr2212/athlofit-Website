import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { SITE_URL } from '@/lib/api';

/**
 * Server-rendered breadcrumbs with Schema.org BreadcrumbList JSON-LD.
 * @param {{ items: { label: string, href?: string }[] }} props
 */
export default function Breadcrumbs({ items }) {
  const crumbs = [{ label: 'Home', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="container-w pt-4">
        <ol className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
          {crumbs.map((c, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
              {i === crumbs.length - 1 || !c.href ? (
                <span className="text-gray-900 font-medium truncate max-w-[220px]">{c.label}</span>
              ) : (
                <Link href={c.href} className="hover:text-brand-600 transition-colors flex items-center gap-1">
                  {i === 0 && <Home size={12} />}
                  {c.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
