import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { Disclaimer } from "./Disclaimer";

export function LandingHero() {
  return (
    <main className="grain relative min-h-screen overflow-hidden bg-[#071208]">
      <div className="absolute inset-0 z-0 bg-[url('/forest-mist-hero.png')] bg-cover bg-center" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(2,7,3,0.84)_0%,rgba(2,7,3,0.45)_44%,rgba(2,7,3,0.3)_100%),linear-gradient(180deg,rgba(7,18,8,0.22)_0%,rgba(7,18,8,0.16)_36%,rgba(2,7,3,0.82)_100%)]" />
      <div className="fog-drift absolute left-[-15%] top-[16%] z-0 h-44 w-[130%] rounded-full bg-birch/10 blur-3xl" />
      <div className="fog-drift absolute left-[-20%] top-[43%] z-0 h-32 w-[140%] rounded-full bg-[#aeb9a7]/9 blur-2xl [animation-delay:2s]" />
      <div className="absolute inset-x-0 bottom-0 z-0 h-52 bg-gradient-to-t from-[#020503] to-transparent" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8">
        <nav className="flex items-center justify-between border-b border-birch/10 pb-5 text-[11px] uppercase tracking-[0.28em] text-birch/60">
          <span>Stock Atlas</span>
          <span>Mist Research</span>
          <span className="hidden sm:inline">Market Research</span>
        </nav>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="max-w-4xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-birch/14 bg-[#071208]/45 px-3 py-2 text-xs text-birch/72 shadow-2xl shadow-black/20 backdrop-blur-md">
              <Globe2 className="h-4 w-4 text-glow" />
              Enter a quiet investment forest
            </div>
            <h1 className="max-w-4xl text-6xl font-semibold leading-[0.9] tracking-normal text-birch drop-shadow-2xl sm:text-8xl lg:text-9xl">
              Stock Atlas
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-8 text-birch/74">
              Discover companies across the world through a calmer lens of mist, terrain and market data.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/atlas"
                className="inline-flex h-12 items-center gap-3 rounded-full bg-birch px-6 text-sm font-semibold text-charcoal shadow-xl shadow-black/25 transition hover:bg-white"
              >
                Enter Stock Atlas
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-birch/58">Dotted world map. Calm analysis. No broker noise.</span>
            </div>
          </div>

          <div className="hidden rounded-[2px] border border-birch/12 bg-[#071208]/34 p-5 shadow-2xl shadow-black/30 backdrop-blur-md lg:block">
            <div className="border-b border-birch/10 pb-4 text-[11px] uppercase tracking-[0.24em] text-birch/55">Atlas Notes</div>
            <div className="mt-5 grid gap-5">
              {[
                ["01", "Search companies by ticker or name."],
                ["02", "See their approximate global position."],
                ["03", "Open a quiet market analysis panel with candles."],
                ["04", "Prepare future AI-investor agents without pretending they are live."]
              ].map(([number, text]) => (
                <div key={number} className="grid grid-cols-[42px_1fr] gap-4 border-b border-birch/8 pb-5 last:border-0 last:pb-0">
                  <span className="font-mono text-xs text-glow">{number}</span>
                  <p className="text-sm leading-6 text-birch/72">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-birch/10 pt-5">
          <Disclaimer />
          <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-birch/45">Birch / Forest / Charcoal</span>
        </footer>
      </section>
    </main>
  );
}
