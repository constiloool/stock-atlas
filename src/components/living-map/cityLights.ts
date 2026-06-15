export type CityLight = {
  id: string;
  lat: number;
  lon: number;
  intensity: number;
  cluster: number;
};

export const cityLights: CityLight[] = [
  { id: "new-york", lat: 40.7, lon: -74, intensity: 1, cluster: 1 },
  { id: "boston", lat: 42.36, lon: -71.05, intensity: 0.64, cluster: 1 },
  { id: "washington", lat: 38.9, lon: -77.03, intensity: 0.74, cluster: 1 },
  { id: "chicago", lat: 41.88, lon: -87.63, intensity: 0.78, cluster: 2 },
  { id: "los-angeles", lat: 34.05, lon: -118.24, intensity: 0.92, cluster: 2 },
  { id: "bay-area", lat: 37.77, lon: -122.42, intensity: 0.8, cluster: 1 },
  { id: "seattle", lat: 47.61, lon: -122.33, intensity: 0.56, cluster: 3 },
  { id: "mexico-city", lat: 19.43, lon: -99.13, intensity: 0.74, cluster: 2 },
  { id: "sao-paulo", lat: -23.55, lon: -46.63, intensity: 0.86, cluster: 1 },
  { id: "buenos-aires", lat: -34.6, lon: -58.38, intensity: 0.58, cluster: 3 },
  { id: "london", lat: 51.5, lon: -0.12, intensity: 0.9, cluster: 1 },
  { id: "paris", lat: 48.85, lon: 2.35, intensity: 0.92, cluster: 2 },
  { id: "benelux", lat: 51.2, lon: 4.4, intensity: 0.82, cluster: 1 },
  { id: "rhein-ruhr", lat: 51.43, lon: 7.66, intensity: 0.9, cluster: 3 },
  { id: "milan", lat: 45.46, lon: 9.19, intensity: 0.76, cluster: 2 },
  { id: "madrid", lat: 40.42, lon: -3.7, intensity: 0.58, cluster: 3 },
  { id: "istanbul", lat: 41.01, lon: 28.97, intensity: 0.7, cluster: 1 },
  { id: "cairo", lat: 30.04, lon: 31.24, intensity: 0.72, cluster: 2 },
  { id: "lagos", lat: 6.52, lon: 3.37, intensity: 0.52, cluster: 3 },
  { id: "johannesburg", lat: -26.2, lon: 28.04, intensity: 0.58, cluster: 1 },
  { id: "dubai", lat: 25.2, lon: 55.27, intensity: 0.74, cluster: 1 },
  { id: "riyadh", lat: 24.71, lon: 46.67, intensity: 0.5, cluster: 2 },
  { id: "mumbai", lat: 19.07, lon: 72.87, intensity: 0.86, cluster: 2 },
  { id: "delhi", lat: 28.61, lon: 77.2, intensity: 0.92, cluster: 1 },
  { id: "bangalore", lat: 12.97, lon: 77.59, intensity: 0.64, cluster: 3 },
  { id: "singapore", lat: 1.35, lon: 103.82, intensity: 0.74, cluster: 2 },
  { id: "bangkok", lat: 13.76, lon: 100.5, intensity: 0.56, cluster: 1 },
  { id: "jakarta", lat: -6.2, lon: 106.84, intensity: 0.62, cluster: 3 },
  { id: "shanghai", lat: 31.23, lon: 121.47, intensity: 1, cluster: 1 },
  { id: "pearl-river", lat: 22.54, lon: 114.06, intensity: 0.94, cluster: 2 },
  { id: "beijing", lat: 39.9, lon: 116.4, intensity: 0.82, cluster: 3 },
  { id: "seoul", lat: 37.56, lon: 126.98, intensity: 0.78, cluster: 2 },
  { id: "tokyo", lat: 35.68, lon: 139.76, intensity: 1, cluster: 1 },
  { id: "osaka", lat: 34.69, lon: 135.5, intensity: 0.66, cluster: 3 },
  { id: "sydney", lat: -33.87, lon: 151.21, intensity: 0.68, cluster: 1 },
  { id: "melbourne", lat: -37.81, lon: 144.96, intensity: 0.58, cluster: 2 },
  { id: "auckland", lat: -36.85, lon: 174.76, intensity: 0.34, cluster: 3 }
];
