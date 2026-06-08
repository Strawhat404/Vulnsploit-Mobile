export type ScanStatus = 'pending' | 'running' | 'completed' | 'failed';
export type ReportStatus = 'generating' | 'ready' | 'failed';
export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface ScanResult {
  id: number;
  username: string;
  target: string;
  scan_type: string;
  status: ScanStatus;
  result: string | null;
  result_json: Record<string, unknown> | null;
  created_at: string;
  completed_at: string | null;
  recon_session: number | null;
}

export interface ReconSession {
  id: number;
  username: string;
  target: string;
  status: ScanStatus;
  created_at: string;
  completed_at: string | null;
  completed_scans: number;
  total_scans: number;
  has_report: boolean;
  report_id: number | null;
  scans?: ScanResult[];
}

export interface Finding {
  title: string;
  severity: Severity;
  description: string;
  impact: string;
  recommendation: string;
  evidence: string;
  tool: string;
}

export interface ScanReport {
  id: number;
  username: string;
  target: string;
  status: ReportStatus;
  risk_level: RiskLevel;
  severity_counts: Record<Severity, number>;
  findings_json: Finding[];
  created_at: string;
  generated_at: string | null;
  pdf_url: string | null;
  error_message: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface TokenPair {
  access: string;
  refresh: string;
}
