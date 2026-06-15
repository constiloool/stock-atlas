import { AlertTriangle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex gap-3 rounded-[3px] border border-red-300/20 bg-red-950/20 p-4 text-sm leading-6 text-red-100">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-200" />
      <span>{message}</span>
    </div>
  );
}
