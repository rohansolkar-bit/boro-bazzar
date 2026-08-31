'use client';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function AdminHeader({ title = 'Admin Dashboard' }) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
          <NotificationsIcon />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
}
