import { cityLights } from "./cityLights";
import { projectPoint } from "./WorldMapLayer";

export function CityLightsLayer() {
  return (
    <g className="living-city-layer">
      {cityLights.map((light) => {
        const point = projectPoint(light.lat, light.lon);
        const glowRadius = 4.5 + light.intensity * 8;
        const coreRadius = 0.8 + light.intensity * 1.15;

        return (
          <g
            key={light.id}
            className={`living-city-light living-city-light-${light.cluster}`}
            style={{ "--city-intensity": light.intensity } as React.CSSProperties}
            opacity={0.44 + light.intensity * 0.48}
          >
            <circle cx={point.x} cy={point.y} r={glowRadius} fill="url(#livingCityGlow)" />
            <circle cx={point.x} cy={point.y} r={coreRadius} fill="#fff4c8" opacity="0.92" />
            <circle cx={point.x + 3.6} cy={point.y + 1.8} r={coreRadius * 0.46} fill="#f4e7b2" opacity="0.58" />
            <circle cx={point.x - 3.1} cy={point.y - 2.4} r={coreRadius * 0.36} fill="#ece8e0" opacity="0.42" />
          </g>
        );
      })}
    </g>
  );
}
