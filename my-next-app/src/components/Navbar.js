'use client';

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoSearchOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { AuthContext } from '@/src/context/UserAuthContext';
import { logoutAPI } from '@/src/APIFunctions/Api_function_user_auth';




const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/Fruits & Vegetables', label: 'Fruits & Vegetables' },
  { href: '/Meats & Seafood', label: 'Meats & Seafood' },
  { href: '/Breaksfast & Dairy', label: 'Breaksfast & Dairy' },
  { href: '/Breads & Bakery', label: 'Breads & Bakery' },
   { href: '/Beverages', label: 'Beverages' },
  { href: '/Frozen Foods', label: 'Frozen Foods' },
  { href: '/Biscuits & Snacks', label: 'Biscuits & Snacks' },
  { href: '/Grocery & Staples', label: 'Grocery & Staples' },
  
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleLogout() {
    try {
      await logoutAPI();
    } catch (_) {
      // cookies already cleared inside logoutAPI
    }
    logout();
    router.push('/login');
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
  <>
    {/* Header */}
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" aria-label="Go to homepage">
          <Image
            src="/logo.png"
            width={180}
            height={52}
            alt="Company Logo"
            className="h-auto w-36 sm:w-44 lg:w-56"
            priority
          />
        </Link>

        {/* Search */}
        <div className="relative hidden flex-1 px-8 md:block">
          <label htmlFor="search" className="sr-only">
            Search products
          </label>

          <input
            id="search"
            type="search"
            placeholder="Search for products..."
            aria-label="Search products"
            className="w-full rounded-lg border border-gray-200 bg-gray-100 py-3 pl-4 pr-12 text-sm text-black placeholder:text-gray-500 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <IoSearchOutline
            size={22}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-500"
            aria-hidden="true"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5 sm:gap-8">
          <div className="hidden text-sm font-medium md:flex gap-2 items-center">
            {!mounted ? null : isAuthenticated ? (
              <>
                {user?.name && (
                  <span className="text-gray-700 font-semibold">Hi, {user.name}</span>
                )}
                {user?.name && <span>|</span>}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                >
                  Login
                </Link>
                <span>|</span>
                <Link
                  href="/register"
                  className="hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Wishlist (2 items)"
            className="relative rounded-full p-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <FaRegHeart size={22} />

            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
            >
              2
            </span>
          </button>

          {/* Cart */}
          <button
            type="button"
            aria-label="Shopping cart (2 items)"
            className="relative rounded-full p-2 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <HiOutlineShoppingBag size={22} />

            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
            >
              2
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="px-4 pb-4 md:hidden">
        <label htmlFor="mobile-search" className="sr-only">
          Search products
        </label>

        <div className="relative">
          <input
            id="mobile-search"
            type="search"
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-200 bg-gray-100 py-3 pl-4 pr-10 focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <IoSearchOutline
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={20}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        className="border-t border-gray-100 bg-white"
      >
        <div className="mx-auto flex max-w-7xl overflow-x-auto px-4 scrollbar-hide">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-600 transition hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  </>
);
}
