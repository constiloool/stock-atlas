import Link from "next/link";
import type React from "react";
import { ArrowLeft, BarChart3, Bot, Building2, Layers3, LineChart, ShieldCheck } from "lucide-react";
import { companies, findCompany } from "@/lib/companies";

export function generateStaticParams() {
  return companies.map((company) => ({ ticker: company.ticker }));
}

export default async function CompanyPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = await params;
  const decodedTicker = decodeURIComponent(ticker);
  const company = findCompany(decodedTicker);
  const displayTicker = company?.ticker ?? decodedTicker.toUpperCase();

  return (
    <main className="grain min-h-screen bg-[radial-gradient(circle_at_64%_8%,rgba(236,232,224,0.12),transparent_26%),radial-gradient(circle_at_16%_52%,rgba(111,143,99,0.16),transparent_34%),linear-gradient(180deg,#102016_0%,#0d1a12_52%,#071109_100%)] px-4 py-5 text-birch sm:px-6">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-5">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/atlas" className="inline-flex items-center gap-2 rounded-full border border-birch/14 bg-[#102016]/44 px-4 py-2 text-sm text-birch/72 backdrop-blur-xl transition hover:text-birch">
            <ArrowLeft className="h-4 w-4" />
            Back to Atlas
          </Link>
          <p className="rounded-full border border-birch/10 bg-[#102016]/32 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-birch/46 backdrop-blur-xl">
            Research workspace
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded-[18px] border border-birch/12 bg-[#102016]/44 p-5 shadow-2xl shadow-black/18 backdrop-blur-xl sm:p-7">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#bedcaa]">{displayTicker}</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.02em] text-birch sm:text-6xl">{company?.name ?? "Company not found"}</h1>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="Location" value={company?.location ?? "Unknown"} icon={<Building2 className="h-4 w-4" />} />
              <Metric label="Country" value={company?.country ?? "Unknown"} icon={<ShieldCheck className="h-4 w-4" />} />
              <Metric label="Sector" value={company?.sector ?? "Unknown"} icon={<Layers3 className="h-4 w-4" />} />
            </div>
          </div>

          <div className="rounded-[18px] border border-birch/12 bg-[#102016]/44 p-5 shadow-2xl shadow-black/18 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.18em] text-birch/42">Current price placeholder</p>
            <p className="mt-4 text-4xl font-semibold text-birch">$189.84</p>
            <p className="mt-2 text-sm text-[#9ee889]">+1.23 (0.65%) demo</p>
            <p className="mt-5 text-xs leading-5 text-birch/46">
              Market-data wiring can live here without adding analysis weight back onto the map.
            </p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <Panel title="Candlestick area" icon={<LineChart className="h-5 w-5" />}>
            <div className="h-64 rounded-[12px] border border-birch/10 bg-[linear-gradient(135deg,rgba(101,212,110,0.12),transparent),repeating-linear-gradient(90deg,rgba(236,232,224,0.12)_0_1px,transparent_1px_18px),linear-gradient(180deg,#162719,#09130c)]" />
          </Panel>

          <Panel title="Fundamentals" icon={<BarChart3 className="h-5 w-5" />}>
            <div className="grid gap-3">
              {["Revenue growth", "Operating margin", "Free cash flow", "Balance sheet"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-[10px] border border-birch/10 bg-birch/[0.035] px-3 py-3">
                  <span className="text-sm text-birch/62">{item}</span>
                  <span className="font-mono text-xs text-[#bedcaa]">Placeholder</span>
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Panel title="AI agents" icon={<Bot className="h-5 w-5" />}>
            <div className="grid gap-3">
              {["Value Agent", "Growth Agent", "Risk Agent"].map((agent) => (
                <div key={agent} className="rounded-[12px] border border-birch/10 bg-birch/[0.035] p-4">
                  <p className="font-semibold text-birch">{agent}</p>
                  <p className="mt-2 text-sm leading-6 text-birch/52">Placeholder analysis will live here on the company page.</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Derivatives" icon={<Layers3 className="h-5 w-5" />}>
            <div className="rounded-[12px] border border-birch/10 bg-birch/[0.035] p-4 text-sm leading-6 text-birch/54">
              Options, implied volatility, scenario notes and derivative placeholders belong here, separate from the map experience.
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-[12px] border border-birch/10 bg-birch/[0.035] p-4">
      <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-birch/42">
        {icon}
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-birch">{value}</p>
    </div>
  );
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[18px] border border-birch/12 bg-[#102016]/44 p-5 shadow-2xl shadow-black/18 backdrop-blur-xl">
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-birch/72">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}
