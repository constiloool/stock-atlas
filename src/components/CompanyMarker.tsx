import type { Company } from "@/lib/companies";

export function CompanyMarker({
  company,
  x,
  y,
  active,
  onClick
}: {
  company: Company;
  x: number;
  y: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <g role="button" tabIndex={0} onClick={onClick} className="cursor-pointer outline-none">
      <circle
        cx={x}
        cy={y}
        r={active ? 5.4 : 3.1}
        fill={active ? "#65D46E" : "#ECE8E0"}
        opacity={active ? 1 : 0.44}
      />
      <circle
        cx={x}
        cy={y}
        r={active ? 18 : 9}
        fill="none"
        stroke={active ? "#65D46E" : "#ECE8E0"}
        strokeWidth={active ? 0.36 : 0.18}
        opacity={active ? 0.62 : 0.12}
      />
      {active ? (
        <g>
          <rect x={x + 9} y={y - 28} width="105" height="34" rx="7" fill="#071208" opacity="0.9" />
          <text x={x + 18} y={y - 15} fill="#65D46E" fontSize="10" fontWeight="700">
            {company.ticker}
          </text>
          <text x={x + 18} y={y - 4} fill="#ECE8E0" fontSize="7.5" opacity="0.76">
            {company.location}
          </text>
        </g>
      ) : null}
      {!active ? (
        <g className="opacity-0 transition-opacity hover:opacity-100">
          <rect x={x + 8} y={y - 24} width="84" height="25" rx="6" fill="#071208" opacity="0.9" />
          <text x={x + 17} y={y - 9} fill="#ECE8E0" fontSize="9" fontWeight="700">
            {company.ticker}
          </text>
        </g>
      ) : null}
    </g>
  );
}
