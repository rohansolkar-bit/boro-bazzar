'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminAuthLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: '#fafafa' }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute bottom-[-130px] left-[-160px] w-[320px] h-[320px] rounded-full bg-emerald-100 opacity-60" />
      <div className="pointer-events-none absolute top-[-80px] right-[-140px] w-[300px] h-[300px] rounded-full bg-emerald-100 opacity-60" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center text-white font-bold text-sm">B</div>
          <span className="font-bold text-lg text-gray-900">BoroBazar</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className={`px-4 py-1.5 text-sm font-semibold rounded transition-colors
              ${isLogin ? 'bg-teal-500 text-white' : 'text-gray-600 hover:text-teal-600 border border-gray-300 hover:border-teal-400'}`}
          >
            LOGIN
          </Link>
          <Link
            href="/admin/register"
            className={`px-4 py-1.5 text-sm font-semibold rounded transition-colors
              ${!isLogin ? 'bg-teal-500 text-white' : 'text-gray-600 hover:text-teal-600 border border-gray-300 hover:border-teal-400'}`}
          >
            SIGN UP
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
