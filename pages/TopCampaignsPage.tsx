
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';

export const TopCampaignsPage: React.FC = () => {
  const report = useReport();
  const topCampaignsData = report?.topCampaigns;

  if (!topCampaignsData || topCampaignsData.length === 0) {
    return <SectionContainer title="Top Campaigns"><p>No Top Campaigns data available.</p></SectionContainer>;
  }

  return (
    <div className="space-y-6">
      {topCampaignsData.map((table, index) => (
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