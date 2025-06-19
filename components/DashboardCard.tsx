
import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  change?: string;
  changeDirection?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, changeDirection, icon, className }) => {
  let changeColor = 'text-gray-400 print:text-gray-600';
  if (changeDirection === 'up') changeColor = 'text-green-400 print:text-green-600';
  if (changeDirection === 'down') changeColor = 'text-red-400 print:text-red-600';

  return (
    <div className={`bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col justify-between print:border print:border-gray-300 print:shadow-none ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-400 print:text-gray-600 uppercase">{title}</h3>
        {icon && <div className="text-indigo-400">{icon}</div>}
      </div>
      <div>
        <p className="text-3xl font-bold text-white print:text-black">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${changeColor}`}>
            {changeDirection === 'up' ? '▲' : changeDirection === 'down' ? '▼' : ''} {change}
          </p>
        )}
      </div>
    </div>
  );
};