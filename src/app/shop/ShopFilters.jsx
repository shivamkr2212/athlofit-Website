'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export default function ShopFilters({ categories, category, sort, search }) {
  const router = useRouter();
  const params = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);

  const update = (changes) => {
    const q = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => {
      if (v) q.set(k, v);
      else q.delete(k);
    });
    q.set('page', '1');
    router.push(`/shop?${q.toString()}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    update({ search: searchInput });
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Search products…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-brand px-5">Search</button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => update({ category: '' })}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !category ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => update({ category: c.slug })}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === c.slug ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="ml-auto px-4 py-2 border border-gray-200 rounded-xl text-sm"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
}
