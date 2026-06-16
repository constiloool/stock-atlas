import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AtlasRebuildPage() {
  return (
    <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071208] px-5 text-birch">
      <div className="absolute inset-0 z-0 bg-[url('/forest-mist-hero.png')] bg-cover bg-center opacity-55" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(2,7,3,0.86),rgba(2,7,3,0.48)),linear-gradient(180deg,rgba(7,18,8,0.18),rgba(2,7,3,0.86))]" />
      <div className="fog-drift absolute left-[-18%] top-[22%] z-0 h-44 w-[136%] rounded-full bg-birch/10 blur-3xl" />

      <section className="relative z-10 max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-birch/52">Stock Atlas</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-birch sm:text-6xl">Map experience is being rebuilt.</h1>
        <p className="mx-auto mt-6 max-w-md text-base leading-7 text-birch/68">
          The atlas is paused while the next map foundation is designed from scratch.
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex h-11 items-center gap-2 rounded-full border border-birch/14 bg-birch px-5 text-sm font-semibold text-charcoal shadow-xl shadow-black/25 transition hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to landing
        </Link>
      </section>
    </main>
  );
}
