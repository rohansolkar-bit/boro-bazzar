'use client';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/src/components/admin/AdminSidebar';

const AUTH_ROUTES = ['/admin/login', '/admin/register', '/admin/verify-otp', '/admin/forgot-password'];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
