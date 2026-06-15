"use client";

import { CandlestickSeries, createChart, type IChartApi } from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { Candle } from "@/types/stock";

export function CandlestickChart({ candles }: { candles: Candle[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !candles.length) return;

    const chart = createChart(container, {
      autoSize: true,
      height: 300,
      layout: { background: { color: "transparent" }, textColor: "rgba(236,232,224,0.58)" },
      grid: {
        vertLines: { color: "rgba(236,232,224,0.055)" },
        horzLines: { color: "rgba(236,232,224,0.055)" }
      },
      rightPriceScale: { borderColor: "rgba(236,232,224,0.12)" },
      timeScale: { borderColor: "rgba(236,232,224,0.12)" }
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#65D46E",
      downColor: "#C96F62",
      borderUpColor: "#65D46E",
      borderDownColor: "#C96F62",
      wickUpColor: "#9EDFA4",
      wickDownColor: "#D99A91"
    });

    series.setData(candles.map(({ time, open, high, low, close }) => ({ time, open, high, low, close })));
    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      chart.remove();
      chartRef.current = null;
    };
  }, [candles]);

  if (!candles.length) {
    return <div className="flex h-[300px] items-center justify-center text-sm text-birch/50">No candle data available.</div>;
  }

  return <div ref={containerRef} className="h-[300px] w-full min-w-0" />;
}
