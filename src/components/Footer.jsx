import Link from 'next/link';
import { Zap, Mail, MapPin, Phone, Play, Apple, Star, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { apiGetSafe } from '@/lib/api';

// All legal pages exposed in the footer (slug must match backend legal types).
const LEGAL_LINKS = [
  { slug: 'terms', label: 'Terms & Conditions' },
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'coin-earning', label: 'Coin Earning & Rewards' },
  { slug: 'coin-redemption', label: 'Coin Redemption' },
  { slug: 'community-guidelines', label: 'Community Guidelines' },
  { slug: 'data-deletion', label: 'Data Deletion' },
  { slug: 'medical-disclaimer', label: 'Medical Disclaimer' },
  { slug: 'refund', label: 'Refund Policy' },
];

export default async function Footer({ config }) {
  // Pull the published legal list so footer only shows live documents.
  const legalDocs = await apiGetSafe('/config/legal', [], { revalidate: 300 });
  const publishedSlugs = new Set((legalDocs || []).map((d) => d.type));
  const legalLinks = LEGAL_LINKS.filter(
    (l) => publishedSlugs.size === 0 || publishedSlugs.has(l.slug),
  );

  const appLinks = config?.appLinks || {};
  const social = config?.social || {};
  const support = config?.support || {};
  const siteName = config?.website?.siteName || 'Athlofit';
  const showBadges = appLinks.showBadges !== false;

  const socialItems = [
    { url: social.instagram, Icon: Instagram, label: 'Instagram' },
    { url: social.twitter, Icon: Twitter, label: 'Twitter' },
    { url: social.facebook, Icon: Facebook, label: 'Facebook' },
    { url: social.youtube, Icon: Youtube, label: 'YouTube' },
  ].filter((s) => s.url);

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="border-b border-gray-800">
        <div className="container-w py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Get the {siteName} App</p>
                <p className="text-gray-400 text-sm">Start earning coins with every step you take</p>
              </div>
            </div>
            {showBadges && (
              <div className="flex gap-3">
                <a
                  href={appLinks.playStore || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-lg px-4 py-2.5 transition-colors border border-white/10"
                >
                  <Play size={18} className="text-white fill-white" />
                  <div>
                    <p className="text-[9px] text-gray-400 leading-none">GET IT ON</p>
                    <p className="text-sm font-semibold text-white leading-tight">Google Play</p>
                  </div>
                </a>
                <a
                  href={appLinks.appStore || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-lg px-4 py-2.5 transition-colors border border-white/10"
                >
                  <Apple size={18} className="text-white" />
                  <div>
                    <p className="text-[9px] text-gray-400 leading-none">Download on the</p>
                    <p className="text-sm font-semibold text-white leading-tight">App Store</p>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container-w py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">{siteName}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              The fitness app that rewards your healthy lifestyle. Walk, earn coins, and shop premium health products.
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-xs text-gray-400 ml-2">4.8/5 (2K+ reviews)</span>
            </div>
            {socialItems.length > 0 && (
              <div className="flex items-center gap-3 mt-5">
                {socialItems.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop?featured=true" className="hover:text-white transition-colors">Featured</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Fitness Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((l) => (
                <li key={l.slug}>
                  <Link href={`/legal/${l.slug}`} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} className="text-brand-400" /> {support.email}</li>
              <li className="flex items-center gap-2"><Phone size={14} className="text-brand-400" /> {support.phone}</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="text-brand-400 mt-0.5 shrink-0" /> {support.address}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <Link href="/legal/privacy" className="hover:text-gray-300">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-gray-300">Terms</Link>
            <Link href="/legal/refund" className="hover:text-gray-300">Refund</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
