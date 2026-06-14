import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import { apiGetSafe, SITE_URL } from '@/lib/api';
import Breadcrumbs from '@/components/Breadcrumbs';
import Markdown from '@/components/Markdown';

export const revalidate = 120;

async function getBlog(slug) {
  return apiGetSafe(`/blog/${slug}`, null, { revalidate: 120 });
}

export async function generateMetadata({ params }) {
  const data = await getBlog(params.slug);
  const blog = data?.blog;
  if (!blog) return { title: 'Post Not Found', robots: { index: false } };

  const title = blog.metaTitle || blog.title;
  const description = blog.metaDescription || blog.excerpt || blog.title;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/blogs/${blog.slug}` },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${SITE_URL}/blogs/${blog.slug}`,
      images: blog.coverImage ? [{ url: blog.coverImage }] : [],
      publishedTime: blog.publishedAt,
      authors: [blog.author],
      tags: blog.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const data = await getBlog(params.slug);
  if (!data?.blog) notFound();

  const { blog, related = [] } = data;

  const formattedDate = blog.publishedAt
    ? new Date(blog.publishedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.metaDescription || '',
    image: blog.coverImage ? [blog.coverImage] : [],
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: { '@type': 'Person', name: blog.author },
    publisher: {
      '@type': 'Organization',
      name: 'Athlofit',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blogs/${blog.slug}` },
    keywords: (blog.tags || []).join(', '),
  };

  return (
    <div className="pt-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[{ label: 'Blog', href: '/blogs' }, { label: blog.title }]} />

      <article className="container-w py-10 max-w-3xl">
        <div className="mb-6">
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{blog.category}</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">{blog.title}</h1>

        <div className="flex items-center gap-5 text-sm text-gray-500 mb-8 flex-wrap">
          <span className="flex items-center gap-1.5"><User size={14} /> {blog.author}</span>
          {formattedDate && <span className="flex items-center gap-1.5"><Calendar size={14} /> {formattedDate}</span>}
          <span className="flex items-center gap-1.5"><Clock size={14} /> {blog.readTime} min read</span>
        </div>

        {blog.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={blog.coverImage} alt={blog.title} className="w-full rounded-2xl mb-10 aspect-[16/9] object-cover" />
        )}

        <Markdown content={blog.content} />

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-gray-100">
            {blog.tags.map((t) => (
              <span key={t} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">#{t}</span>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="bg-gray-50 py-16 mt-10">
          <div className="container-w max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r._id} href={`/blogs/${r.slug}`} className="card-hover group">
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {r.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.coverImage} alt={r.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-brand-600 font-medium">{r.category}</span>
                    <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 group-hover:text-brand-600">{r.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
