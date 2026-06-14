// src/lib/config.js
// ─── Fetches the dynamic app config (app links, social, SEO) from backend ────

import { apiGetSafe } from './api';

// Sensible fallbacks if the backend is unreachable at build/request time.
const DEFAULT_CONFIG = {
  appLinks: { playStore: '', appStore: '', universal: '', showBadges: true },
  social: { instagram: '', twitter: '', facebook: '', youtube: '', linkedin: '' },
  support: {
    email: 'support@athlofit.com',
    phone: '+91 98765 43210',
    address: 'Bengaluru, Karnataka, India',
  },
  website: {
    siteName: 'Athlofit',
    defaultMetaTitle: 'Athlofit — Walk. Earn. Shop.',
    defaultMetaDescription:
      'Track your fitness, earn coins by walking, and shop premium health products.',
    ogImage: '',
    razorpayEnabled: false,
  },
};

/**
 * Returns the merged app config. Cached via ISR for 5 minutes.
 */
export async function getAppConfig() {
  const data = await apiGetSafe('/config/app', null, { revalidate: 300 });
  const cfg = data?.config || data || {};
  return {
    ...DEFAULT_CONFIG,
    ...cfg,
    appLinks: { ...DEFAULT_CONFIG.appLinks, ...(cfg.appLinks || {}) },
    social: { ...DEFAULT_CONFIG.social, ...(cfg.social || {}) },
    support: { ...DEFAULT_CONFIG.support, ...(cfg.support || {}) },
    website: { ...DEFAULT_CONFIG.website, ...(cfg.website || {}) },
  };
}
