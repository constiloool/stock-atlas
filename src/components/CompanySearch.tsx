"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { companies, findCompany, type Company } from "@/lib/companies";

export function CompanySearch({
  activeTicker,
  onSelect,
  onUnknown,
  compact = false
}: {
  activeTicker: string;
  onSelect: (company: Company) => void;
  onUnknown: (ticker: string) => void;
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [resultList, setResultList] = useState<Company[]>([]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    setSubmitted(true);
    setMessage(null);
    if (!trimmed) {
      setResultList([]);
      setMessage("Enter a ticker or company name.");
      return;
    }

    const exact = findCompany(trimmed);
    const matches = companies.filter(
      (company) =>
        company.ticker.toLowerCase().includes(trimmed.toLowerCase()) ||
        company.name.toLowerCase().includes(trimmed.toLowerCase())
    );

    if (exact && matches.length <= 1) {
      setResultList([]);
      onSelect(exact);
      return;
    }

    if (matches.length === 1) {
      setResultList([]);
      onSelect(matches[0]);
      return;
    }

    if (matches.length > 1) {
      setResultList(matches.slice(0, 5));
      setMessage("Select a match to illuminate its location.");
      return;
    }

    setResultList([]);
    setMessage("No atlas location found. Loading market data only.");
    onUnknown(trimmed.toUpperCase());
  }

  return (
    <div className={`${compact ? "w-full sm:w-[420px]" : ""} rounded-[18px] border border-birch/16 bg-[#102016]/54 p-3 shadow-2xl shadow-black/15 backdrop-blur-xl`}>
      <form onSubmit={submit} className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search company or ticker</span>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-birch/40" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search company or ticker..."
            className="h-11 w-full rounded-full border border-birch/14 bg-[#102016]/62 pl-9 pr-4 text-sm text-birch outline-none transition placeholder:text-birch/42 focus:border-[#bedcaa]/60 focus:ring-2 focus:ring-[#bedcaa]/10"
          />
        </label>
        <button className="h-11 rounded-full bg-birch/92 px-4 text-sm font-semibold text-charcoal transition hover:bg-white" type="submit">
          Search
        </button>
      </form>

      {message ? <p className="mt-3 px-2 text-xs leading-5 text-birch/56">{message}</p> : null}

      {submitted && resultList.length > 0 ? (
        <div className={`${compact ? "max-h-56 overflow-auto" : ""} mt-3 grid gap-2`}>
          {resultList.map((company) => {
          const active = company.ticker === activeTicker;
          return (
            <button
              key={company.ticker}
              onClick={() => {
                setResultList([]);
                setMessage(null);
                onSelect(company);
              }}
              className={`grid grid-cols-[72px_1fr] gap-3 rounded-[3px] border px-3 py-3 text-left transition ${
                active ? "border-glow/40 bg-glow/10" : "border-birch/10 bg-birch/[0.03] hover:border-birch/22"
              }`}
            >
              <span className="font-mono text-xs text-glow">{company.ticker}</span>
              <span className="min-w-0">
                <span className="block break-words text-sm text-birch">{company.name}</span>
                <span className="mt-1 block break-words text-xs text-birch/48">{company.location}</span>
              </span>
            </button>
          );
          })}
        </div>
      ) : null}
    </div>
  );
}
