export interface PayoutDetail {
  prizeLevel: string;
  dividend: number;
  winningUnits: number;
}

export interface NextDraw {
  drawNumber: string;
  drawDate: string;
  estimatedJackpot: number;
}

export interface MarkSixResult {
  drawNumber: string;
  drawDate: string;
  turnover: number;
  numbers: string[];
  extraNumber: string;
  payoutDetails: PayoutDetail[];
  nextDraw: NextDraw | null;
  updateTime: string;
}

export interface ApiResponse {
  success: boolean;
  data?: MarkSixResult;
  error?: string;
}

export interface HistoryEntry {
  id: number;
  numbers: number[];
  timestamp: Date;
}

export interface FavoriteEntry {
  id: number;
  numbers: number[];
  timestamp: Date;
}

export interface DrawResult {
  drawNumber: string;
  drawDate: string;
  turnover: number;
  numbers: string[];
  extraNumber: string;
  payoutDetails: PayoutDetail[];
}

export interface AnalyseResponse {
  success: boolean;
  count?: number;
  data?: DrawResult[];
  error?: string;
}
