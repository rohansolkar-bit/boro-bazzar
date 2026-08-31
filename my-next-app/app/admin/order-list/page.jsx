'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import OrderListTable from '@/src/components/admin/OrderListTable';

export default function OrderListPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Orders" />
      <main className="flex-1 p-6">
        <OrderListTable />
      </main>
    </div>
  );
}
