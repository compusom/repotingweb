
import React from 'react';
import { useReport } from '../contexts/ReportContext';
import { DashboardCard } from '../components/DashboardCard';
import { SectionContainer } from '../components/SectionContainer';
import { InformationCircleIcon, CurrencyEuroIcon, AdjustmentsHorizontalIcon, UsersIcon as CampaignIcon } from '../components/icons/HeroIcons';
import { MetricChange } from '../types';


export const OverviewPage: React.FC = () => {
  const report = useReport();

  if (!report) return null;

  const { generalInfo, weeklyComparison } = report;
  
  const getCurrentWeekData = (metricName: string): MetricChange | null => {
    const row = weeklyComparison?.rows.find(r => (r['Métrica'] as string).toLowerCase() === metricName.toLowerCase());
    if (row && weeklyComparison?.headers[1]) {
      // Assuming second column (index 1) is "Semana actual"
      return row[weeklyComparison.headers[1]] as MetricChange;
    }
    return null;
  };

  const formatCardValue = (metricData: MetricChange | null): string => {
    if (!metricData) return 'N/A';
    
    let displayValue = metricData.value.split('(')[0].trim();
    if (metricData.parsedValue !== undefined) {
      if (metricData.isEuro) {
        displayValue = `€${metricData.parsedValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      } else if (metricData.isMultiplier) {
        displayValue = `${metricData.parsedValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`;
      } else if (metricData.isPercentage) {
         displayValue = `${metricData.parsedValue.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
      }
      else {
        displayValue = metricData.parsedValue.toLocaleString('es-ES', { minimumFractionDigits: Number.isInteger(metricData.parsedValue) ? 0 : 2, maximumFractionDigits: 2 });
      }
    }
    return `${displayValue} ${metricData.stabilityIcon || ''}`.trim();
  };

  const formatCardChange = (metricData: MetricChange | null): string | undefined => {
    if (!metricData || metricData.percentageChange === undefined) return undefined;
    return `${metricData.percentageChange.toLocaleString('es-ES',{minimumFractionDigits:1, maximumFractionDigits:1})}%`;
  };


  const overviewCards = [
    { title: 'Moneda Detectada', value: generalInfo.currency || 'N/A', icon: <CurrencyEuroIcon className="w-6 h-6"/> },
    { title: 'Campaña Filtrada', value: generalInfo.filteredCampaign || 'N/A', icon: <CampaignIcon className="w-6 h-6"/> },
    { title: 'AdSets Filtrados', value: generalInfo.filteredAdSets || 'N/A', icon: <AdjustmentsHorizontalIcon className="w-6 h-6"/> },
  ];

  const kpiMetrics = ['Inversion', 'Ventas', 'ROAS', 'Compras'];
  const kpiCards = kpiMetrics.map(metricName => {
    const data = getCurrentWeekData(metricName);
    return {
      title: `${metricName} (Semana Actual)`,
      value: formatCardValue(data),
      change: formatCardChange(data),
      changeDirection: data?.changeDirection
    };
  });

  return (
    <div className="space-y-6">
      <SectionContainer title="Report Information">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewCards.map(card => (
            <DashboardCard 
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
            />
          ))}
        </div>
        {generalInfo.rawHeaderText && generalInfo.rawHeaderText.length > 0 && (
            <div className="mt-6 p-4 bg-gray-700 rounded-md text-sm text-gray-300">
                <h3 className="text-md font-semibold mb-2 text-white flex items-center">
                    <InformationCircleIcon className="w-5 h-5 mr-2 text-indigo-400" />
                    General Report Notes
                </h3>
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{generalInfo.rawHeaderText.slice(4).join('\n')}</pre>
            </div>
        )}
      </SectionContainer>

      <SectionContainer title="Key Performance Indicators (Semana Actual)">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map(card => (
            <DashboardCard 
              key={card.title}
              title={card.title}
              value={card.value}
              change={card.change}
              changeDirection={card.changeDirection}
            />
          ))}
        </div>
      </SectionContainer>
       {report.rawFooterText && report.rawFooterText.length > 0 && (
        <SectionContainer title="Report Processing Summary">
            <div className="mt-4 p-4 bg-gray-700 rounded-md text-sm text-gray-300">
                 <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{report.rawFooterText.join('\n')}</pre>
            </div>
        </SectionContainer>
      )}
    </div>
  );
};