
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, DocumentTextIcon, FunnelIcon,MegaphoneIcon, AdjustmentsHorizontalIcon, UsersIcon, ArrowTrendingUpIcon, QueueListIcon } from './icons/HeroIcons'; // Assuming you create these

const navigationItems = [
  { name: 'Overview', href: '/', icon: ChartBarIcon },
  { name: 'Weekly Summary', href: '/weekly-summary', icon: DocumentTextIcon },
  { name: 'Funnel Analysis', href: '/funnel-analysis', icon: FunnelIcon },
  { name: 'Top Ads', href: '/top-ads', icon: MegaphoneIcon },
  { name: 'Top AdSets', href: '/top-adsets', icon: AdjustmentsHorizontalIcon },
  { name: 'Top Campaigns', href: '/top-campaigns', icon: QueueListIcon },
  { name: 'Audience Performance', href: '/audience-performance', icon: UsersIcon },
  { name: 'Ratio Trends', href: '/ratio-trends', icon: ArrowTrendingUpIcon },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 text-gray-300 flex flex-col print:hidden">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        {/* Replace with an actual logo SVG if available */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-indigo-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
        <span className="ml-3 text-xl font-semibold">Report App</span>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'} // Ensure exact match for Overview link
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 hover:bg-gray-700 hover:text-white ${
                isActive ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">&copy; 2024 Report Analyzer</p>
      </div>
    </div>
  );
};