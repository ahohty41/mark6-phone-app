export interface MarkSixResult {
  drawNumber?: string;
  drawDate?: string;
  numbers: number[];
  extraNumber?: number | null;
  nextDrawDate?: string;
  jackpot?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: MarkSixResult;
  error?: string;
}
