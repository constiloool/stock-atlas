"use client";

import { ArrowDownRight, ArrowUpRight, MapPin, X } from "lucide-react";
import type { Company } from "@/lib/companies";
import { getMockAgentScores } from "@/lib/mockAgents";
import type { StockQuote, TimeRange } from "@/types/stock";
import { formatCompact, formatCurrency, formatDate, formatPercent } from "@/lib/formatters";
import { CandlestickChart } from "./CandlestickChart";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import { AgentScoresPanel } from "./AgentScoresPanel";
import { FundamentalsPanel } from "./FundamentalsPanel";
import { DerivativesPanel } from "./DerivativesPanel";

const ranges: TimeRange[] = ["1D", "5D", "1M", "6M", "1Y"];

export function StockAnalysisPanel({
  selectedCompany,
  unknownTicker,
  quote,
  loading,
  error,
  range,
  onRangeChange,
  onClose
}: {
  selectedCompany: Company | null;
  unknownTicker: string | null;
  quote: StockQuote | null;
  loading: boolean;
  error: string | null;
  range: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  onClose: () => void;
}) {
  const ticker = selectedCompany?.ticker ?? unknownTicker ?? quote?.ticker ?? "AAPL";
  const agents = getMockAgentScores(ticker);
  const positive = (quote?.change ?? 0) >= 0;
  const Arrow = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <aside className="grid max-h-[86vh] gap-4 overflow-y-auto rounded-t-[24px] border border-birch/14 bg-[#161b16]/88 p-4 shadow-2xl shadow-black/38 backdrop-blur-2xl sm:rounded-[22px] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-birch/10 pb-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-glow">Analysis Panel</p>
          <h2 className="mt-2 break-words text-2xl font-semibold text-birch">{quote?.name ?? selectedCompany?.name ?? ticker}</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-birch/52">
            <MapPin className="h-4 w-4 text-glow" />
            <span className="break-words">{quote?.location ?? selectedCompany?.location ?? "Location unknown"}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-birch/12 bg-birch/[0.04] px-3 py-2 font-mono text-xs text-birch">{ticker}</span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-birch/12 bg-birch/[0.04] text-birch/70 transition hover:text-birch"
            aria-label="Close analysis"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {unknownTicker && !selectedCompany ? (
        <p className="rounded-[3px] border border-birch/10 bg-birch/[0.035] p-3 text-sm leading-6 text-birch/62">
          This ticker is not in the local atlas yet, so no map marker is available. Market data loading is still attempted.
        </p>
      ) : null}

      {loading && !quote ? <LoadingState /> : null}
      {error ? <ErrorState message={error} /> : null}

      {quote ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label="Sector" value={quote.sector ?? selectedCompany?.sector ?? "N/A"} />
            <Metric label="Volume" value={formatCompact(quote.volume)} />
            <Metric label="Current Price" value={formatCurrency(quote.currentPrice, quote.currency)} />
            <Metric
              label="Daily Change"
              value={`${formatCurrency(quote.change, quote.currency)} · ${formatPercent(quote.changePercent)}`}
              tone={positive ? "positive" : "negative"}
              icon={<Arrow className="h-4 w-4" />}
            />
            <Metric label="Last Updated" value={formatDate(quote.lastUpdated)} />
            <Metric label="Data Source" value={quote.source === "alpha-vantage" ? "Alpha Vantage" : "Demo fallback"} />
          </div>

          {quote.notice ? (
            <p className="rounded-[3px] border border-glow/18 bg-glow/[0.07] p-3 text-xs leading-5 text-birch/68">{quote.notice}</p>
          ) : null}

          <section className="rounded-[3px] border border-birch/12 bg-charcoal/58 p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-birch">Candlestick Chart</h3>
              <div className="flex rounded-full border border-birch/10 bg-deepgreen/70 p-1">
                {ranges.map((item) => (
                  <button
                    key={item}
                    onClick={() => onRangeChange(item)}
                    className={`h-8 rounded-full px-3 font-mono text-xs transition ${
                      range === item ? "bg-birch text-charcoal" : "text-birch/55 hover:text-birch"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            {loading ? <LoadingState label="Updating candles" /> : <CandlestickChart candles={quote.candles} />}
          </section>

          <AgentScoresPanel agents={agents} />
          <FundamentalsPanel fundamentals={quote.fundamentals} />
          <DerivativesPanel />
        </>
      ) : null}
    </aside>
  );
}

function Metric({
  label,
  value,
  tone,
  icon
}: {
  label: string;
  value: string;
  tone?: "positive" | "negative";
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[3px] border border-birch/10 bg-birch/[0.03] p-3">
      <p className="text-xs text-birch/42">{label}</p>
      <p
        className={`mt-1 flex min-w-0 items-center gap-1 break-words text-sm font-medium ${
          tone === "positive" ? "text-glow" : tone === "negative" ? "text-[#D99A91]" : "text-birch"
        }`}
      >
        {icon}
        {value}
      </p>
    </div>
  );
}
