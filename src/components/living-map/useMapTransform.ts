"use client";

import { PointerEvent, RefObject, WheelEvent, useEffect, useRef, useState } from "react";

export type MapView = {
  x: number;
  y: number;
  zoom: number;
};

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 620;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5.6;
const DEFAULT_VIEW: MapView = { x: 0, y: 0, zoom: 1 };

function clampView(view: MapView): MapView {
  const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.zoom));
  const width = MAP_WIDTH * zoom;
  const height = MAP_HEIGHT * zoom;
  const x = width <= MAP_WIDTH ? (MAP_WIDTH - width) / 2 : Math.min(0, Math.max(MAP_WIDTH - width, view.x));
  const y = height <= MAP_HEIGHT ? (MAP_HEIGHT - height) / 2 : Math.min(0, Math.max(MAP_HEIGHT - height, view.y));
  return { x, y, zoom };
}

export function useMapTransform(mapRef: RefObject<SVGGElement | null>, surfaceRef: RefObject<HTMLElement | null>) {
  const viewRef = useRef<MapView>(DEFAULT_VIEW);
  const dragRef = useRef<{ id: number; x: number; y: number; view: MapView } | null>(null);
  const rafRef = useRef<number | null>(null);
  const [view, setView] = useState(DEFAULT_VIEW);
  const [dragging, setDragging] = useState(false);

  function applyView(nextView: MapView, commit = false) {
    const clamped = clampView(nextView);
    viewRef.current = clamped;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      mapRef.current?.setAttribute("transform", `translate(${clamped.x} ${clamped.y}) scale(${clamped.zoom})`);
      rafRef.current = null;
    });

    if (commit) setView(clamped);
  }

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

  function reset() {
    applyView(DEFAULT_VIEW, true);
  }

  function handleWheel(event: WheelEvent<HTMLElement>) {
    event.preventDefault();
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * MAP_WIDTH;
    const y = ((event.clientY - rect.top) / rect.height) * MAP_HEIGHT;
    zoomAt(viewRef.current.zoom * (event.deltaY > 0 ? 0.9 : 1.12), x, y);
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, view: viewRef.current };
    setDragging(true);
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    const rect = surfaceRef.current?.getBoundingClientRect();
    if (!rect) return;
    applyView({
      zoom: drag.view.zoom,
      x: drag.view.x + (event.clientX - drag.x) * (MAP_WIDTH / rect.width),
      y: drag.view.y + (event.clientY - drag.y) * (MAP_HEIGHT / rect.height)
    });
  }

  function endDrag(event: PointerEvent<HTMLElement>) {
    if (dragRef.current?.id !== event.pointerId) return;
    dragRef.current = null;
    setDragging(false);
    setView(viewRef.current);
  }

  useEffect(() => {
    viewRef.current = DEFAULT_VIEW;
    mapRef.current?.setAttribute("transform", `translate(${DEFAULT_VIEW.x} ${DEFAULT_VIEW.y}) scale(${DEFAULT_VIEW.zoom})`);
    setView(DEFAULT_VIEW);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mapRef]);

  return {
    view,
    dragging,
    handlePointerDown,
    handlePointerMove,
    handleWheel,
    endDrag,
    zoomIn: () => zoomAt(viewRef.current.zoom * 1.18),
    zoomOut: () => zoomAt(viewRef.current.zoom * 0.84),
    reset
  };
}
