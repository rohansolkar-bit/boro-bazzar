'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import BannerSlidesListTable from '@/src/components/admin/BannerSlidesListTable';

export default function BannerSlidesListPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Banner Slides" />
      <main className="flex-1 p-6">
        <BannerSlidesListTable />
      </main>
    </div>
  );
}
