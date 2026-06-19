import {
  Trash2, Smartphone, Mail, ShieldCheck, Clock, Database, XCircle, CheckCircle2,
} from 'lucide-react';
import { getAppConfig } from '@/lib/config';
import { SITE_URL } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 300;

export const metadata = {
  title: 'Delete Your Account',
  description:
    'How to request deletion of your Athlofit account and associated data. Learn what data is removed, what is retained, and the retention periods.',
  alternates: { canonical: `${SITE_URL}/delete-account` },
};

// Data that is permanently removed when an account is deleted.
const DELETED_DATA = [
  'Profile information — name, email, phone, date of birth, gender, height, weight, blood type, and avatar',
  'Health & fitness data — daily steps, calories, hydration, sleep, heart rate, BMI records, and activity history',
  'Gamification data — coin balance, streaks, badges, achievements, and leaderboard standing',
  'Nutrition data — meal logs and dietary preferences',
  'Saved delivery addresses',
  'Referral code and referral connections',
  'Push notification tokens and notification history',
  'Login credentials and authentication tokens (including linked Google sign-in)',
];

// Data that may be retained, and why.
const RETAINED_DATA = [
  {
    label: 'Order & transaction records',
    detail:
      'Completed purchase and payment records are retained for up to 7 years to comply with tax, accounting, and legal obligations. These are anonymized from your profile where possible.',
  },
  {
    label: 'Fraud & abuse prevention data',
    detail:
      'Minimal records may be kept where required to prevent fraud, abuse, or to enforce our Terms of Service.',
  },
  {
    label: 'Aggregated, anonymized analytics',
    detail:
      'Data that can no longer identify you (aggregate usage statistics) may be retained indefinitely.',
  },
];

export default async function DeleteAccountPage() {
  const cfg = await getAppConfig();
  const supportEmail = cfg?.support?.email || 'support@athlofit.com';
  const appName = cfg?.website?.siteName || 'Athlofit';
  const mailtoSubject = encodeURIComponent('Account Deletion Request');
  const mailtoBody = encodeURIComponent(
    'I would like to request the deletion of my Athlofit account and associated data.\n\nRegistered email: \nReason (optional): ',
  );

  return (
    <div className="pt-16">
      <Breadcrumbs items={[{ label: 'Delete Account' }]} />

      <div className="container-w py-10 max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
            <Trash2 size={22} className="text-red-600" />
          </div>
          <h1 className="section-heading">Delete Your {appName} Account</h1>
        </div>
        <p className="text-gray-500 mb-10 leading-relaxed">
          This page explains how to request deletion of your {appName} account and the data
          associated with it, what data will be removed, and what we may retain (and for how long).
        </p>

        {/* How to request */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-5">How to request account deletion</h2>

          {/* Option 1 — in app */}
          <div className="card border border-gray-100 rounded-2xl p-6 mb-4 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={18} className="text-brand-600" />
              <h3 className="font-bold text-gray-900">Option 1 — From the {appName} app (recommended)</h3>
            </div>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 leading-relaxed">
              <li>Open the {appName} app and sign in to your account.</li>
              <li>Go to <strong>Account → Settings</strong>.</li>
              <li>Tap <strong>Delete Account</strong>.</li>
              <li>Confirm your request. You&apos;ll see a confirmation that deletion has been scheduled.</li>
            </ol>
          </div>

          {/* Option 2 — email */}
          <div className="card border border-gray-100 rounded-2xl p-6 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Mail size={18} className="text-brand-600" />
              <h3 className="font-bold text-gray-900">Option 2 — By email</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you can&apos;t access the app, email us from the address registered to your account
              with the subject <strong>&quot;Account Deletion Request&quot;</strong>. We&apos;ll verify
              your identity and process the request.
            </p>
            <a
              href={`mailto:${supportEmail}?subject=${mailtoSubject}&body=${mailtoBody}`}
              className="btn-brand"
            >
              <Mail size={16} /> Email {supportEmail}
            </a>
          </div>
        </section>

        {/* What gets deleted */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Database size={20} className="text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">What data will be deleted</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            When your deletion request is completed, the following data is <strong>permanently removed</strong> from our databases:
          </p>
          <ul className="space-y-3">
            {DELETED_DATA.map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-600 leading-relaxed">
                <XCircle size={18} className="text-red-500 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* What is retained */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={20} className="text-amber-600" />
            <h2 className="text-xl font-bold text-gray-900">What data may be retained (and why)</h2>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            For legal, financial, and security reasons, we may retain limited data after your account
            is deleted:
          </p>
          <div className="space-y-3">
            {RETAINED_DATA.map((item) => (
              <div key={item.label} className="flex items-start gap-3 bg-amber-50/60 border border-amber-100 rounded-xl p-4">
                <CheckCircle2 size={18} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={20} className="text-brand-600" />
            <h2 className="text-xl font-bold text-gray-900">Deletion timeline</h2>
          </div>
          <ul className="space-y-3 text-gray-600 leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Once requested, your account is deactivated and scheduled for deletion.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>
                There is a <strong>30-day grace period</strong> during which you can cancel the request
                by signing back in. After this period, deletion becomes permanent.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>
                Your personal and health data is permanently erased within <strong>30 days</strong> of
                the request. Records we are legally required to keep are retained only for the periods
                described above.
              </span>
            </li>
          </ul>
        </section>

        {/* Note */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Account deletion is permanent and cannot be undone after the 30-day grace period. Any
            unused coins, badges, streaks, and rewards are forfeited and cannot be restored or
            transferred. For questions about this process, contact us at{' '}
            <a href={`mailto:${supportEmail}`} className="text-brand-600 hover:underline">{supportEmail}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
