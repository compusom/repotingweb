
import {
  ParsedReport,
  GeneralInfo,
  WeeklyComparisonData,
  MetricChange,
  FunnelData,
  TopListData,
  AudiencePerformanceData,
  RatioTrendsData,
} from '../types';

const parseMetricChange = (raw: string): MetricChange => {
  const changeMatch = raw.match(/\(([^)]+)\)/);
  let percentageChange: number | undefined;
  let changeDirection: 'up' | 'down' | 'neutral' | undefined;

  if (changeMatch) {
    const changeText = changeMatch[1];
    const valueMatch = changeText.match(/(-?[\d,.]+)/);
    if (valueMatch) {
      percentageChange = parseFloat(valueMatch[1].replace(',', '.'));
    }
    if (changeText.includes('🔺')) changeDirection = 'up';
    else if (changeText.includes('🔻')) changeDirection = 'down';
    else changeDirection = 'neutral';
  }
  
  const valueWithoutChange = changeMatch ? raw.substring(0, changeMatch.index).trim() : raw.trim();
  const parsedValueMatch = valueWithoutChange.match(/(-?€?[\d.,]+%?x?)/);
  let parsedValue: number | undefined;

  const stabilityIconMatch = valueWithoutChange.match(/(✅|🏆)/);
  const stabilityIcon = stabilityIconMatch ? stabilityIconMatch[0] : undefined;
  
  let cleanedValue = valueWithoutChange;
  if(stabilityIcon) {
    cleanedValue = cleanedValue.replace(stabilityIcon, "").trim();
  }

  if (parsedValueMatch && parsedValueMatch[0]) {
      let numStr = parsedValueMatch[0].replace('€', '').replace('x', '').replace('%', '');
      if (numStr.includes(',')) { // Spanish format
          numStr = numStr.replace(/\./g, '').replace(',', '.');
      } else { // Standard format
          numStr = numStr.replace(/,/g, '');
      }
      if (!isNaN(parseFloat(numStr))) {
        parsedValue = parseFloat(numStr);
      }
  }


  return {
    value: raw.trim(),
    parsedValue,
    percentageChange,
    changeDirection,
    isEuro: raw.includes('€'),
    isPercentage: raw.includes('%') && !raw.includes('x'), // Est. ROAS % is just a value
    isMultiplier: raw.includes('x'),
    stabilityIcon: stabilityIcon as '✅' | '🏆' | undefined,
  };
};


const parseMarkdownTable = (tableLines: string[]): { headers: string[]; rows: Array<Record<string, string>>; notes?: string[] } => {
  if (tableLines.length < 2) return { headers: [], rows: [] };

  const headerLine = tableLines[0];
  const headers = headerLine.split('|').map(h => h.trim()).filter(h => h);
  
  const rows: Array<Record<string, string>> = [];
  // Find notes after table
  let notes: string[] = [];
  let endOfTableIndex = tableLines.length;

  for (let i = 2; i < tableLines.length; i++) {
    const line = tableLines[i];
    if (line.startsWith('  **') || line.startsWith('  *') || line.startsWith('  ---')) { // Start of notes
        endOfTableIndex = i;
        break;
    }
    if (!line.startsWith('|') || line.startsWith('|--')) continue; // Skip separator or non-data lines

    const cells = line.split('|').map(c => c.trim());
    // Remove first and last empty cells if they exist due to leading/trailing |
    if (cells[0] === "") cells.shift();
    if (cells[cells.length -1] === "") cells.pop();

    if (cells.length === headers.length) {
      const rowData: Record<string, string> = {};
      headers.forEach((header, index) => {
        rowData[header] = cells[index] || '-';
      });
      rows.push(rowData);
    }
  }
  
  if (endOfTableIndex < tableLines.length) {
    notes = tableLines.slice(endOfTableIndex).map(l => l.trim());
  }

  return { headers, rows, notes };
};


export const parseReportData = (txt: string): ParsedReport => {
  const lines = txt.split('\n');
  const report: ParsedReport = {
    generalInfo: { rawHeaderText: [] },
    topAds: [],
    topAdSets: [],
    topCampaigns: [],
    rawFooterText: [],
  };

  let currentSection = '';
  let tableLines: string[] = [];
  let generalInfoLines: string[] = [];
  let inTable = false;
  let inGeneralInfo = true;

  for (const line of lines) {
    if (line.startsWith('Reporte Bitácora (Weekly)')) report.generalInfo.reportDate = line.substring('Reporte Bitácora (Weekly)'.length).trim();
    if (line.startsWith('Moneda Detectada:')) report.generalInfo.currency = line.substring('Moneda Detectada:'.length).trim();
    if (line.startsWith('Campaña Filtrada:')) report.generalInfo.filteredCampaign = line.substring('Campaña Filtrada:'.length).trim();
    if (line.startsWith('AdSets Filtrados:')) report.generalInfo.filteredAdSets = line.substring('AdSets Filtrados:'.length).trim();

    if (line.startsWith('--- Análisis de Bitácora ---') || line.startsWith('--------------------------------------------------------------------------------')) {
      inGeneralInfo = false; // End of initial general info block
    }
    if (inGeneralInfo) {
      report.generalInfo.rawHeaderText.push(line);
    }


    if (line.startsWith('**  **') && line.includes('| Métrica') && line.includes('Semana actual')) {
      currentSection = 'weeklyComparison';
      inTable = true;
      tableLines = [];
    } else if (line.startsWith('**  **') && line.includes('| Paso del Embudo') && line.includes('Semana actual')) {
      currentSection = 'funnelAnalysis';
      inTable = true;
      tableLines = [];
    } else if (line.startsWith('** Top 20 Ads Bitácora') || line.startsWith('** Top 20 AdSets Bitácora') || line.startsWith('** Top 10 Campañas Bitácora')) {
      currentSection = line.startsWith('** Top 20 Ads') ? 'topAds' : line.startsWith('** Top 20 AdSets') ? 'topAdSets' : 'topCampaigns';
      inTable = true;
      tableLines = [line]; // Include title line for context
    } else if (line.startsWith('** TABLA: PERFORMANCE_PUBLICO **')) {
      currentSection = 'audiencePerformance';
      inTable = true;
      tableLines = [];
    } else if (line.startsWith('** TABLA: TENDENCIA_RATIOS **')) {
      currentSection = 'ratioTrends';
      inTable = true;
      tableLines = [];
    } else if (line.startsWith('  ---') && inTable) { // End of a table section typically followed by notes
      const parsedTable = parseMarkdownTable(tableLines);
      if (currentSection === 'weeklyComparison') {
        report.weeklyComparison = {
          headers: parsedTable.headers,
          rows: parsedTable.rows.map(row => {
            const newRow: Record<string, MetricChange | string> = {};
            newRow[parsedTable.headers[0]] = row[parsedTable.headers[0]]; // Metric name
            for (let i = 1; i < parsedTable.headers.length; i++) {
              newRow[parsedTable.headers[i]] = parseMetricChange(row[parsedTable.headers[i]]);
            }
            return newRow;
          }),
          notes: parsedTable.notes,
        };
      } else if (currentSection === 'funnelAnalysis') {
        report.funnelAnalysis = parsedTable as FunnelData;
      } else if (currentSection === 'topAds' || currentSection === 'topAdSets' || currentSection === 'topCampaigns') {
        const title = tableLines[0].replace('** ', '').trim();
        const data = { title, ...parseMarkdownTable(tableLines.slice(1)) } as TopListData;
        if (currentSection === 'topAds') report.topAds?.push(data);
        if (currentSection === 'topAdSets') report.topAdSets?.push(data);
        if (currentSection === 'topCampaigns') report.topCampaigns?.push(data);
      } else if (currentSection === 'audiencePerformance') {
        report.audiencePerformance = parsedTable as AudiencePerformanceData;
      } else if (currentSection === 'ratioTrends') {
        report.ratioTrends = parsedTable as RatioTrendsData;
      }
      inTable = false;
      tableLines = [];
      currentSection = '';
    }

    if (inTable) {
      if (currentSection === 'topAds' || currentSection === 'topAdSets' || currentSection === 'topCampaigns') {
        if(tableLines.length > 0 || line.startsWith('|')) tableLines.push(line); // Collect lines starting from title
      } else {
         if (line.startsWith('|')) tableLines.push(line);
      }
    }
    
    if (line.startsWith('===== Resumen del Proceso') || line.startsWith('--- FIN DEL REPORTE')) {
        // Collect footer text
        report.rawFooterText.push(line);
    } else if (report.rawFooterText.length > 0) {
        report.rawFooterText.push(line);
    }
  }
  
  // Process any remaining table if the file ends mid-table
  if (inTable && tableLines.length > 0) {
    const parsedTable = parseMarkdownTable(tableLines);
     if (currentSection === 'weeklyComparison') {
        report.weeklyComparison = {
          headers: parsedTable.headers,
          rows: parsedTable.rows.map(row => {
            const newRow: Record<string, MetricChange | string> = {};
            newRow[parsedTable.headers[0]] = row[parsedTable.headers[0]]; // Metric name
            for (let i = 1; i < parsedTable.headers.length; i++) {
              newRow[parsedTable.headers[i]] = parseMetricChange(row[parsedTable.headers[i]]);
            }
            return newRow;
          }),
          notes: parsedTable.notes,
        };
      } else if (currentSection === 'funnelAnalysis') {
        report.funnelAnalysis = parsedTable as FunnelData;
      } else if (currentSection === 'topAds' || currentSection === 'topAdSets' || currentSection === 'topCampaigns') {
        const title = tableLines[0].replace('** ', '').trim();
        const data = { title, ...parseMarkdownTable(tableLines.slice(1)) } as TopListData;
        if (currentSection === 'topAds') report.topAds?.push(data);
        if (currentSection === 'topAdSets') report.topAdSets?.push(data);
        if (currentSection === 'topCampaigns') report.topCampaigns?.push(data);
      } else if (currentSection === 'audiencePerformance') {
        report.audiencePerformance = parsedTable as AudiencePerformanceData;
      } else if (currentSection === 'ratioTrends') {
        report.ratioTrends = parsedTable as RatioTrendsData;
      }
  }


  return report;
};