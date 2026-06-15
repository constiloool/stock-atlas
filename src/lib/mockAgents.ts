import type { AgentScore } from "./agentTypes";

const templates: Omit<AgentScore, "score" | "factors">[] = [
  {
    id: "value",
    name: "Buffett-inspired Value Agent",
    style: "Value, moat, cashflow, debt",
    summary: "Placeholder analysis for valuation discipline, durable advantage and balance sheet strength.",
    status: "placeholder"
  },
  {
    id: "growth",
    name: "Lynch-inspired Growth Agent",
    style: "Growth, earnings quality, story",
    summary: "Placeholder analysis for understandable growth, margin quality and long-term compounding.",
    status: "placeholder"
  },
  {
    id: "risk",
    name: "Burry-inspired Risk Agent",
    style: "Downside, leverage, crowding",
    summary: "Placeholder analysis for fragile assumptions, liquidity pressure and hidden downside.",
    status: "placeholder"
  },
  {
    id: "macro",
    name: "Dalio-inspired Macro Agent",
    style: "Rates, cycles, currencies, regimes",
    summary: "Placeholder analysis for macro regime fit, diversification and cycle exposure.",
    status: "placeholder"
  },
  {
    id: "disruption",
    name: "Wood-inspired Disruption Agent",
    style: "Innovation, adoption, TAM",
    summary: "Placeholder analysis for disruptive potential, adoption curves and category expansion.",
    status: "placeholder"
  }
];

export function getMockAgentScores(ticker: string): AgentScore[] {
  const seed = ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return templates.map((agent, index) => {
    const score = 44 + ((seed * (index + 5)) % 47);
    return {
      ...agent,
      score,
      factors: [
        { label: "Quality", value: Math.min(96, score + 6) },
        { label: "Valuation", value: Math.max(20, score - 9 + index * 3) },
        { label: "Resilience", value: Math.max(18, Math.min(94, score + ((seed + index) % 15) - 7)) }
      ]
    };
  });
}
