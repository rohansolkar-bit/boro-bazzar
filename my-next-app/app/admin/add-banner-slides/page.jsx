'use client';
import React from 'react';
import AdminHeader from '@/src/components/admin/AdminHeader';
import AddBannerSlideForm from '@/src/components/admin/AddBannerSlideForm';

export default function AddBannerSlidePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50 overflow-auto">
      <AdminHeader title="Add Banner Slide" />
      <main className="flex-1 p-6">
        <AddBannerSlideForm />
      </main>
    </div>
  );
}
