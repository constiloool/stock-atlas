"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PointerEvent, useRef } from "react";
import { CityLightsLayer } from "./CityLightsLayer";
import { FogLayer } from "./FogLayer";
import { InteractionLight } from "./InteractionLight";
import { MapControls } from "./MapControls";
import { MAP_HEIGHT, MAP_WIDTH, MapDefs, WorldMapLayer } from "./WorldMapLayer";
import { useMapTransform } from "./useMapTransform";

export function LivingMistMap() {
  const surfaceRef = useRef<HTMLElement | null>(null);
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const mouseRafRef = useRef<number | null>(null);
  const transform = useMapTransform(mapGroupRef, surfaceRef);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    transform.handlePointerMove(event);
    const surface = surfaceRef.current;
    if (!surface || mouseRafRef.current) return;

    mouseRafRef.current = requestAnimationFrame(() => {
      const rect = surface.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const px = (x - 50) / 50;
      const py = (y - 50) / 50;
      surface.style.setProperty("--mouse-x", `${x}%`);
      surface.style.setProperty("--mouse-y", `${y}%`);
      surface.style.setProperty("--parallax-x", `${px * 1.3}%`);
      surface.style.setProperty("--parallax-y", `${py * 1.1}%`);
      mouseRafRef.current = null;
    });
  }

  return (
    <section
      ref={surfaceRef}
      className={`living-map-surface relative h-screen min-h-[560px] overflow-hidden text-birch ${transform.dragging ? "cursor-grabbing" : "cursor-grab"}`}
      onWheel={transform.handleWheel}
      onPointerDown={transform.handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={transform.endDrag}
      onPointerCancel={transform.endDrag}
    >
      <div className="living-atmosphere" />
      <div className="living-depth" />

      <svg className="absolute inset-0 z-10 h-full w-full overflow-visible will-change-transform" viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} aria-label="Living Mist World Map">
        <MapDefs />
        <g ref={mapGroupRef} transform={`translate(${transform.view.x} ${transform.view.y}) scale(${transform.view.zoom})`} className={transform.dragging ? "" : "transition-transform duration-200 ease-out"}>
          <WorldMapLayer />
          <CityLightsLayer />
        </g>
      </svg>

      <FogLayer />
      <InteractionLight />

      <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex items-start justify-between gap-3 p-4 sm:p-6">
        <div className="pointer-events-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-birch/14 bg-[#102016]/38 text-birch/72 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:bg-birch/10 hover:text-birch"
            aria-label="Back home"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="rounded-full border border-birch/12 bg-[#102016]/32 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-birch/74 shadow-2xl shadow-black/15 backdrop-blur-xl">
            Stock Atlas
          </div>
        </div>
      </header>

      <div onPointerDown={(event) => event.stopPropagation()}>
        <MapControls onZoomIn={transform.zoomIn} onZoomOut={transform.zoomOut} onReset={transform.reset} />
      </div>

      <p className="pointer-events-none absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full border border-birch/10 bg-[#102016]/26 px-4 py-2 text-center text-[10px] uppercase tracking-[0.18em] text-birch/48 shadow-2xl shadow-black/15 backdrop-blur-xl">
        Drag to explore · Scroll to zoom
      </p>
    </section>
  );
}
