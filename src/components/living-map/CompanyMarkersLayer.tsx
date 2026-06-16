import type { Company } from "@/lib/companies";
import { projectPoint } from "./WorldMapLayer";

export function CompanyMarkersLayer({
  companies,
  activeTicker,
  onHover,
  onLeave,
  onOpen
}: {
  companies: Company[];
  activeTicker: string | null;
  onHover: (company: Company) => void;
  onLeave: () => void;
  onOpen: (company: Company) => void;
}) {
  const orderedCompanies = activeTicker
    ? [...companies].sort((a, b) => {
        if (a.ticker === activeTicker) return 1;
        if (b.ticker === activeTicker) return -1;
        return 0;
      })
    : companies;

  return (
    <g>
      {orderedCompanies.map((company) => {
        const point = projectPoint(company.lat, company.lon);
        const active = activeTicker === company.ticker;

        return (
          <g
            key={company.ticker}
            role="button"
            tabIndex={0}
            aria-label={`${company.ticker} ${company.name}`}
            className="atlas-company-marker cursor-pointer outline-none"
            onMouseEnter={() => onHover(company)}
            onMouseLeave={onLeave}
            onFocus={() => onHover(company)}
            onBlur={onLeave}
            onClick={() => onOpen(company)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") onOpen(company);
            }}
          >
            <circle cx={point.x} cy={point.y} r={active ? 18 : 11} fill="#65D46E" opacity={active ? 0.18 : 0.08} />
            <circle cx={point.x} cy={point.y} r={active ? 5.2 : 3.5} fill={active ? "#9ee889" : "#ECE8E0"} opacity={active ? 0.98 : 0.68} />
            <circle cx={point.x} cy={point.y} r={active ? 9 : 6} fill="none" stroke={active ? "#9ee889" : "#f4e7b2"} strokeOpacity={active ? 0.62 : 0.22} strokeWidth="0.55" />
          </g>
        );
      })}
    </g>
  );
}
