import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { apiGetSafe, SITE_URL } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';

export const revalidate = 120;

export const metadata = {
  title: 'Blog',
  description:
    'Fitness tips, wellness insights, and nutrition advice from Athlofit. Stay informed and stay fit with expert articles.',
  alternates: { canonical: `${SITE_URL}/blogs` },
};

export default async function BlogsPage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1', 10);
  const category = searchParams?.category || '';

  const query = new URLSearchParams({ page: String(page), limit: '9' });
  if (category) query.set('category', category);

  const [data, categories] = await Promise.all([
    apiGetSafe(`/blog?${query.toString()}`, { blogs: [], pagination: {} }, { revalidate: 120 }),
    apiGetSafe('/blog/categories', [], { revalidate: 300 }),
  ]);

  const blogs = data?.blogs || [];
  const pagination = data?.pagination || {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Athlofit Blog',
    description: 'Fitness tips, wellness insights, and nutrition advice.',
    url: `${SITE_URL}/blogs`,
    blogPost: blogs.map((b) => ({
      '@type': 'BlogPosting',
      headline: b.title,
      url: `${SITE_URL}/blogs/${b.slug}`,
      datePublished: b.publishedAt,
      image: b.coverImage || undefined,
    })),
  };

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Blog' }]} />

      <div className="container-w py-10">
        <div className="text-center mb-12">
          <h1 className="section-heading">Athlofit Blog</h1>
          <p className="section-sub mx-auto mt-3">Tips, insights, and inspiration for your fitness journey</p>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <Link href="/blogs" className={`px-4 py-2 rounded-full text-sm font-medium ${!category ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blogs?category=${encodeURIComponent(c)}`}
                className={`px-4 py-2 rounded-full text-sm font-medium ${category === c ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {c}
              </Link>
            ))}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog._id} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
                <Link href={`/blogs/${blog.slug}`}>
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    {blog.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={blog.coverImage} alt={blog.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-medium text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">{blog.category}</span>
                      <span className="text-xs text-gray-400">{blog.readTime} min read</span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">{blog.title}</h2>
                    {blog.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{blog.excerpt}</p>}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
              const q = new URLSearchParams();
              if (category) q.set('category', category);
              q.set('page', String(p));
              return (
                <Link
                  key={p}
                  href={`/blogs?${q.toString()}`}
                  className={`w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center ${p === page ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
