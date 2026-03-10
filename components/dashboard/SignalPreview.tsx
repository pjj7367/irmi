"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Signal } from "@/lib/types";
import { getRiskBadge, getRiskLabel, formatDate } from "@/lib/utils";

export default function SignalPreview({ signals }: { signals: Signal[] }) {
  const criticalCount = signals.filter((s) => s.level === "critical").length;
  const warningCount = signals.filter((s) => s.level === "warning").length;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-muted">최근 위기 신호</h2>
        <div className="flex gap-2">
          {criticalCount > 0 && (
            <span className="rounded-full bg-risk-critical-bg px-2.5 py-0.5 text-xs font-semibold text-red-400">
              긴급 {criticalCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="rounded-full bg-risk-warning-bg px-2.5 py-0.5 text-xs font-semibold text-orange-400">
              주의 {warningCount}
            </span>
          )}
        </div>
      </div>
      <div className="space-y-3">
        {signals.slice(0, 5).map((signal) => (
          <div
            key={signal.id}
            className="flex items-start gap-3 rounded-xl border border-border p-3 transition hover:border-border-bright hover:bg-surface-hover"
          >
            <span
              className={`mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${getRiskBadge(signal.level)}`}
            >
              {getRiskLabel(signal.level)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">
                {signal.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                <span>{signal.category}</span>
                {signal.region && (
                  <>
                    <span>·</span>
                    <span>{signal.region}</span>
                  </>
                )}
                <span>·</span>
                <span>기사 {signal.relatedArticles}건</span>
                <span>·</span>
                <span>{formatDate(signal.date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/signals"
        className="mt-4 flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-sm font-medium text-text-muted transition hover:bg-surface-hover hover:text-foreground"
      >
        전체 위기 신호 보기
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}
