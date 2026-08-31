'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import ProductListTable from '@/src/components/admin/ProductListTable';

export default function ProductListPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Products List" />
      <main className="flex-1 p-6">
        <ProductListTable />
      </main>
    </div>
  );
}
