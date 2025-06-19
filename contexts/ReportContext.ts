
import React from 'react';
import { ParsedReport } from '../types';

export const ReportContext = React.createContext<ParsedReport | null>(null);

export const ReportProvider = ReportContext.Provider;

export const useReport = (): ParsedReport => {
  const context = React.useContext(ReportContext);
  if (!context) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};