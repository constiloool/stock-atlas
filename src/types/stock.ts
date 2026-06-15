export type TimeRange = "1D" | "5D" | "1M" | "6M" | "1Y";

export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type Fundamentals = {
  marketCap?: number | null;
  peRatio?: number | null;
  eps?: number | null;
  revenueGrowth?: number | null;
  dividendYield?: number | null;
  debtToEquity?: number | null;
};

export type StockQuote = {
  ticker: string;
  name?: string | null;
  location?: string | null;
  sector?: string | null;
  currency: string;
  currentPrice?: number | null;
  change?: number | null;
  changePercent?: number | null;
  lastUpdated?: string | null;
  volume?: number | null;
  candles: Candle[];
  fundamentals: Fundamentals;
  source: "alpha-vantage" | "demo";
  notice?: string;
};
