"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AtlasMap } from "@/components/AtlasMap";
import { CompanySearch } from "@/components/CompanySearch";
import { StockAnalysisPanel } from "@/components/StockAnalysisPanel";
import { findCompany, type Company } from "@/lib/companies";
import type { StockQuote, TimeRange } from "@/types/stock";

function submittedSearchQuery() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("company-search");
}

function initialCompany() {
  const query = submittedSearchQuery();
  return query ? findCompany(query) ?? null : null;
}

function initialUnknownTicker() {
  const query = submittedSearchQuery();
  return query && !findCompany(query) ? query.toUpperCase() : null;
}

export default function AtlasPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(() => initialCompany());
  const [unknownTicker, setUnknownTicker] = useState<string | null>(() => initialUnknownTicker());
  const [range, setRange] = useState<TimeRange>("1M");
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const activeTicker = selectedCompany?.ticker ?? unknownTicker ?? "AAPL";

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/stock?ticker=${encodeURIComponent(activeTicker)}&range=${range}`, {
          signal: controller.signal
        });
        if (!response.ok) throw new Error("Market data request failed.");
        setQuote((await response.json()) as StockQuote);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Market data could not be loaded.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [activeTicker, range]);

  function selectCompany(company: Company) {
    setSelectedCompany(company);
    setUnknownTicker(null);
    setPanelOpen(false);
  }

  function selectUnknown(ticker: string) {
    setSelectedCompany(null);
    setUnknownTicker(ticker);
    setPanelOpen(true);
  }

  function openCompany(company: Company) {
    setSelectedCompany(company);
    setUnknownTicker(null);
    setPanelOpen(true);
  }

  return (
    <main className="relative h-screen overflow-hidden bg-[#0b150d] text-birch">
      <div className={`absolute inset-0 transition duration-500 ${panelOpen ? "blur-[16px] brightness-[0.48]" : ""}`}>
        <AtlasMap activeCompany={selectedCompany} onMarkerClick={openCompany} fullscreen showAllMarkers={false} />
      </div>

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-birch/14 bg-[#102016]/42 text-birch/72 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:bg-birch/10 hover:text-birch"
            aria-label="Back home"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="hidden rounded-full border border-birch/12 bg-[#102016]/34 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-birch/70 shadow-2xl shadow-black/15 backdrop-blur-xl sm:block">
            Stock Atlas
          </div>
        </div>

        <p className="pointer-events-auto max-w-[240px] rounded-full border border-birch/10 bg-[#102016]/30 px-4 py-2 text-right text-[10px] leading-4 text-birch/48 shadow-2xl shadow-black/15 backdrop-blur-xl">
          Research only. Not financial advice.
        </p>
      </header>

      <div className="absolute left-4 top-[74px] z-30 w-[calc(100%-2rem)] sm:left-6 sm:top-[86px] sm:w-[390px]">
        <CompanySearch activeTicker={activeTicker} onSelect={selectCompany} onUnknown={selectUnknown} compact />
      </div>

      {panelOpen ? (
        <div className="fixed inset-0 z-40 flex items-end bg-[#061008]/42 p-0 backdrop-blur-[2px] sm:items-center sm:justify-center sm:p-6">
          <div className="w-full sm:max-w-5xl">
            <StockAnalysisPanel
              selectedCompany={selectedCompany}
              unknownTicker={unknownTicker}
              quote={quote}
              loading={loading}
              error={error}
              range={range}
              onRangeChange={setRange}
              onClose={() => setPanelOpen(false)}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
