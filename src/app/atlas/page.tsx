"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Compass, Hand, Leaf, Map, MousePointerClick, Move, ScanSearch, Shield, Smartphone, Sparkles, Target, ZoomIn } from "lucide-react";
import { AtlasMap } from "@/components/AtlasMap";
import { CompanySearch } from "@/components/CompanySearch";
import { Disclaimer } from "@/components/Disclaimer";
import { StockAnalysisPanel } from "@/components/StockAnalysisPanel";
import type { Company } from "@/lib/companies";
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
    <main className="grain min-h-screen overflow-hidden bg-[radial-gradient(circle_at_62%_8%,rgba(236,232,224,0.12),transparent_28%),radial-gradient(circle_at_18%_42%,rgba(111,143,99,0.16),transparent_34%),linear-gradient(180deg,#102016_0%,#0d1a12_52%,#071109_100%)] px-4 py-5 text-birch sm:px-6">
      <header className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="rounded-full border border-birch/14 bg-[#102016]/44 p-2 text-birch/72 backdrop-blur-xl transition hover:text-birch" aria-label="Back home">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-lg font-semibold uppercase tracking-[0.08em] text-birch/88">Stock Atlas - Karten Erfahrung</p>
            <p className="mt-1 text-xs text-birch/48">Eine ruhige, neblige Research-Karte mit echten Marktdaten.</p>
          </div>
        </div>
        <div className="hidden sm:block">
          <Disclaimer />
        </div>
      </header>

      <div className="relative z-10 grid gap-4 xl:grid-cols-[300px_minmax(0,1fr)_230px]">
        <SpecPanel />

        <section className="min-w-0">
          <h1 className="mb-3 text-center text-base font-semibold uppercase tracking-[0.12em] text-birch/82">
            Atlas-Seite - Die Karte ist alles
          </h1>
          <div className="relative h-[64vh] min-h-[560px] overflow-hidden rounded-[18px] border border-birch/14 bg-[#102016]/62 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <AtlasMap activeCompany={selectedCompany} onMarkerClick={openCompany} fullscreen showAllMarkers={false} />
            <div className="absolute left-4 right-4 top-4 z-30 sm:left-6 sm:right-auto">
              <CompanySearch activeTicker={activeTicker} onSelect={selectCompany} onUnknown={selectUnknown} compact />
            </div>
            <MapCallouts activeCompany={selectedCompany} />
          </div>
        </section>

        <InteractionPanel />
      </div>

      <BottomPanels />

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

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[14px] border border-birch/12 bg-[#102016]/48 p-4 shadow-2xl shadow-black/10 backdrop-blur-xl ${className}`}>{children}</section>;
}

function SpecPanel() {
  const requirements = [
    "Ganze Welt sichtbar und detailreich",
    "Küsten, Inseln und Regionen erkennbar",
    "Kein schwarzer Rand beim Panning",
    "Flüssiges Drag & Zoom",
    "Suche ohne Vorschläge vor der Suche",
    "Marker klein, dezent und klickbar",
    "Analysepanel erst nach Klick",
    "Performance optimiert",
    "Responsive Desktop & Mobile"
  ];

  return (
    <Panel className="xl:min-h-[720px]">
      <h2 className="text-lg font-semibold uppercase tracking-[0.08em] text-birch/90">Stock Atlas</h2>
      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-birch/76">Ziel</h3>
        <p className="mt-3 text-sm leading-6 text-birch/62">
          Eine detaillierte, interaktive Weltkarte, die sich leicht, ruhig und natürlich anfuehlt. Informationen erscheinen erst nach Suche und Klick.
        </p>
      </div>
      <div className="mt-7">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-birch/76">Hauptanforderungen</h3>
        <div className="mt-3 grid gap-2.5">
          {requirements.map((item) => (
            <div key={item} className="flex gap-2 text-sm leading-5 text-birch/64">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#9fc587]" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-7">
        <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-birch/76">Farbstimmung</h3>
        <div className="mt-4 grid grid-cols-5 gap-3">
          {[
            ["#102016", "Deep"],
            ["#1F3A2A", "Forest"],
            ["#6F8F63", "Moss"],
            ["#A8B7A0", "Sage"],
            ["#ECE8E0", "Birch"]
          ].map(([color, label]) => (
            <div key={color} className="min-w-0 text-center">
              <div className="mx-auto h-9 w-9 rounded-full border border-birch/12" style={{ background: color }} />
              <p className="mt-2 truncate text-[10px] text-birch/52">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function InteractionPanel() {
  const items = [
    [Hand, "Pan (Drag)", "Linksklick halten und ziehen, um die Karte zu bewegen."],
    [ZoomIn, "Zoom", "Mausrad oder Zoom-Buttons verwenden."],
    [Target, "Hover Marker", "Zeigt ein kleines Label mit Name und Ort."],
    [MousePointerClick, "Click Marker", "Oeffnet das Analysepanel."]
  ] as const;

  return (
    <Panel className="xl:min-h-[720px]">
      <h2 className="text-base font-semibold uppercase tracking-[0.1em] text-birch/86">Interaktionen</h2>
      <div className="mt-7 grid gap-6">
        {items.map(([Icon, title, text]) => (
          <div key={title} className="grid grid-cols-[44px_1fr] gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-birch/14 bg-birch/[0.04] text-[#bedcaa]">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-birch/78">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-birch/54">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MapCallouts({ activeCompany }: { activeCompany: Company | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden text-xs text-birch/70 lg:block">
      <div className="absolute left-7 top-28 max-w-xs">
        <p className="font-semibold text-birch">Suche ohne Vorschläge vor der Suche</p>
        <p className="mt-1 text-birch/58">Schwebend, leicht, frosted-glass Look.</p>
      </div>
      <div className="absolute bottom-16 left-8 max-w-xs">
        <p className="font-semibold text-birch">Detailreiche Karte</p>
        <p className="mt-1 text-birch/58">Kontinente, Küsten, Inseln und Regionen bleiben erkennbar.</p>
      </div>
      <div className="absolute bottom-20 right-8 max-w-xs text-right">
        <p className="font-semibold text-birch">Atmosphäre</p>
        <p className="mt-1 text-birch/58">Leichter Nebel, weiches Licht, keine harten Kontraste.</p>
      </div>
      {activeCompany ? (
        <div className="absolute left-[46%] top-[50%] max-w-xs">
          <p className="font-semibold text-birch">Unternehmensmarker</p>
          <p className="mt-1 text-birch/58">Kleine Punkte. Klick oeffnet die Analyse.</p>
        </div>
      ) : null}
    </div>
  );
}

function BottomPanels() {
  return (
    <div className="relative z-10 mt-4 grid gap-4 xl:grid-cols-[300px_minmax(0,440px)_minmax(0,1fr)_190px]">
      <Panel>
        <h3 className="text-center text-sm font-semibold uppercase tracking-[0.1em] text-birch/80">Standardansicht</h3>
        <div className="mt-4 flex h-36 items-center justify-center rounded-[10px] border border-birch/8 bg-[radial-gradient(circle_at_52%_35%,rgba(236,232,224,0.13),transparent_38%),linear-gradient(180deg,#1f3a2a,#102016)]">
          <Map className="h-12 w-12 text-birch/48" />
        </div>
        <p className="mt-3 text-center text-xs leading-5 text-birch/54">Beim Laden: ganze Welt sichtbar, Karte leicht rausgezoomt.</p>
      </Panel>
      <Panel>
        <h3 className="text-center text-sm font-semibold uppercase tracking-[0.1em] text-birch/80">Zoom & Pan</h3>
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <MiniFrame label="Europa" />
          <Move className="h-5 w-5 text-birch/56" />
          <MiniFrame label="Karibik" />
        </div>
        <p className="mt-3 text-center text-xs leading-5 text-birch/54">Reinzoomen fuer Details. Bounds verhindern leere Raender.</p>
      </Panel>
      <Panel>
        <h3 className="text-center text-sm font-semibold uppercase tracking-[0.1em] text-birch/80">Analysepanel nach Klick</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
          <div className="rounded-[10px] border border-birch/12 bg-[#161b16]/70 p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-semibold text-birch">AAPL</p>
                <p className="text-xs text-birch/54">Apple Inc.</p>
              </div>
              <p className="text-sm text-[#bedcaa]">$189.84</p>
            </div>
            <div className="mt-5 h-20 rounded bg-[linear-gradient(135deg,rgba(101,212,110,0.18),transparent),repeating-linear-gradient(90deg,rgba(236,232,224,0.18)_0_2px,transparent_2px_14px)]" />
          </div>
          <p className="self-center text-xs leading-5 text-birch/58">Hintergrund beim Oeffnen stark geblurrt und abgedunkelt. Karte bleibt spuerbar, aber nicht ablenkend.</p>
        </div>
      </Panel>
      <Panel>
        <h3 className="text-center text-sm font-semibold uppercase tracking-[0.1em] text-birch/80">Mobile</h3>
        <div className="mx-auto mt-4 h-40 w-24 rounded-[20px] border border-birch/14 bg-[#102016]/75 p-2">
          <div className="h-full rounded-[14px] bg-[radial-gradient(circle_at_50%_35%,rgba(236,232,224,0.12),transparent_40%),linear-gradient(180deg,#1f3a2a,#071208)]" />
        </div>
      </Panel>
      <Panel className="xl:col-span-4">
        <div className="grid gap-4 text-xs text-birch/58 sm:grid-cols-3 lg:grid-cols-6">
          {[
            [Compass, "Detaillierte Geo-Daten"],
            [Sparkles, "Leichte Nebelstimmung"],
            [Shield, "Bounds & Constraints"],
            [ScanSearch, "Saubere Suche"],
            [Leaf, "Natuerlich"],
            [Smartphone, "Responsive"]
          ].map(([Icon, label]) => (
            <div key={label as string} className="flex items-center gap-3">
              <Icon className="h-5 w-5 text-birch/72" />
              <span>{label as string}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MiniFrame({ label }: { label: string }) {
  return (
    <div>
      <div className="h-28 rounded-[10px] border border-birch/10 bg-[radial-gradient(circle_at_48%_35%,rgba(236,232,224,0.12),transparent_38%),linear-gradient(180deg,#24422f,#102016)]" />
      <p className="mt-2 text-center text-xs text-birch/52">{label}</p>
    </div>
  );
}
