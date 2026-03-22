'use client';

import dynamic from 'next/dynamic';
import DashboardBackground from '@/components/ui/DashboardBackground';

const StockSimulator = dynamic(() => import('@/components/Stocks/StockSimulator'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Loading Trading Terminal...</p>
    </div>
  ),
});

export default function StockPlaygroundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <DashboardBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <StockSimulator />
      </div>
    </div>
  );
}
