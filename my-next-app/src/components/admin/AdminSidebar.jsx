'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Collapse } from 'react-collapse';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import LogoutIcon from '@mui/icons-material/Logout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const NavItem = ({ icon, label, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm font-medium transition-all
        ${isActive ? 'bg-teal-500 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const CollapseNavItem = ({ icon, label, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg mx-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
        style={{ width: 'calc(100% - 16px)' }}
      >
        <span className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span>{label}</span>
        </span>
        {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
      </button>
      <Collapse isOpened={open}>
        <div className="ml-4 mt-1 space-y-1">{children}</div>
      </Collapse>
    </div>
  );
};

const SubNavItem = ({ icon, label, href }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg mx-2 text-sm transition-all
        ${isActive ? 'text-teal-400 font-semibold' : 'text-gray-400 hover:text-white'}`}
    >
      <span className="w-2 h-2 rounded-full bg-current inline-block" />
      <span>{label}</span>
    </Link>
  );
};

export default function AdminSidebar() {
  const router = useRouter();
  return (
    <aside className="w-60 min-h-screen bg-gray-900 flex flex-col py-4 gap-1 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 mb-6">
        <div className="w-8 h-8 bg-teal-500 rounded-md flex items-center justify-center text-white font-bold text-sm">B</div>
        <span className="text-white font-bold text-lg">BoroBazar</span>
      </div>

      <NavItem icon={<DashboardIcon fontSize="small" />} label="Dashboard" href="/admin/dashborad" />

      <CollapseNavItem icon={<SlideshowIcon fontSize="small" />} label="Home Slides">
        <SubNavItem label="Slide List" href="/admin/banner-slides-list" />
        <SubNavItem label="Add Slide" href="/admin/add-banner-slides" />
      </CollapseNavItem>

      <CollapseNavItem icon={<CategoryIcon fontSize="small" />} label="Category">
        <SubNavItem label="Category List" href="/admin/categories-list" />
        <SubNavItem label="Add Category" href="/admin/add-categories" />
      </CollapseNavItem>

      <CollapseNavItem icon={<InventoryIcon fontSize="small" />} label="Products">
        <SubNavItem label="Products List" href="/admin/product-list" />
        <SubNavItem label="Add Product" href="/admin/add-product" />
      </CollapseNavItem>

      <NavItem icon={<PeopleIcon fontSize="small" />} label="Users" href="/admin/users-list" />
      <NavItem icon={<ShoppingCartIcon fontSize="small" />} label="Orders" href="/admin/order-list" />
      <NavItem icon={<ViewCarouselIcon fontSize="small" />} label="Banners" href="/admin/banners" />

      <div className="mt-auto pt-4 border-t border-gray-700 mx-4" />
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            import('js-cookie').then(({ default: Cookies }) => {
              Cookies.remove('accessToken');
              Cookies.remove('refreshToken');
              Cookies.remove('userRole');
            });
          }
          router.push('/admin/login');
        }}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg mx-2 text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all"
      >
        <LogoutIcon fontSize="small" />
        <span>Logout</span>
      </button>
    </aside>
  );
}
