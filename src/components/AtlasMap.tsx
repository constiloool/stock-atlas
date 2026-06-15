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
type CityLight = {
  id: string;
  lat: number;
  lon: number;
  intensity: number;
};

const cityLights: CityLight[] = [
  { id: "new-york", lat: 40.7, lon: -74, intensity: 1 },
  { id: "boston", lat: 42.36, lon: -71.05, intensity: 0.62 },
  { id: "washington", lat: 38.9, lon: -77.03, intensity: 0.72 },
  { id: "chicago", lat: 41.88, lon: -87.63, intensity: 0.8 },
  { id: "texas", lat: 29.76, lon: -95.37, intensity: 0.72 },
  { id: "mexico-city", lat: 19.43, lon: -99.13, intensity: 0.74 },
  { id: "los-angeles", lat: 34.05, lon: -118.24, intensity: 0.92 },
  { id: "bay-area", lat: 37.77, lon: -122.42, intensity: 0.78 },
  { id: "seattle", lat: 47.61, lon: -122.33, intensity: 0.56 },
  { id: "toronto", lat: 43.65, lon: -79.38, intensity: 0.68 },
  { id: "sao-paulo", lat: -23.55, lon: -46.63, intensity: 0.86 },
  { id: "buenos-aires", lat: -34.6, lon: -58.38, intensity: 0.58 },
  { id: "santiago", lat: -33.45, lon: -70.66, intensity: 0.48 },
  { id: "london", lat: 51.5, lon: -0.12, intensity: 0.9 },
  { id: "paris", lat: 48.85, lon: 2.35, intensity: 0.92 },
  { id: "benelux", lat: 51.2, lon: 4.4, intensity: 0.82 },
  { id: "rhein-ruhr", lat: 51.43, lon: 7.66, intensity: 0.9 },
  { id: "milan", lat: 45.46, lon: 9.19, intensity: 0.76 },
  { id: "madrid", lat: 40.42, lon: -3.7, intensity: 0.58 },
  { id: "istanbul", lat: 41.01, lon: 28.97, intensity: 0.7 },
  { id: "moscow", lat: 55.75, lon: 37.62, intensity: 0.62 },
  { id: "cairo", lat: 30.04, lon: 31.24, intensity: 0.72 },
  { id: "lagos", lat: 6.52, lon: 3.37, intensity: 0.52 },
  { id: "johannesburg", lat: -26.2, lon: 28.04, intensity: 0.58 },
  { id: "dubai", lat: 25.2, lon: 55.27, intensity: 0.72 },
  { id: "riyadh", lat: 24.71, lon: 46.67, intensity: 0.52 },
  { id: "mumbai", lat: 19.07, lon: 72.87, intensity: 0.86 },
  { id: "delhi", lat: 28.61, lon: 77.2, intensity: 0.92 },
  { id: "bangalore", lat: 12.97, lon: 77.59, intensity: 0.64 },
  { id: "singapore", lat: 1.35, lon: 103.82, intensity: 0.74 },
  { id: "bangkok", lat: 13.76, lon: 100.5, intensity: 0.56 },
  { id: "jakarta", lat: -6.2, lon: 106.84, intensity: 0.62 },
  { id: "shanghai", lat: 31.23, lon: 121.47, intensity: 1 },
  { id: "pearl-river", lat: 22.54, lon: 114.06, intensity: 0.94 },
  { id: "beijing", lat: 39.9, lon: 116.4, intensity: 0.82 },
  { id: "seoul", lat: 37.56, lon: 126.98, intensity: 0.78 },
  { id: "tokyo", lat: 35.68, lon: 139.76, intensity: 1 },
  { id: "osaka", lat: 34.69, lon: 135.5, intensity: 0.66 },
  { id: "taipei", lat: 25.03, lon: 121.56, intensity: 0.56 },
  { id: "sydney", lat: -33.87, lon: 151.21, intensity: 0.68 },
  { id: "melbourne", lat: -37.81, lon: 144.96, intensity: 0.58 },
  { id: "auckland", lat: -36.85, lon: 174.76, intensity: 0.34 }
];

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
          ? "h-full min-h-[520px] w-full cursor-grab bg-[radial-gradient(circle_at_58%_16%,rgba(236,232,224,0.15),transparent_24%),radial-gradient(circle_at_48%_48%,rgba(111,143,99,0.18),transparent_54%),linear-gradient(180deg,#152217_0%,#0b170e_48%,#050d07_100%)]"
          : "min-h-[460px] rounded-[4px] border border-birch/12 bg-[radial-gradient(circle_at_50%_45%,rgba(60,74,51,0.42),transparent_48%),linear-gradient(180deg,rgba(7,18,8,0.92),rgba(2,7,3,0.96))] p-4 sm:p-6"
      } ${dragging ? "cursor-grabbing" : ""}`}
    >
      {fullscreen ? (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_54%_18%,rgba(236,232,224,0.18),transparent_28%),radial-gradient(circle_at_78%_55%,rgba(190,220,170,0.08),transparent_34%),linear-gradient(180deg,rgba(236,232,224,0.07),transparent_24%,rgba(4,10,5,0.24))]" />
          <div className="forest-texture pointer-events-none absolute inset-0 opacity-70" />
          <div className="fog-drift pointer-events-none absolute left-[-18%] top-[9%] h-44 w-[130%] rounded-full bg-birch/14 blur-3xl" />
          <div className="fog-drift pointer-events-none absolute left-[-12%] top-[31%] h-32 w-[112%] rounded-full bg-[#bedcaa]/10 blur-3xl [animation-delay:1.8s]" />
          <div className="fog-drift pointer-events-none absolute left-[-20%] top-[68%] h-40 w-[135%] rounded-full bg-birch/9 blur-3xl [animation-delay:3.4s]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(2,7,3,0.52)_100%)]" />
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
          <radialGradient id="cityGlow">
            <stop offset="0%" stopColor="#fff4bd" stopOpacity="0.95" />
            <stop offset="52%" stopColor="#d8c977" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#d8c977" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="landShade" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#6f8062" stopOpacity="0.78" />
            <stop offset="48%" stopColor="#2f4c35" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#142719" stopOpacity="0.88" />
          </linearGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="cityBloom">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern id="landGrain" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="1.8" cy="2.1" r="0.8" fill="#ECE8E0" opacity="0.13" />
            <circle cx="7.2" cy="6.6" r="0.95" fill="#6F8F63" opacity="0.16" />
            <path d="M0 9 L10 2" stroke="#bedcaa" strokeOpacity="0.035" strokeWidth="0.7" />
          </pattern>
          <pattern id="citySpecks" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="7" r="0.55" fill="#fff4bd" opacity="0.22" />
            <circle cx="18" cy="13" r="0.42" fill="#d8c977" opacity="0.18" />
            <circle cx="11" cy="22" r="0.35" fill="#fff4bd" opacity="0.13" />
          </pattern>
        </defs>

        <g ref={mapGroupRef} transform={`translate(${view.x} ${view.y}) scale(${view.zoom})`} className={dragging ? "" : "transition-transform duration-200 ease-out"}>
          <path d={landPath} fill="#132519" opacity="0.82" />
          <path d={landPath} fill="url(#landShade)" opacity="0.86" />
          <path d={landPath} fill="url(#landGrain)" opacity="0.9" />
          <path d={landPath} fill="url(#citySpecks)" opacity="0.46" />
          <path d={landPath} fill="none" stroke="#f4edcb" strokeOpacity="0.26" strokeWidth="0.9" />
          <path d={landPath} fill="none" stroke="#8fb27a" strokeOpacity="0.17" strokeWidth="2.1" />
          <path d={countryMeshPath} fill="none" stroke="#e5dca8" strokeOpacity="0.09" strokeWidth="0.48" />
          <g filter="url(#cityBloom)">
            {cityLights.map((light) => {
              const position = projectLatLon(light.lat, light.lon);
              return (
                <g key={light.id} opacity={0.45 + light.intensity * 0.5}>
                  <circle cx={position.x} cy={position.y} r={5 + light.intensity * 7} fill="url(#cityGlow)" opacity={0.72} />
                  <circle cx={position.x} cy={position.y} r={0.9 + light.intensity * 1.2} fill="#fff7c9" opacity={0.95} />
                  <circle cx={position.x + 3.5} cy={position.y + 1.7} r={0.45 + light.intensity * 0.5} fill="#fff7c9" opacity={0.62} />
                  <circle cx={position.x - 3.2} cy={position.y - 2.1} r={0.35 + light.intensity * 0.5} fill="#d8c977" opacity={0.46} />
                </g>
              );
            })}
          </g>
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
          className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-birch/16 bg-[#102016]/42 p-2 shadow-2xl shadow-black/20 backdrop-blur-xl sm:right-6"
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
