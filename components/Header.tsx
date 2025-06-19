
import React from 'react';
import { ArrowDownTrayIcon, CalendarDaysIcon } from './icons/HeroIcons';

interface HeaderProps {
  title: string;
  onDownloadPDF: () => void;
  reportDate: string;
}

export const Header: React.FC<HeaderProps> = ({ title, onDownloadPDF, reportDate }) => {
  return (
    <header className="bg-gray-800 shadow-md print:hidden">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <div className="flex items-center space-x-4">
           <div className="flex items-center text-sm text-gray-400 bg-gray-700 px-3 py-1.5 rounded-md">
            <CalendarDaysIcon className="w-5 h-5 mr-2 text-indigo-400" />
            <span>Report Date: {reportDate}</span>
          </div>
          <button
            onClick={onDownloadPDF}
            className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </header>
  );
};