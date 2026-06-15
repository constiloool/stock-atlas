import { Minus, Plus, RotateCcw } from "lucide-react";

export function MapControls({ onZoomIn, onZoomOut, onReset }: { onZoomIn: () => void; onZoomOut: () => void; onReset: () => void }) {
  return (
    <div className="absolute right-4 top-1/2 z-30 flex -translate-y-1/2 flex-col items-center gap-1 rounded-full border border-birch/16 bg-[#102016]/38 p-2 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:right-6">
      <button type="button" className="rounded-full p-2 text-birch/72 transition hover:bg-birch/12 hover:text-birch" onClick={onZoomIn} aria-label="Zoom in">
        <Plus className="h-4 w-4" />
      </button>
      <button type="button" className="rounded-full p-2 text-birch/72 transition hover:bg-birch/12 hover:text-birch" onClick={onZoomOut} aria-label="Zoom out">
        <Minus className="h-4 w-4" />
      </button>
      <button type="button" className="rounded-full p-2 text-birch/72 transition hover:bg-birch/12 hover:text-birch" onClick={onReset} aria-label="Reset map">
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}
