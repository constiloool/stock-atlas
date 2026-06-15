"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { PointerEvent, WheelEvent, useEffect, useRef, useState } from "react";
import { geoEquirectangular, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import landTopo from "world-atlas/land-50m.json";
import countriesTopo from "world-atlas/countries-50m.json";
import { companies, type Company } from "@/lib/companies";
import { CompanyMarker } from "./CompanyMarker";

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 620;
const MIN_ZOOM = 0.9;
const MAX_ZOOM = 6;
const DEFAULT_VIEW = { x: 60, y: 31, zoom: 0.9 };

type View = typeof DEFAULT_VIEW;

const projection = geoEquirectangular()
  .scale(MAP_WIDTH / (2 * Math.PI))
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2 + 8])
  .precision(0.1);

const path = geoPath(projection);
const landTopology = landTopo as unknown as Topology<{ land: GeometryObject }>;
const countriesTopology = countriesTopo as unknown as Topology<{ countries: GeometryObject }>;
const landFeature = feature(landTopology, landTopology.objects.land) as unknown as GeoJSON.Feature;
const countryMesh = mesh(countriesTopology, countriesTopology.objects.countries) as unknown as GeoPermissibleObjects;
const landPath = path(landFeature as GeoPermissibleObjects) ?? "";
const countryMeshPath = path(countryMesh) ?? "";

function clampView(view: View): View {
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.zoom));
  const scaledWidth = MAP_WIDTH * zoom;
  const scaledHeight = MAP_HEIGHT * zoom;
  const x = scaledWidth <= MAP_WIDTH ? (MAP_WIDTH - scaledWidth) / 2 : Math.min(0, Math.max(MAP_WIDTH - scaledWidth, view.x));
  const y = scaledHeight <= MAP_HEIGHT ? (MAP_HEIGHT - scaledHeight) / 2 : Math.min(0, Math.max(MAP_HEIGHT - scaledHeight, view.y));
  return { x, y, zoom };
}

function projectedPoint(lat: number, lon: number) {
  const point = projection([lon, lat]);
  return { x: point?.[0] ?? MAP_WIDTH / 2, y: point?.[1] ?? MAP_HEIGHT / 2 };
}

export function projectLatLon(lat: number, lon: number) {
  return projectedPoint(lat, lon);
}

export function AtlasMap({
  activeCompany,
  onMarkerClick,
  fullscreen = false,
  showAllMarkers = true
}: {
  activeCompany: Company | null;
  onMarkerClick: (company: Company) => void;
  fullscreen?: boolean;
  showAllMarkers?: boolean;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const dragRef = useRef<{ id: number; x: number; y: number; viewX: number; viewY: number; zoom: number } | null>(null);
  const movedRef = useRef(false);
  const viewRef = useRef<View>(DEFAULT_VIEW);
  const rafRef = useRef<number | null>(null);
  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const [dragging, setDragging] = useState(false);

  function applyView(nextView: View, commit = false) {
    const clamped = clampView(nextView);
    viewRef.current = clamped;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (mapGroupRef.current) {
        mapGroupRef.current.setAttribute("transform", `translate(${clamped.x} ${clamped.y}) scale(${clamped.zoom})`);
      }
      rafRef.current = null;
    });

    if (commit) setView(clamped);
  }

  useEffect(() => {
    applyView(DEFAULT_VIEW, true);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!activeCompany) return;
    const position = projectLatLon(activeCompany.lat, activeCompany.lon);
    const current = viewRef.current;
    const nextZoom = Math.max(current.zoom, 1.55);
    applyView({
      zoom: nextZoom,
      x: MAP_WIDTH / 2 - position.x * nextZoom,
      y: MAP_HEIGHT / 2 - position.y * nextZoom
    }, true);
  }, [activeCompany]);

  function zoomAt(nextZoom: number, centerX = MAP_WIDTH / 2, centerY = MAP_HEIGHT / 2) {
    const current = viewRef.current;
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, nextZoom));
    applyView(
      {
        zoom,
        x: centerX - ((centerX - current.x) / current.zoom) * zoom,
        y: centerY - ((centerY - current.y) / current.zoom) * zoom
      },
      true
    );
  }

  function handleWheel(event: WheelEvent<HTMLElement>) {
    event.preventDefault();
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pointerX = ((event.clientX - rect.left) / rect.width) * MAP_WIDTH;
    const pointerY = ((event.clientY - rect.top) / rect.height) * MAP_HEIGHT;
    zoomAt(viewRef.current.zoom * (event.deltaY > 0 ? 0.9 : 1.1), pointerX, pointerY);
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    movedRef.current = false;
    const current = viewRef.current;
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, viewX: current.x, viewY: current.y, zoom: current.zoom };
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) movedRef.current = true;
    applyView({
      zoom: drag.zoom,
      x: drag.viewX + dx * (MAP_WIDTH / rect.width),
      y: drag.viewY + dy * (MAP_HEIGHT / rect.height)
    });
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current?.id === event.pointerId) {
      dragRef.current = null;
      setDragging(false);
      setView(viewRef.current);
    }
  }

  function openMarker(company: Company) {
    if (movedRef.current) return;
    onMarkerClick(company);
  }

  return (
    <section
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={`relative touch-none select-none overflow-hidden ${
        fullscreen
          ? "h-full min-h-[520px] w-full cursor-grab bg-[radial-gradient(circle_at_50%_42%,rgba(111,143,99,0.18),transparent_56%),linear-gradient(180deg,#102016_0%,#122719_54%,#0a140d_100%)]"
          : "min-h-[460px] rounded-[4px] border border-birch/12 bg-[radial-gradient(circle_at_50%_45%,rgba(60,74,51,0.42),transparent_48%),linear-gradient(180deg,rgba(7,18,8,0.92),rgba(2,7,3,0.96))] p-4 sm:p-6"
      } ${dragging ? "cursor-grabbing" : ""}`}
    >
      {fullscreen ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_48%_26%,rgba(190,220,170,0.16),transparent_36%),radial-gradient(circle_at_72%_62%,rgba(111,143,99,0.12),transparent_34%),linear-gradient(180deg,rgba(236,232,224,0.07),transparent_28%,rgba(9,24,13,0.16))]" />
          <div className="fog-drift pointer-events-none absolute left-[-10%] top-[18%] h-44 w-[120%] rounded-full bg-birch/10 blur-3xl" />
          <div className="fog-drift pointer-events-none absolute left-[-15%] top-[55%] h-28 w-[125%] rounded-full bg-[#bedcaa]/8 blur-2xl [animation-delay:2s]" />
        </>
      ) : null}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        className={`${fullscreen ? "absolute inset-0 h-full w-full" : "h-[360px] w-full sm:h-[520px]"} overflow-visible`}
        aria-label="Detailed geographic interactive world map"
      >
        <defs>
          <radialGradient id="markerGlow">
            <stop offset="0%" stopColor="#65D46E" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#65D46E" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="landDots" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.08" fill="#ECE8E0" opacity="0.48" />
            <circle cx="5.4" cy="5.1" r="0.72" fill="#6F8F63" opacity="0.26" />
          </pattern>
          <pattern id="landGlowDots" width="31" height="31" patternUnits="userSpaceOnUse">
            <circle cx="8" cy="7" r="1.45" fill="#BEDCAA" opacity="0.18" />
            <circle cx="24" cy="20" r="1.2" fill="#6F8F63" opacity="0.16" />
          </pattern>
        </defs>

        <g ref={mapGroupRef} transform={`translate(${view.x} ${view.y}) scale(${view.zoom})`} className={dragging ? "" : "transition-transform duration-200 ease-out"}>
          <path d={landPath} fill="#2a4a32" opacity="0.45" />
          <path d={landPath} fill="url(#landGlowDots)" opacity="0.75" />
          <path d={landPath} fill="url(#landDots)" opacity="0.58" />
          <path d={landPath} fill="none" stroke="#ece8e0" strokeOpacity="0.2" strokeWidth="0.72" />
          <path d={countryMeshPath} fill="none" stroke="#bedcaa" strokeOpacity="0.06" strokeWidth="0.5" />
          {activeCompany ? (
            <circle
              cx={projectLatLon(activeCompany.lat, activeCompany.lon).x}
              cy={projectLatLon(activeCompany.lat, activeCompany.lon).y}
              r="34"
              fill="url(#markerGlow)"
              opacity="0.56"
            />
          ) : null}
          {(showAllMarkers ? companies : activeCompany ? [activeCompany] : []).map((company) => {
            const position = projectLatLon(company.lat, company.lon);
            return (
              <CompanyMarker
                key={company.ticker}
                company={company}
                x={position.x}
                y={position.y}
                active={company.ticker === activeCompany?.ticker}
                onClick={() => openMarker(company)}
              />
            );
          })}
        </g>
      </svg>

      {fullscreen ? (
        <div
          className="absolute bottom-5 right-4 z-30 flex items-center gap-2 rounded-full border border-birch/16 bg-[#102016]/52 p-2 shadow-2xl shadow-black/15 backdrop-blur-xl sm:right-6"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="rounded-full p-2 text-birch/72 transition hover:bg-birch/12 hover:text-birch"
            onClick={() => zoomAt(viewRef.current.zoom * 1.18)}
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-full p-2 text-birch/72 transition hover:bg-birch/12 hover:text-birch"
            onClick={() => zoomAt(viewRef.current.zoom * 0.86)}
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-full px-3 py-2 text-xs font-medium text-birch/72 transition hover:bg-birch/12 hover:text-birch"
            onClick={() => applyView(DEFAULT_VIEW, true)}
            aria-label="Reset map"
          >
            <span className="inline-flex items-center gap-2">
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </span>
          </button>
        </div>
      ) : null}
    </section>
  );
}
