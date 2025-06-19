
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';

export const TopAdSetsPage: React.FC = () => {
  const report = useReport();
  const topAdSetsData = report?.topAdSets;

  if (!topAdSetsData || topAdSetsData.length === 0) {
    return <SectionContainer title="Top AdSets"><p>No Top AdSets data available.</p></SectionContainer>;
  }

  return (
    <div className="space-y-6">
      {topAdSetsData.map((table, index) => (
        <SectionContainer key={index} title={table.title}>
          <DataTable
            headers={table.headers}
            data={table.rows}
            notes={table.notes}
          />
        </SectionContainer>
      ))}
    </div>
  );
};