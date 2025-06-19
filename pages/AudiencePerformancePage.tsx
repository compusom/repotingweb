
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';

export const AudiencePerformancePage: React.FC = () => {
  const report = useReport();
  const audienceData = report?.audiencePerformance;

  if (!audienceData) {
    return <SectionContainer title="Audience Performance"><p>No audience performance data available.</p></SectionContainer>;
  }

  return (
    <SectionContainer title="Performance Público (Top 5)">
      <DataTable
        headers={audienceData.headers}
        data={audienceData.rows}
      />
    </SectionContainer>
  );
};