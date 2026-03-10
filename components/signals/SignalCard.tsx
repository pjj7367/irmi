"use client";

import { ChevronDown, ChevronUp, Newspaper } from "lucide-react";
import { useState } from "react";
import { Signal } from "@/lib/types";
import { getRiskBadge, getRiskBg, getRiskLabel, formatDate } from "@/lib/utils";

export default function SignalCard({ signal }: { signal: Signal }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`rounded-2xl border p-4 transition ${getRiskBg(signal.level)}`}
    >
      <div
        className="flex cursor-pointer items-start justify-between gap-3"
        onClick={() => setOpen(!open)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${getRiskBadge(signal.level)}`}
            >
              {getRiskLabel(signal.level)}
            </span>
            <span className="rounded-md bg-surface/60 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              {signal.category}
            </span>
            {signal.region && (
              <span className="rounded-md bg-surface/60 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                {signal.region}
              </span>
            )}
          </div>
          <h3 className="mt-2 text-sm font-semibold text-foreground">
            {signal.title}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <Newspaper size={12} />
              관련 기사 {signal.relatedArticles}건
            </span>
            <span>{formatDate(signal.date)}</span>
          </div>
        </div>
        <button className="shrink-0 rounded-lg p-1 text-text-muted hover:bg-surface-hover">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      {open && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-sm leading-relaxed text-foreground">
            {signal.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {signal.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-surface/70 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
