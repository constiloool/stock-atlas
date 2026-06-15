export function LoadingState({ label = "Reading market data" }: { label?: string }) {
  return (
    <div className="grid gap-3">
      <p className="text-sm text-birch/55">{label}</p>
      <div className="h-52 animate-pulse rounded-[3px] border border-birch/10 bg-birch/[0.035]" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-16 animate-pulse rounded-[3px] bg-birch/[0.035]" />
        <div className="h-16 animate-pulse rounded-[3px] bg-birch/[0.035]" />
      </div>
    </div>
  );
}
