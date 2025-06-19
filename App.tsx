
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import ReactToPrint from 'react-to-print'; // Changed import from named to default
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ParsedReport } from './types';
import { parseReportData } from './services/dataParser';
import { ReportProvider } from './contexts/ReportContext';
import { OverviewPage } from './pages/OverviewPage';
import { WeeklySummaryPage } from './pages/WeeklySummaryPage';
import { FunnelAnalysisPage } from './pages/FunnelAnalysisPage';
import { TopAdsPage } from './pages/TopAdsPage';
import { TopAdSetsPage } from './pages/TopAdSetsPage';
import { TopCampaignsPage } from './pages/TopCampaignsPage';
import { AudiencePerformancePage } from './pages/AudiencePerformancePage';
import { RatioTrendsPage } from './pages/RatioTrendsPage';
import { reportTxt } from './reportData'; // Embedded report data

const App: React.FC = () => {
  const [reportData, setReportData] = useState<ParsedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const componentToPrintRef = useRef<HTMLDivElement>(null);

  // Attempt to use useReactToPrint from the default export.
  // Using 'as any' to bypass TypeScript's type checking for this specific call,
  // focusing on resolving the JavaScript runtime module loading error first.
  const handlePrint = (ReactToPrint as any).useReactToPrint({ 
    content: () => componentToPrintRef.current,
    documentTitle: 'Marketing_Report',
  });

  useEffect(() => {
    try {
      const parsedData = parseReportData(reportTxt);
      setReportData(parsedData);
    } catch (e) {
      console.error("Error parsing report data:", e);
      setError("Failed to parse report data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Report Overview';
    if (path.includes('weekly-summary')) return 'Weekly Summary';
    if (path.includes('funnel-analysis')) return 'Funnel Analysis';
    if (path.includes('top-ads')) return 'Top Ads';
    if (path.includes('top-adsets')) return 'Top AdSets';
    if (path.includes('top-campaigns')) return 'Top Campaigns';
    if (path.includes('audience-performance')) return 'Audience Performance';
    if (path.includes('ratio-trends')) return 'Ratio Trends';
    return 'Marketing Report';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-xl">Loading report data...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500 text-xl">{error}</div>;
  }

  if (!reportData) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-white text-xl">No report data available.</div>;
  }
  
  return (
    <ReportProvider value={reportData}>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={getPageTitle()} onDownloadPDF={handlePrint} reportDate={reportData.generalInfo.reportDate || "N/A"} />
          <main ref={componentToPrintRef} className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6 space-y-6 print:p-0 print:overflow-visible print:bg-white print:text-black">
            <Routes>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/weekly-summary" element={<WeeklySummaryPage />} />
              <Route path="/funnel-analysis" element={<FunnelAnalysisPage />} />
              <Route path="/top-ads" element={<TopAdsPage />} />
              <Route path="/top-adsets" element={<TopAdSetsPage />} />
              <Route path="/top-campaigns" element={<TopCampaignsPage />} />
              <Route path="/audience-performance" element={<AudiencePerformancePage />} />
              <Route path="/ratio-trends" element={<RatioTrendsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ReportProvider>
  );
};

export default App;
