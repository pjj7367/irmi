"use client";

import { ExternalLink } from "lucide-react";
import { NewsArticle } from "@/lib/types";
import { getRiskBadge, getRiskLabel } from "@/lib/utils";

export default function NewsCard({ article }: { article: NewsArticle }) {
  const timeAgo = getTimeAgo(article.publishedAt);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-md">
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
            {article.writer && (
              <>
                <span className="text-[11px] text-text-muted">·</span>
                <span className="truncate text-[11px] text-text-muted">
                  {article.writer}
                </span>
              </>
            )}
          </div>
          <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">
            {article.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
            {article.summary}
          </p>
          {article.keywords.length > 0 && (
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
          )}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg p-1.5 text-text-muted transition hover:bg-surface-hover hover:text-foreground"
        >
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr.replace(" ", "T") + (dateStr.includes("T") ? "" : "Z"));
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 0) return "방금";
  if (diffH < 1) return "방금";
  if (diffH < 24) return `${diffH}시간 전`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD}일 전`;
  const diffM = Math.floor(diffD / 30);
  if (diffM < 12) return `${diffM}개월 전`;
  return `${Math.floor(diffM / 12)}년 전`;
}
