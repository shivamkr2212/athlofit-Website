import { apiGetSafe, SITE_URL } from '@/lib/api';
import { getAppConfig } from '@/lib/config';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactForm from './ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';

export const revalidate = 300;

export const metadata = {
  title: 'Contact Us',
  description:
    'Have a question or feedback about Athlofit? Get in touch with our support team. We respond within 24 hours.',
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default async function ContactPage() {
  const cfg = await getAppConfig();
  const support = cfg.support;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Athlofit',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Athlofit',
      email: support.email,
      telephone: support.phone,
      address: { '@type': 'PostalAddress', addressLocality: support.address },
    },
  };

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Contact' }]} />

      <div className="container-w py-10">
        <div className="text-center mb-12">
          <h1 className="section-heading">Contact Us</h1>
          <p className="section-sub mx-auto mt-3">Have a question or feedback? We&apos;d love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="bg-brand-50 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-500">{support.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-500">{support.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Address</p>
                    <p className="text-sm text-gray-500">{support.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>Response Time:</strong> We typically respond within 24 hours on business days.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
