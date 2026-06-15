import type { Fundamentals } from "@/types/stock";
import { formatCompact, formatNumber, formatPercent } from "@/lib/formatters";

export function FundamentalsPanel({ fundamentals }: { fundamentals: Fundamentals }) {
  const rows = [
    ["Market Cap", formatCompact(fundamentals.marketCap)],
    ["P/E Ratio", formatNumber(fundamentals.peRatio)],
    ["EPS", formatNumber(fundamentals.eps)],
    ["Revenue Growth", formatPercent(fundamentals.revenueGrowth)],
    ["Dividend Yield", formatPercent(fundamentals.dividendYield)],
    ["Debt / Equity", formatNumber(fundamentals.debtToEquity)]
  ];

  return (
    <section className="rounded-[3px] border border-birch/12 bg-charcoal/58 p-4">
      <h3 className="text-lg font-semibold text-birch">Fundamentals</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-[3px] border border-birch/10 bg-birch/[0.03] p-3">
            <p className="text-xs text-birch/45">{label}</p>
            <p className="mt-1 break-words text-sm font-medium text-birch">{value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
