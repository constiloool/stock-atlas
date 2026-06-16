"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Company } from "@/lib/companies";

export function AtlasSearch({
  companies,
  activeTicker,
  onFocusCompany,
  onOpenCompany
}: {
  companies: Company[];
  activeTicker: string | null;
  onFocusCompany: (company: Company) => void;
  onOpenCompany: (company: Company) => void;
}) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!trimmed) return [];
    return companies
      .filter(
        (company) =>
          company.ticker.toLowerCase().includes(trimmed) ||
          company.name.toLowerCase().includes(trimmed) ||
          company.location.toLowerCase().includes(trimmed) ||
          company.country.toLowerCase().includes(trimmed)
      )
      .slice(0, 5);
  }, [companies, trimmed]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const exact =
      companies.find((company) => company.ticker.toLowerCase() === trimmed) ??
      (results.length === 1 ? results[0] : null) ??
      results[0] ??
      null;
    if (exact) onFocusCompany(exact);
  }

  return (
    <div className="w-full rounded-[18px] border border-birch/14 bg-[#102016]/42 p-2 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:w-[390px]">
      <form onSubmit={submit} className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search companies</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-birch/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search company or ticker..."
            className="h-10 w-full rounded-full border border-birch/10 bg-[#061008]/44 pl-9 pr-4 text-sm text-birch outline-none transition placeholder:text-birch/42 focus:border-[#bedcaa]/50 focus:ring-2 focus:ring-[#bedcaa]/10"
          />
        </label>
        <button className="h-10 rounded-full bg-birch/86 px-4 text-sm font-semibold text-charcoal transition hover:bg-white" type="submit">
          Find
        </button>
      </form>

      {results.length > 0 ? (
        <div className="mt-2 grid gap-1">
          {results.map((company) => (
            <button
              key={company.ticker}
              onClick={() => onFocusCompany(company)}
              onDoubleClick={() => onOpenCompany(company)}
              className={`grid grid-cols-[68px_1fr] gap-3 rounded-[10px] border px-3 py-2 text-left transition ${
                activeTicker === company.ticker ? "border-glow/36 bg-glow/10" : "border-birch/8 bg-birch/[0.035] hover:border-birch/20"
              }`}
            >
              <span className="font-mono text-xs text-[#bedcaa]">{company.ticker}</span>
              <span className="min-w-0">
                <span className="block truncate text-sm text-birch">{company.name}</span>
                <span className="block truncate text-xs text-birch/48">{company.location}</span>
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
