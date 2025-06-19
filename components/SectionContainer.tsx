
import React from 'react';

interface SectionContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionContainer: React.FC<SectionContainerProps> = ({ title, children, className }) => {
  return (
    <section className={`bg-gray-850 p-6 rounded-lg shadow-xl print:shadow-none print:border print:border-gray-300 ${className}`}>
      <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3 print:text-black print:border-gray-300">{title}</h2>
      {children}
    </section>
  );
};