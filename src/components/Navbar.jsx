'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Zap, LogOut, Download } from 'lucide-react';
import { getCartCount } from '@/lib/cart';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ config }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCartCount(getCartCount());
    try {
      setUser(JSON.parse(localStorage.getItem('athlofit_user')));
    } catch {
      setUser(null);
    }
    const update = () => setCartCount(getCartCount());
    window.addEventListener('cart-updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('cart-updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('athlofit_token');
    localStorage.removeItem('athlofit_user');
    setUser(null);
    window.location.href = '/';
  };

  const appLink =
    config?.appLinks?.universal ||
    config?.appLinks?.playStore ||
    '#download';

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="container-w flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            {config?.website?.siteName || 'Athlofit'}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href) ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Cart">
            <ShoppingCart size={20} className="text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
              <button onClick={logout} className="p-2 rounded-lg hover:bg-gray-100" title="Logout">
                <LogOut size={16} className="text-gray-500" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              {config?.appLinks?.showBadges !== false && (
                <a
                  href={appLink}
                  className="btn text-xs px-3 py-1.5 bg-accent-500 text-white hover:bg-accent-600 rounded-lg font-semibold"
                  target={appLink.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  <Download size={13} /> Get App
                </a>
              )}
              <Link href="/login" className="btn-brand text-xs px-4 py-2">Sign In</Link>
            </div>
          )}

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-gray-700 py-2"
            >
              {link.label}
            </Link>
          ))}
          {!user ? (
            <Link href="/login" onClick={() => setOpen(false)} className="block btn-brand w-full text-center mt-2">
              Sign In
            </Link>
          ) : (
            <button onClick={logout} className="text-sm text-red-500 font-medium py-2">Logout</button>
          )}
        </div>
      )}
    </header>
  );
}
