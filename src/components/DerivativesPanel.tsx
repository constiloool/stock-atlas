const derivatives = ["Call Optionsschein", "Put Optionsschein", "Knock-Out Long", "Knock-Out Short", "Faktor-Zertifikat"];

export function DerivativesPanel() {
  return (
    <section className="rounded-[3px] border border-birch/12 bg-charcoal/58 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-glow">Coming soon</p>
          <h3 className="mt-1 text-lg font-semibold text-birch">Derivatives</h3>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {derivatives.map((name) => (
          <article key={name} className="rounded-[3px] border border-birch/10 bg-birch/[0.03] p-3">
            <h4 className="break-words text-sm font-semibold text-birch">{name}</h4>
            <dl className="mt-3 grid gap-2 text-xs">
              {[
                ["Hebel", "—"],
                ["Strike", "—"],
                ["Knock-Out-Level", "—"],
                ["Laufzeit", "—"],
                ["Spread", "—"],
                ["Risk Agent", "Coming soon"]
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3 border-t border-birch/8 pt-2">
                  <dt className="text-birch/42">{label}</dt>
                  <dd className="text-right text-birch/75">{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
