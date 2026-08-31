'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import AddProductForm from '@/src/components/admin/AddProductForm';

export default function AddProductPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Add Product" />
      <main className="flex-1 p-6">
        <AddProductForm />
      </main>
    </div>
  );
}
