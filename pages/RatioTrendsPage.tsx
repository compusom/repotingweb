
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';

export const RatioTrendsPage: React.FC = () => {
  const report = useReport();
  const ratioData = report?.ratioTrends;

  if (!ratioData) {
    return <SectionContainer title="Ratio Trends"><p>No ratio trends data available.</p></SectionContainer>;
  }

  return (
    <SectionContainer title="Tendencia Ratios (Mensual)">
      <DataTable
        headers={ratioData.headers}
        data={ratioData.rows}
      />
    </SectionContainer>
  );
};