export type Company = {
  ticker: string;
  name: string;
  location: string;
  country: string;
  sector: string;
  lat: number;
  lon: number;
};

export const companies: Company[] = [
  { ticker: "AAPL", name: "Apple Inc.", location: "Cupertino, USA", country: "United States", sector: "Technology", lat: 37.3349, lon: -122.009 },
  { ticker: "TSLA", name: "Tesla Inc.", location: "Austin, USA", country: "United States", sector: "Automotive / Technology", lat: 30.2672, lon: -97.7431 },
  { ticker: "NVDA", name: "NVIDIA Corporation", location: "Santa Clara, USA", country: "United States", sector: "Semiconductors", lat: 37.3541, lon: -121.9552 },
  { ticker: "MSFT", name: "Microsoft Corporation", location: "Redmond, USA", country: "United States", sector: "Software", lat: 47.674, lon: -122.1215 },
  { ticker: "GOOGL", name: "Alphabet Inc.", location: "Mountain View, USA", country: "United States", sector: "Technology", lat: 37.3861, lon: -122.0839 },
  { ticker: "AMZN", name: "Amazon.com Inc.", location: "Seattle, USA", country: "United States", sector: "Consumer / Cloud", lat: 47.6062, lon: -122.3321 },
  { ticker: "SAP.DE", name: "SAP SE", location: "Walldorf, Germany", country: "Germany", sector: "Software", lat: 49.2938, lon: 8.6412 },
  { ticker: "LVMH.PA", name: "LVMH Moet Hennessy Louis Vuitton", location: "Paris, France", country: "France", sector: "Luxury Goods", lat: 48.8566, lon: 2.3522 },
  { ticker: "7203.T", name: "Toyota Motor Corporation", location: "Toyota, Japan", country: "Japan", sector: "Automotive", lat: 35.0824, lon: 137.1563 },
  { ticker: "ASML.AS", name: "ASML Holding N.V.", location: "Veldhoven, Netherlands", country: "Netherlands", sector: "Semiconductor Equipment", lat: 51.4183, lon: 5.4027 }
];

export function findCompany(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;
  return (
    companies.find((company) => company.ticker.toLowerCase() === normalized) ??
    companies.find((company) => company.name.toLowerCase().includes(normalized)) ??
    companies.find((company) => company.ticker.toLowerCase().includes(normalized))
  );
}

export function companyByTicker(ticker: string) {
  return companies.find((company) => company.ticker === ticker) ?? null;
}
