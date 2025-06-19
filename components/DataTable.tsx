
import React from 'react';
import { MetricChange } from '../types';

interface DataTableProps {
  title?: string;
  headers: string[];
  data: Array<Record<string, string | MetricChange>>;
  notes?: string[];
  className?: string;
}

const RenderMetricChange: React.FC<{ metric: MetricChange }> = ({ metric }) => {
  let textColor = 'text-gray-100 print:text-black';
  if (metric.changeDirection === 'up') textColor = 'text-green-400 print:text-green-600';
  if (metric.changeDirection === 'down') textColor = 'text-red-400 print:text-red-600';

  const formatValue = (valueStr: string) => {
    // Attempt to format numbers nicely, keeping currency/percentage/multiplier symbols
    if (metric.isEuro && metric.parsedValue !== undefined) {
        return `€${metric.parsedValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    const num = metric.parsedValue; // Already parsed
    if (num !== undefined) {
        return num.toLocaleString('es-ES', { minimumFractionDigits: metric.isPercentage || metric.isMultiplier ? 1 : (Number.isInteger(num) ? 0 : 2), maximumFractionDigits: 2 }) + 
               (metric.isPercentage ? '%' : '') + 
               (metric.isMultiplier ? 'x' : '');
    }
    return valueStr.split('(')[0].trim(); // Fallback to original value string part
  }
  
  return (
    <div className="flex flex-col items-end">
      <span className="font-semibold">{formatValue(metric.value)} {metric.stabilityIcon}</span>
      {metric.percentageChange !== undefined && metric.changeDirection && (
        <span className={`text-xs ${textColor}`}>
          ({metric.percentageChange.toLocaleString('es-ES',{minimumFractionDigits:1, maximumFractionDigits:1})}% {metric.changeDirection === 'up' ? '🔺' : metric.changeDirection === 'down' ? '🔻' : ''})
        </span>
      )}
    </div>
  );
};


export const DataTable: React.FC<DataTableProps> = ({ title, headers, data, notes, className }) => {
  if (!data || data.length === 0) {
    return <div className={`p-4 bg-gray-800 rounded-lg shadow ${className}`}>No data available for this table.</div>;
  }
  
  const isSpecialColumn = (header: string) => header.toLowerCase().includes('públicos incluidos') || header.toLowerCase().includes('anuncio') || header.toLowerCase().includes('público');

  return (
    <div className={`bg-gray-800 rounded-lg shadow-xl overflow-hidden print:shadow-none print:border print:border-gray-300 ${className}`}>
      {title && <h2 className="text-xl font-semibold text-white p-4 bg-gray-700 print:bg-gray-100 print:text-black">{title}</h2>}
      <div className="overflow-x-auto print:overflow-visible">
        <table className="min-w-full divide-y divide-gray-700 print:divide-gray-300">
          <thead className="bg-gray-750 print:bg-gray-100">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-300 print:text-gray-600 uppercase tracking-wider ${isSpecialColumn(header) ? 'min-w-[200px] md:min-w-[300px] lg:min-w-[400px]' : 'min-w-[100px] md:min-w-[120px]'} ${headers[0] !== header && !isSpecialColumn(header) ? 'text-right' : 'text-left'}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700 print:bg-white print:divide-gray-300">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-700 transition-colors duration-150 print:hover:bg-white">
                {headers.map((header, cellIndex) => {
                  const cellData = row[header];
                  const isFirstColumn = headers[0] === header;
                  const cellIsSpecial = isSpecialColumn(header);
                  
                  return (
                    <td key={cellIndex} className={`px-4 py-3 text-sm text-gray-200 print:text-gray-700 ${isFirstColumn ? 'font-medium whitespace-nowrap' : (cellIsSpecial ? 'whitespace-normal break-words' : 'text-right whitespace-nowrap')}`}>
                      {typeof cellData === 'object' && cellData !== null && 'value' in cellData ? (
                        <RenderMetricChange metric={cellData as MetricChange} />
                      ) : (
                        <span>{String(cellData ?? '-')}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {notes && notes.length > 0 && (
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400 print:text-gray-600 space-y-1">
          {notes.map((note, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: note.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="bg-gray-600 text-gray-200 px-1 rounded">$1</code>') }} />
          ))}
        </div>
      )}
    </div>
  );
};