import type { AgentScore } from "@/lib/agentTypes";

export function AgentScoreCard({ agent }: { agent: AgentScore }) {
  return (
    <article className="rounded-[3px] border border-birch/10 bg-birch/[0.035] p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="break-words text-sm font-semibold text-birch">{agent.name}</h4>
          <p className="mt-1 text-xs leading-5 text-birch/50">Focus: {agent.style}</p>
        </div>
        <span className="rounded-full border border-glow/20 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-glow">Placeholder</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <span className="font-mono text-xl text-birch">{agent.score}</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-charcoal">
          <div className="h-full rounded-full bg-glow" style={{ width: `${agent.score}%` }} />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-birch/50">{agent.summary}</p>
    </article>
  );
}
