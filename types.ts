
export interface GeneralInfo {
  reportDate?: string;
  currency?: string;
  filteredCampaign?: string;
  filteredAdSets?: string;
  rawHeaderText: string[];
}

export interface MetricChange {
  value: string; // Original string value like "€1.000,86" or "14,9%🔺" or "2,41x"
  parsedValue?: number;
  percentageChange?: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  isEuro?: boolean;
  isPercentage?: boolean;
  isMultiplier?: boolean;
  stabilityIcon?: '✅' | '🏆' | string; // Allow string for flexibility
}

export interface WeeklyComparisonData {
  headers: string[];
  rows: Array<Record<string, MetricChange | string>>; // string for metric name
  notes?: string[];
}

export interface FunnelData {
  headers: string[];
  rows: Array<Record<string, string>>; // Values are like "215.327" or "1,2%🔻"
  notes?: string[];
}

export interface TopListData {
  title: string;
  headers: string[];
  rows: Array<Record<string, string>>;
  notes?: string[];
}

export interface AudiencePerformanceData {
  headers: string[];
  rows: Array<Record<string, string>>;
}

export interface RatioTrendsData {
  headers: string[];
  rows: Array<Record<string, string>>;
}

export interface ParsedReport {
  generalInfo: GeneralInfo;
  weeklyComparison?: WeeklyComparisonData;
  funnelAnalysis?: FunnelData;
  topAds?: TopListData[]; // Array for current week, 1st prev, etc.
  topAdSets?: TopListData[];
  topCampaigns?: TopListData[];
  audiencePerformance?: AudiencePerformanceData;
  ratioTrends?: RatioTrendsData;
  rawFooterText: string[];
}

// Keep ReportData for potential future use or stricter typing if needed
export type ReportData = ParsedReport;