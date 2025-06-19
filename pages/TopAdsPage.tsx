
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';

export const TopAdsPage: React.FC = () => {
  const report = useReport();
  const topAdsData = report?.topAds;

  if (!topAdsData || topAdsData.length === 0) {
    return <SectionContainer title="Top Ads"><p>No Top Ads data available.</p></SectionContainer>;
  }

  return (
    <div className="space-y-6">
      {topAdsData.map((table, index) => (
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