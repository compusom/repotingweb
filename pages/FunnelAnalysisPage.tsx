
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DataTable } from '../components/DataTable';
import { SectionContainer } from '../components/SectionContainer';

export const FunnelAnalysisPage: React.FC = () => {
  const report = useReport();
  const funnelData = report?.funnelAnalysis;

  if (!funnelData) {
    return <SectionContainer title="Funnel Analysis"><p>No funnel analysis data available.</p></SectionContainer>;
  }
  
  return (
    <SectionContainer title="Análisis de Embudo - Comparativa Mensual">
      <p className="mb-4 text-sm text-gray-400">Columnas embudo disponibles: {funnelData.rows[0]?.['Columnas embudo disponibles'] || "['Impresiones', 'Clics (Enlace)', ...]"}</p>
      <DataTable
        headers={funnelData.headers}
        data={funnelData.rows}
        notes={funnelData.notes}
      />
    </SectionContainer>
  );
};