import React from 'react';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';

interface FinancialStatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

export const FinancialStatCard: React.FC<FinancialStatCardProps> = ({ icon, title, value, trend, trendDirection }) => {
  const isUp = trendDirection === 'up';
  const trendColor = isUp ? 'text-success' : 'text-danger';

  return (
    <div className="bg-slate-500/20 p-6 rounded-lg shadow-md flex items-center space-x-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-[#F2F2F2]">{title}</h3>
        <p className="text-2xl font-bold text-[#FFFFFF] mt-1">{value}</p>
        <div className={`flex items-center text-xs mt-1 ${trendColor}`}>
          {isUp ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
          <span className="font-semibold">{trend}</span>
        </div>
      </div>
    </div>
  );
};
