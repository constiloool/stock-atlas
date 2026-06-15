import { geoEquirectangular, geoPath, type GeoPermissibleObjects } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { GeometryObject, Topology } from "topojson-specification";
import landTopo from "world-atlas/land-50m.json";
import countriesTopo from "world-atlas/countries-50m.json";

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 620;

export const projection = geoEquirectangular()
  .scale(MAP_WIDTH / (2 * Math.PI))
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2 + 10])
  .precision(0.12);

const path = geoPath(projection);
const landTopology = landTopo as unknown as Topology<{ land: GeometryObject }>;
const countriesTopology = countriesTopo as unknown as Topology<{ countries: GeometryObject }>;
const landFeature = feature(landTopology, landTopology.objects.land) as unknown as GeoJSON.Feature;
const countryMesh = mesh(countriesTopology, countriesTopology.objects.countries) as unknown as GeoPermissibleObjects;
const landPath = path(landFeature as GeoPermissibleObjects) ?? "";
const countryPath = path(countryMesh) ?? "";

export function projectPoint(lat: number, lon: number) {
  const point = projection([lon, lat]);
  return { x: point?.[0] ?? MAP_WIDTH / 2, y: point?.[1] ?? MAP_HEIGHT / 2 };
}

export function MapDefs() {
  return (
    <defs>
      <linearGradient id="livingLand" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#7d9071" stopOpacity="0.62" />
        <stop offset="44%" stopColor="#2e4c34" stopOpacity="0.76" />
        <stop offset="100%" stopColor="#112217" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="livingCityGlow">
        <stop offset="0%" stopColor="#fff3c4" stopOpacity="0.95" />
        <stop offset="46%" stopColor="#f4e7b2" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#f4e7b2" stopOpacity="0" />
      </radialGradient>
      <pattern id="livingTerrain" width="15" height="15" patternUnits="userSpaceOnUse">
        <circle cx="3" cy="4" r="0.7" fill="#ece8e0" opacity="0.09" />
        <circle cx="11" cy="10" r="0.9" fill="#6f8f63" opacity="0.13" />
        <path d="M0 13 C5 7 9 7 15 2" fill="none" stroke="#bedcaa" strokeOpacity="0.035" strokeWidth="0.8" />
      </pattern>
      <filter id="softLandShadow">
        <feDropShadow dx="0" dy="5" stdDeviation="6" floodColor="#020603" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

export function WorldMapLayer() {
  return (
    <>
      <path d={landPath} fill="#0f2115" opacity="0.88" filter="url(#softLandShadow)" />
      <path d={landPath} fill="url(#livingLand)" opacity="0.84" />
      <path d={landPath} fill="url(#livingTerrain)" opacity="0.98" />
      <path d={landPath} fill="none" stroke="#f1e8c2" strokeOpacity="0.26" strokeWidth="0.82" />
      <path d={landPath} fill="none" stroke="#94b986" strokeOpacity="0.14" strokeWidth="2.4" />
      <path d={countryPath} fill="none" stroke="#efe4ba" strokeOpacity="0.075" strokeWidth="0.46" />
    </>
  );
}
