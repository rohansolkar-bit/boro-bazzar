'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import StatsCard from '@/src/components/admin/StatsCard';
import ProductsTable from '@/src/components/admin/ProductsTable';
import UsersTable from '@/src/components/admin/UsersTable';
import SalesChart from '@/src/components/admin/SalesChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const stats = [
  { title: 'Total Users', value: 3209, icon: <PeopleAltIcon fontSize="large" />, color: 'teal' },
  { title: 'Total Orders', value: 837, icon: <ShoppingBagIcon fontSize="large" />, color: 'blue' },
  { title: 'Total Products', value: 50, icon: <Inventory2Icon fontSize="large" />, color: 'purple' },
  { title: 'Total Category', value: 8, icon: <CategoryIcon fontSize="large" />, color: 'pink' },
];

export default function AdminDashboard() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Admin Dashboard" />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(s => (
            <StatsCard key={s.title} {...s} chartIcon={<ShowChartIcon fontSize="small" />} />
          ))}
        </div>

        {/* Products Table */}
        <ProductsTable />

        {/* Users List Table */}
        <UsersTable />

        {/* Bar Chart */}
        <SalesChart />
      </main>
    </div>
  );
}
