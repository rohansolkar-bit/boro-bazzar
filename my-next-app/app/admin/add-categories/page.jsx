'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import AddCategoryForm from '@/src/components/admin/AddCategoryForm';

export default function AddCategoriesPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Add Category" />
      <main className="flex-1 p-6">
        <AddCategoryForm />
      </main>
    </div>
  );
}
