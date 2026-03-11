"use client";

import { ChevronDown, ChevronUp, Newspaper, ExternalLink, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { Signal } from "@/lib/types";
import { getRiskBadge, getRiskBg, getRiskLabel, formatDate } from "@/lib/utils";

export default function SignalCard({ signal }: { signal: Signal }) {
  const [open, setOpen] = useState(false);

  const trendData = signal.weeklyTrend?.map((v, i) => ({ w: i, v })) || [];
  const trendColor =
    signal.level === "critical"
      ? "#f87171"
      : signal.level === "warning"
        ? "#fb923c"
        : "#38bdf8";

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
            <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              {signal.category}
            </span>
            {signal.subcategory && (
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                {signal.subcategory}
              </span>
            )}
            {signal.region && (
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
                {signal.region}
              </span>
            )}
            {signal.surgeRatio && signal.surgeRatio > 1 && (
              <span className="flex items-center gap-0.5 rounded-md bg-red-500/15 px-2 py-0.5 text-[11px] font-bold text-red-600">
                <TrendingUp size={10} />
                x{signal.surgeRatio}
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

        <div className="flex shrink-0 items-center gap-2">
          {trendData.length > 0 && (
            <div className="h-8 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={trendColor}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
          <button className="rounded-lg p-1 text-text-muted hover:bg-surface-hover">
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="text-sm leading-relaxed text-foreground">
            {signal.description}
          </p>

          {signal.topArticles && signal.topArticles.length > 0 && (
            <div className="mt-3">
              <p className="mb-2 text-xs font-semibold text-text-muted">
                근거 기사
              </p>
              <div className="space-y-1.5">
                {signal.topArticles.map((article) => (
                  <a
                    key={article.id}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs transition hover:bg-surface-hover"
                  >
                    <span className="min-w-0 flex-1 truncate text-foreground">
                      {article.title}
                    </span>
                    <span className="shrink-0 text-text-muted">
                      {formatDate(article.publishedAt)}
                    </span>
                    <ExternalLink size={12} className="shrink-0 text-text-muted" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {signal.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary"
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
