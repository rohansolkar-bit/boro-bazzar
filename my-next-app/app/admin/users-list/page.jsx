'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import UsersListTable from '@/src/components/admin/UsersListTable';

export default function UsersListPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Users" />
      <main className="flex-1 p-6">
        <UsersListTable />
      </main>
    </div>
  );
}
