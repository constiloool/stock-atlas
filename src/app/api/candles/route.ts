import { NextResponse } from "next/server";
import { getStockQuote } from "@/lib/marketData";
import type { TimeRange } from "@/types/stock";

const ranges = new Set<TimeRange>(["1D", "5D", "1M", "6M", "1Y"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker") ?? "AAPL";
  const rangeParam = searchParams.get("range") ?? "1M";
  const range = ranges.has(rangeParam as TimeRange) ? (rangeParam as TimeRange) : "1M";
  const quote = await getStockQuote(ticker, range);
  return NextResponse.json({ ticker: quote.ticker, source: quote.source, notice: quote.notice, candles: quote.candles });
}
