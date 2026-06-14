import { notFound } from 'next/navigation';
import { apiGetSafe, SITE_URL } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import Markdown from '@/components/Markdown';

export const revalidate = 300;

// Valid legal types — must match backend LegalContent types.
const VALID_TYPES = [
  'terms', 'privacy', 'coin-earning', 'coin-redemption',
  'community-guidelines', 'data-deletion', 'medical-disclaimer', 'refund',
];

const TITLES = {
  terms: 'Terms & Conditions',
  privacy: 'Privacy Policy',
  'coin-earning': 'Coin Earning & Rewards Policy',
  'coin-redemption': 'Coin Redemption Policy',
  'community-guidelines': 'Community Guidelines',
  'data-deletion': 'Data Deletion Policy',
  'medical-disclaimer': 'Medical / Fitness Disclaimer',
  refund: 'Refund & Cancellation Policy',
};

async function getDoc(type) {
  return apiGetSafe(`/config/legal/${type}`, null, { revalidate: 300 });
}

export async function generateMetadata({ params }) {
  const { type } = params;
  if (!VALID_TYPES.includes(type)) return { title: 'Not Found', robots: { index: false } };

  const doc = await getDoc(type);
  const title = doc?.title || TITLES[type];
  return {
    title,
    description: `Read the ${title} for Athlofit — our fitness rewards platform.`,
    alternates: { canonical: `${SITE_URL}/legal/${type}` },
  };
}

export default async function LegalPage({ params }) {
  const { type } = params;
  if (!VALID_TYPES.includes(type)) notFound();

  const doc = await getDoc(type);
  if (!doc) notFound();

  const title = doc.title || TITLES[type];

  return (
    <div className="pt-16">
      <Breadcrumbs items={[{ label: title }]} />
      <div className="container-w py-10 max-w-4xl">
        <h1 className="section-heading mb-2">{title}</h1>
        {doc.updatedAt && (
          <p className="text-sm text-gray-400 mb-8">
            Last updated: {new Date(doc.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            {doc.version ? ` · Version ${doc.version}` : ''}
          </p>
        )}
        <Markdown content={doc.content} />
      </div>
    </div>
  );
}
