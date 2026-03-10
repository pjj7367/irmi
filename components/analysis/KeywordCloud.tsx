"use client";

import { mockNewsArticles } from "@/lib/mock-data";

export default function KeywordCloud() {
  const keywordCount: Record<string, number> = {};
  mockNewsArticles.forEach((a) =>
    a.keywords.forEach((kw) => {
      keywordCount[kw] = (keywordCount[kw] || 0) + 1;
    })
  );

  const sorted = Object.entries(keywordCount).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 text-sm font-semibold text-text-muted">
        주요 키워드
      </h2>
      <div className="flex flex-wrap gap-2">
        {sorted.map(([kw, count]) => {
          const ratio = count / max;
          const size = ratio > 0.7 ? "text-base" : ratio > 0.4 ? "text-sm" : "text-xs";
          const weight = ratio > 0.7 ? "font-bold" : ratio > 0.4 ? "font-semibold" : "font-medium";
          const opacity = ratio > 0.7 ? "text-foreground" : ratio > 0.4 ? "text-text-secondary" : "text-text-muted";
          return (
            <span
              key={kw}
              className={`rounded-full bg-surface-bright px-3 py-1 ${size} ${weight} ${opacity} transition hover:bg-accent-blue/15 hover:text-accent-blue`}
            >
              {kw}
            </span>
          );
        })}
      </div>
    </div>
  );
}
