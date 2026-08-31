'use client';
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'JAN', TotalSales: 120, TotalUsers: 80 },
  { month: 'FEB', TotalSales: 180, TotalUsers: 100 },
  { month: 'MAR', TotalSales: 220, TotalUsers: 140 },
  { month: 'APR', TotalSales: 380, TotalUsers: 200 },
  { month: 'MAY', TotalSales: 340, TotalUsers: 210 },
  { month: 'JUN', TotalSales: 410, TotalUsers: 280 },
  { month: 'JUL', TotalSales: 360, TotalUsers: 250 },
  { month: 'AUG', TotalSales: 400, TotalUsers: 270 },
  { month: 'SEP', TotalSales: 380, TotalUsers: 260 },
  { month: 'OCT', TotalSales: 310, TotalUsers: 190 },
  { month: 'NOV', TotalSales: 290, TotalUsers: 170 },
];

export default function SalesChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Total Users &amp; Total Sales</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            cursor={{ fill: 'rgba(0,0,0,0.03)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            formatter={(value) => <span className="text-gray-600">{value}</span>}
          />
          <Bar dataKey="TotalSales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="TotalUsers" fill="#93c5fd" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
