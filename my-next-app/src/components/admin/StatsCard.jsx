'use client';
import React from 'react';

const colorMap = {
  teal: {
    bg: 'bg-teal-500',
    light: 'bg-teal-50',
    text: 'text-teal-600',
  },
  blue: {
    bg: 'bg-blue-500',
    light: 'bg-blue-50',
    text: 'text-blue-600',
  },
  purple: {
    bg: 'bg-purple-500',
    light: 'bg-purple-50',
    text: 'text-purple-600',
  },
  pink: {
    bg: 'bg-pink-500',
    light: 'bg-pink-50',
    text: 'text-pink-600',
  },
};

export default function StatsCard({ title, value, icon, color = 'teal', chartIcon }) {
  const colors = colorMap[color] || colorMap.teal;
  return (
    <div className={`flex items-center justify-between rounded-xl p-5 ${colors.bg} text-white shadow-md`}>
      <div>
        <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-3xl font-bold mt-1">{value?.toLocaleString()}</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="text-4xl opacity-80">{icon}</div>
        {chartIcon && <div className="opacity-70">{chartIcon}</div>}
      </div>
    </div>
  );
}
