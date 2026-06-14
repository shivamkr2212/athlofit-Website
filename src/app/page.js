import Link from 'next/link';
import {
  ArrowRight, Zap, ShoppingBag, Footprints, Trophy, Heart, Shield,
  Download, Smartphone, TrendingUp, Flame, Droplets, Target,
  ChevronRight, Play, Apple, Dumbbell,
} from 'lucide-react';
import { apiGetSafe, SITE_URL } from '@/lib/api';
import { getAppConfig } from '@/lib/config';
import ProductCard from '@/components/ProductCard';

export const revalidate = 120;

export const metadata = {
  description:
    'Athlofit tracks your fitness journey and rewards every step with coins you can spend on premium health products. Download now for iOS and Android.',
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  const [featured, cfg, latestBlogs] = await Promise.all([
    apiGetSafe('/shop/products/featured', [], { revalidate: 120 }),
    getAppConfig(),
    apiGetSafe('/blog?limit=3', { blogs: [] }, { revalidate: 120 }),
  ]);

  const appLinks = cfg.appLinks || {};
  const playStore = appLinks.playStore || '#';
  const appStore = appLinks.appStore || '#';
  const blogs = latestBlogs?.blogs || [];

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 gradient-mesh" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />

        <div className="container-w relative z-10 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-100 to-accent-100 text-brand-700 rounded-full px-5 py-2 text-sm font-semibold mb-8 border border-brand-200/50">
                <Zap size={14} className="text-brand-600" />
                <span>Your Steps = Real Rewards</span>
                <ChevronRight size={14} />
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 tracking-tight leading-[1.05]">
                Walk more.<br />
                <span className="text-gradient">Earn more.</span><br />
                Live better.
              </h1>

              <p className="text-xl text-gray-500 mt-8 max-w-xl leading-relaxed">
                {cfg.website?.defaultMetaDescription}
              </p>

              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/shop" className="btn-brand text-base px-8 py-4 shadow-xl">
                  <ShoppingBag size={18} /> Shop Now
                </Link>
                <a href="#download" className="btn-accent text-base px-8 py-4">
                  <Download size={18} /> Get the App
                </a>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-14 max-w-md">
                {[
                  ['10K+', 'Active Users', 'text-brand-600'],
                  ['50M+', 'Steps Tracked', 'text-accent-600'],
                  ['2L+', 'Coins Earned', 'text-purple-600'],
                ].map(([val, label, color]) => (
                  <div key={label}>
                    <p className={`text-2xl lg:text-3xl font-black ${color}`}>{val}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex justify-center relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/20 to-accent-400/20 rounded-[3rem] blur-3xl scale-90" />
                <div className="relative w-72 h-[580px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl glow-brand">
                  <div className="w-full h-full bg-gradient-to-b from-brand-600 via-brand-700 to-gray-900 rounded-[2.4rem] flex flex-col items-center justify-center text-white overflow-hidden relative">
                    <div className="absolute top-4 w-24 h-5 bg-black rounded-full" />
                    <div className="text-center px-6 mt-8">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
                        <Zap size={28} className="text-white" />
                      </div>
                      <p className="text-4xl font-black">12,458</p>
                      <p className="text-brand-200 text-sm mt-1">steps today</p>
                      <div className="w-48 h-48 mx-auto mt-6 relative">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                          <circle cx="50" cy="50" r="42" fill="none" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" strokeDasharray="264" strokeDashoffset="66" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold">83%</p>
                          <p className="text-xs text-brand-200">of daily goal</p>
                        </div>
                      </div>
                      <div className="flex justify-center gap-6 mt-6">
                        {[[Flame, '520', 'kcal'], [Droplets, '2.1L', 'water'], [Target, '45', 'min']].map(
                          ([Icon, val, unit]) => (
                            <div key={unit} className="text-center">
                              <Icon size={16} className="mx-auto text-brand-200 mb-1" />
                              <p className="font-bold text-sm">{val}</p>
                              <p className="text-[10px] text-brand-300">{unit}</p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="py-6 bg-gray-900">
        <div className="container-w">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
            {[
              [Footprints, 'Step Tracking'],
              [Flame, 'Calorie Counter'],
              [Droplets, 'Hydration Goals'],
              [Trophy, 'Coin Rewards'],
              [Dumbbell, 'Daily Challenges'],
              [ShoppingBag, 'Fitness Shop'],
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-gray-300">
                <Icon size={16} className="text-brand-400" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        <div className="container-w relative">
          <div className="text-center mb-20">
            <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-3">Simple Process</p>
            <h2 className="section-heading">How Athlofit Works</h2>
            <p className="section-sub mx-auto mt-4">Three simple steps to turn your daily walks into real rewards</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Footprints, step: '01', title: 'Track Your Steps', desc: 'Open the app and walk. We sync with your device to track steps, calories, distance, and active minutes automatically.', color: 'brand' },
              { icon: Trophy, step: '02', title: 'Earn Coins Daily', desc: 'Hit your daily goals, maintain streaks, complete challenges, and unlock achievements to earn coins every single day.', color: 'yellow' },
              { icon: ShoppingBag, step: '03', title: 'Redeem in Shop', desc: 'Spend your earned coins on premium fitness gear, supplements, and health products from our curated store.', color: 'green' },
            ].map((item, i) => (
              <div key={i} className="relative group">
                {i < 2 && <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-gray-200 to-gray-100" />}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-brand-200 hover:shadow-2xl transition-all duration-300 relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      item.color === 'brand' ? 'bg-brand-100 text-brand-600' :
                      item.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                    }`}>
                      <item.icon size={28} />
                    </div>
                    <span className="text-5xl font-black text-gray-100 group-hover:text-brand-100 transition-colors">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD */}
      <section id="download" className="py-28 gradient-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px]" />
        <div className="container-w relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 text-brand-300 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/10">
                <Smartphone size={14} /> Available on iOS &amp; Android
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                Download Athlofit.<br />
                <span className="text-gradient">Start earning today.</span>
              </h2>
              <p className="text-lg text-gray-400 mt-6 leading-relaxed max-w-lg">
                Join thousands of users already earning coins by walking. Track your health, compete in challenges, and shop premium products — all from one app.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                {['Step & calorie tracking', 'Daily coin rewards', 'Streak badges', 'Premium fitness shop', 'Weekly challenges', 'Nutrition logging'].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                      <Zap size={10} className="text-accent-400" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-10">
                <a href={playStore} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white rounded-xl px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <Play size={24} className="text-gray-900 fill-gray-900" />
                  <div>
                    <p className="text-[10px] text-gray-500 leading-none">GET IT ON</p>
                    <p className="text-base font-bold text-gray-900 leading-tight">Google Play</p>
                  </div>
                </a>
                <a href={appStore} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white rounded-xl px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <Apple size={24} className="text-gray-900" />
                  <div>
                    <p className="text-[10px] text-gray-500 leading-none">Download on the</p>
                    <p className="text-base font-bold text-gray-900 leading-tight">App Store</p>
                  </div>
                </a>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="w-64 h-[520px] bg-gray-800 rounded-[2.5rem] p-3 shadow-2xl border border-gray-700 glow-accent">
                <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] flex flex-col items-center pt-12 text-white relative overflow-hidden">
                  <div className="absolute top-3 w-20 h-4 bg-black rounded-full" />
                  <Dumbbell size={32} className="text-accent-400 mb-3" />
                  <p className="text-lg font-bold">Daily Challenges</p>
                  <p className="text-xs text-gray-400 mb-6">Complete to earn coins</p>
                  <div className="w-full px-5 space-y-3">
                    {[['Walk 10,000 steps', '60', '83%'], ['Burn 300 calories', '40', '67%'], ['Drink 2L water', '35', '100%']].map(([title, coins, progress]) => (
                      <div key={title} className="bg-gray-700/50 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-gray-200">{title}</p>
                          <span className="text-[10px] font-bold text-yellow-400">{coins} coins</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-600 rounded-full">
                          <div className="h-full bg-accent-500 rounded-full" style={{ width: progress }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      {featured.length > 0 && (
        <section className="py-28">
          <div className="container-w">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-3">Our Store</p>
                <h2 className="section-heading">Fuel Your Fitness</h2>
                <p className="section-sub mt-3">Premium products you can buy with earned coins or INR</p>
              </div>
              <Link href="/shop" className="btn-outline hidden sm:inline-flex">
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* BLOG PREVIEW */}
      {blogs.length > 0 && (
        <section className="py-28 bg-gray-50">
          <div className="container-w">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-sm font-bold text-accent-600 uppercase tracking-wider mb-3">Fitness Tips</p>
                <h2 className="section-heading">Stay Informed, Stay Fit</h2>
                <p className="section-sub mt-3">Expert advice for your health and wellness journey</p>
              </div>
              <Link href="/blogs" className="btn-outline hidden sm:inline-flex">
                All Articles <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link key={blog._id} href={`/blogs/${blog.slug}`} className="card-hover group">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {blog.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={blog.coverImage} alt={blog.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">{blog.category}</span>
                      <span className="text-xs text-gray-400">{blog.readTime} min read</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">{blog.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* WHY ATHLOFIT */}
      <section className="py-28">
        <div className="container-w">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-3">Why Us</p>
            <h2 className="section-heading">Built for Your Fitness Goals</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Secure & Private', desc: 'End-to-end encryption. Your health data stays yours.', color: 'bg-blue-50 text-blue-600' },
              { icon: Zap, title: 'Instant Rewards', desc: 'Earn coins automatically as you walk. No manual claims.', color: 'bg-yellow-50 text-yellow-600' },
              { icon: Heart, title: 'Health First', desc: 'Curated products from trusted brands for your fitness.', color: 'bg-red-50 text-red-600' },
              { icon: TrendingUp, title: 'Track Progress', desc: 'Detailed analytics for steps, calories, sleep & more.', color: 'bg-green-50 text-green-600' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 rounded-3xl border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <item.icon size={26} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
