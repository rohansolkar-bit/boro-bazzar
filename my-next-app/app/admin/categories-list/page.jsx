'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import CategoriesListTable from '@/src/components/admin/CategoriesListTable';

export default function CategoriesListPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Categories" />
      <main className="flex-1 p-6">
        <CategoriesListTable />
      </main>
    </div>
  );
}
