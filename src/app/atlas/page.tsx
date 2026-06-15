"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Leaf } from "lucide-react";
import { AtlasMap } from "@/components/AtlasMap";
import { CompanySearch } from "@/components/CompanySearch";
import { Disclaimer } from "@/components/Disclaimer";
import { StockAnalysisPanel } from "@/components/StockAnalysisPanel";
import { companies, type Company } from "@/lib/companies";
import type { StockQuote, TimeRange } from "@/types/stock";

export default function AtlasPage() {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [unknownTicker, setUnknownTicker] = useState<string | null>(null);
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
    <main className="grain relative min-h-screen overflow-hidden bg-[#102016]">
      <AtlasMap activeCompany={selectedCompany} onMarkerClick={openCompany} fullscreen showAllMarkers={false} />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[#102016]/58 via-[#102016]/12 to-transparent px-4 py-4 sm:px-6">
        <header className="pointer-events-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full border border-birch/12 p-2 text-birch/70 transition hover:text-birch" aria-label="Back home">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-birch/16 bg-[#102016]/42 backdrop-blur-md">
              <Leaf className="h-4 w-4 text-glow" />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-birch/45">Stock Atlas</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <Disclaimer />
          </div>
        </header>
      </div>

      <div className="absolute left-4 right-4 top-24 z-30 sm:left-6 sm:right-auto sm:top-24">
        <CompanySearch activeTicker={activeTicker} onSelect={selectCompany} onUnknown={selectUnknown} compact />
      </div>

      {panelOpen ? (
        <div className="fixed inset-0 z-40 flex items-end bg-[#102016]/68 p-0 backdrop-blur-[18px] sm:items-center sm:justify-center sm:p-6">
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
