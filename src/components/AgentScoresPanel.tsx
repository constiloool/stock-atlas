import type { AgentScore } from "@/lib/agentTypes";
import { AgentScoreCard } from "./AgentScoreCard";

export function AgentScoresPanel({ agents }: { agents: AgentScore[] }) {
  return (
    <section className="rounded-[3px] border border-birch/12 bg-charcoal/58 p-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-glow">AI Investor Scores</p>
          <h3 className="mt-1 text-lg font-semibold text-birch">Agent Placeholders</h3>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {agents.map((agent) => (
          <AgentScoreCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  );
}
