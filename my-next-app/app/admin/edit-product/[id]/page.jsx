'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import AdminHeader from '@/src/components/admin/AdminHeader';
import EditProductForm from '@/src/components/admin/EditProductForm';

export default function EditProductPage() {
  const { id } = useParams();

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Edit Product" />
      <main className="flex-1 p-6">
        <EditProductForm productId={id} />
      </main>
    </div>
  );
}
