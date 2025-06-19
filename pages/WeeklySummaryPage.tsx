
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';

export const WeeklySummaryPage: React.FC = () => {
  const report = useReport();
  const weeklyData = report?.weeklyComparison;

  if (!weeklyData) {
    return <SectionContainer title="Weekly Summary Comparison"><p>No weekly summary data available.</p></SectionContainer>;
  }

  return (
    <SectionContainer title="Cuenta completa: Agregado Total - Comparativa Mensual">
      <DataTable
        headers={weeklyData.headers}
        data={weeklyData.rows}
        notes={weeklyData.notes}
      />
    </SectionContainer>
  );
};