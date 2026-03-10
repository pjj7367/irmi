"use client";

import { ExternalLink } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { getRiskBadge, getRiskLabel } from "@/lib/utils";

export default function NewsCard({ article }: { article: NewsArticle }) {
  const timeAgo = getTimeAgo(article.publishedAt);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 transition hover:border-border-bright hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${getRiskBadge(article.riskLevel)}`}
            >
              {getRiskLabel(article.riskLevel)}
            </span>
            <span className="text-[11px] font-medium text-text-muted">
              {article.category}
            </span>
            <span className="text-[11px] text-text-muted">·</span>
            <span className="text-[11px] text-text-muted">{timeAgo}</span>
          </div>
          <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">
            {article.title}
          </h3>
          <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
            {article.summary}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {article.keywords.map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-surface-bright px-2 py-0.5 text-[11px] text-text-muted"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
        <a
          href={article.url}
          className="shrink-0 rounded-lg p-1.5 text-text-muted transition hover:bg-surface-hover hover:text-foreground"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date("2026-03-05T10:00:00Z");
  const d = new Date(dateStr);
  const diffH = Math.floor((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return "방금";
  if (diffH < 24) return `${diffH}시간 전`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}일 전`;
}
