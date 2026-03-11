"use client";

import { AlertTriangle, AlertCircle, Eye } from "lucide-react";
import { Signal } from "@/lib/types";

interface Props {
  signals: Signal[];
}

export default function ThreatSummary({ signals }: Props) {
  const critical = signals.filter((s) => s.level === "critical").length;
  const warning = signals.filter((s) => s.level === "warning").length;
  const watch = signals.filter((s) => s.level === "watch").length;
  const total = signals.length;

  if (total === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            감지된 위기 신호
          </span>
          <span className="rounded-full bg-accent-blue/15 px-2.5 py-0.5 text-xs font-bold text-accent-blue">
            {total}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {critical > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-red-600" />
              <span className="text-xs font-semibold text-red-600">
                긴급 {critical}
              </span>
            </div>
          )}
          {warning > 0 && (
            <div className="flex items-center gap-1.5">
              <AlertCircle size={14} className="text-orange-600" />
              <span className="text-xs font-semibold text-orange-600">
                주의 {warning}
              </span>
            </div>
          )}
          {watch > 0 && (
            <div className="flex items-center gap-1.5">
              <Eye size={14} className="text-sky-600" />
              <span className="text-xs font-semibold text-sky-600">
                관찰 {watch}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
