import { companyByTicker } from "./companies";
import type { Candle, StockQuote, TimeRange } from "@/types/stock";

const demoFundamentals = {
  marketCap: null,
  peRatio: null,
  eps: null,
  revenueGrowth: null,
  dividendYield: null,
  debtToEquity: null
};

function normalizeTicker(ticker: string) {
  return ticker.trim().toUpperCase().replace(/\s+/g, "");
}

function rangeDays(range: TimeRange) {
  return ({ "1D": 2, "5D": 7, "1M": 32, "6M": 185, "1Y": 370 } as const)[range];
}

function currencyForTicker(ticker: string) {
  if (ticker.endsWith(".DE") || ticker.endsWith(".PA") || ticker.endsWith(".AS")) return "EUR";
  if (ticker.endsWith(".T")) return "JPY";
  return "USD";
}

function buildDemoCandles(ticker: string, range: TimeRange): Candle[] {
  const count = range === "1D" ? 30 : rangeDays(range);
  const seed = ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  let previousClose = 70 + (seed % 220);
  const today = new Date();
  const candles: Candle[] = [];

  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - index);
    const day = count - index;
    const seasonal = Math.sin((day + seed) / 5) * 2.4;
    const slope = Math.cos((seed + day) / 19) * 0.42;
    const open = previousClose + Math.sin(seed + index) * 1.15;
    const close = Math.max(1.5, open + seasonal * 0.55 + slope);
    const high = Math.max(open, close) + 1.2 + ((seed + index) % 6) * 0.22;
    const low = Math.max(1, Math.min(open, close) - 1.1 - ((seed + index) % 5) * 0.18);

    candles.push({
      time: date.toISOString().slice(0, 10),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume: 600000 + ((seed * 911 + index * 7793) % 12000000)
    });

    previousClose = close;
  }

  return candles;
}

function quoteFromCandles(ticker: string, range: TimeRange, notice?: string): StockQuote {
  const company = companyByTicker(ticker);
  const candles = buildDemoCandles(ticker, range);
  const last = candles.at(-1);
  const previous = candles.at(-2);
  const change = last && previous ? last.close - previous.close : null;

  return {
    ticker,
    name: company?.name ?? `${ticker} Demo Equity`,
    location: company?.location ?? null,
    sector: company?.sector ?? null,
    currency: currencyForTicker(ticker),
    currentPrice: last?.close ?? null,
    change,
    changePercent: change && previous ? (change / previous.close) * 100 : null,
    lastUpdated: last?.time ?? null,
    volume: last?.volume ?? null,
    candles,
    fundamentals: demoFundamentals,
    source: "demo",
    notice:
      notice ??
      "Demo market data is shown because no live API key is configured. Add ALPHA_VANTAGE_API_KEY for live daily candles."
  };
}

async function fetchAlphaVantage(ticker: string, range: TimeRange, apiKey: string): Promise<StockQuote> {
  const url = new URL("https://www.alphavantage.co/query");
  url.searchParams.set("function", "TIME_SERIES_DAILY");
  url.searchParams.set("symbol", ticker);
  url.searchParams.set("outputsize", range === "1Y" ? "full" : "compact");
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url, { next: { revalidate: 300 } });
  if (!response.ok) throw new Error("Alpha Vantage request failed.");

  const payload = await response.json();
  const series = payload["Time Series (Daily)"] as Record<string, Record<string, string>> | undefined;
  if (!series) {
    const message = payload.Note ?? payload.Information ?? payload["Error Message"] ?? "No time series returned.";
    throw new Error(message);
  }

  const candles = Object.entries(series)
    .slice(0, rangeDays(range))
    .reverse()
    .map(([time, value]) => ({
      time,
      open: Number(value["1. open"]),
      high: Number(value["2. high"]),
      low: Number(value["3. low"]),
      close: Number(value["4. close"]),
      volume: Number(value["5. volume"])
    }))
    .filter((candle) => [candle.open, candle.high, candle.low, candle.close].every(Number.isFinite));

  if (!candles.length) throw new Error("No usable candles returned.");

  const company = companyByTicker(ticker);
  const last = candles.at(-1);
  const previous = candles.at(-2);
  const change = last && previous ? last.close - previous.close : null;

  return {
    ticker,
    name: company?.name ?? null,
    location: company?.location ?? null,
    sector: company?.sector ?? null,
    currency: currencyForTicker(ticker),
    currentPrice: last?.close ?? null,
    change,
    changePercent: change && previous ? (change / previous.close) * 100 : null,
    lastUpdated: last?.time ?? null,
    volume: last?.volume ?? null,
    candles,
    fundamentals: demoFundamentals,
    source: "alpha-vantage"
  };
}

export async function getStockQuote(tickerInput: string, range: TimeRange): Promise<StockQuote> {
  const ticker = normalizeTicker(tickerInput) || "AAPL";
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey || apiKey === "your_key_here") {
    return quoteFromCandles(ticker, range);
  }

  try {
    return await fetchAlphaVantage(ticker, range, apiKey);
  } catch (error) {
    return quoteFromCandles(
      ticker,
      range,
      `Live market data could not be loaded for ${ticker}. ${
        error instanceof Error ? error.message : "Please check the ticker or API key."
      } Showing marked demo data instead.`
    );
  }
}
