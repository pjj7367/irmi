"use client";

import { ExternalLink, Clock, Flame, AlertTriangle, Eye } from "lucide-react";
import { mockNewsArticles } from "@/lib/mock-data";
import { getRiskLabel } from "@/lib/utils";
import { RiskLevel } from "@/lib/types";

function getBadgeStyle(level: RiskLevel) {
  switch (level) {
    case "critical":
      return {
        className: "bg-risk-critical-bg text-red-400 border-risk-critical-border",
        Icon: Flame,
      };
    case "warning":
      return {
        className: "bg-risk-warning-bg text-orange-400 border-risk-warning-border",
        Icon: AlertTriangle,
      };
    case "watch":
      return {
        className: "bg-risk-watch-bg text-sky-400 border-risk-watch-border",
        Icon: Eye,
      };
    case "safe":
      return {
        className: "bg-risk-safe-bg text-emerald-400 border-risk-safe-border",
        Icon: Eye,
      };
  }
}

function getCardAccent(level: RiskLevel) {
  switch (level) {
    case "critical":
      return "border-l-red-500 hover:bg-risk-critical-bg/50";
    case "warning":
      return "border-l-orange-500 hover:bg-risk-warning-bg/50";
    case "watch":
      return "border-l-sky-400 hover:bg-risk-watch-bg/50";
    case "safe":
      return "border-l-emerald-500 hover:bg-risk-safe-bg/50";
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "방금 전";
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default function CrisisReports() {
  const topArticles = mockNewsArticles.slice(0, 3);

  return (
    <div className="panel p-5 h-full flex flex-col">
      <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500 pulse-critical" />
        최신 위기 리포트
      </h2>

      <div className="flex flex-col gap-3 flex-1">
        {topArticles.map((article) => {
          const badge = getBadgeStyle(article.riskLevel);
          const BadgeIcon = badge.Icon;
          return (
            <div
              key={article.id}
              className={`rounded-xl border border-border border-l-[3px] ${getCardAccent(article.riskLevel)} bg-surface-bright/40 p-4 transition-all duration-200`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-bold tracking-wide ${badge.className}`}
                >
                  <BadgeIcon size={11} />
                  {getRiskLabel(article.riskLevel)}
                </span>
                <div className="flex items-center gap-1.5 text-text-muted shrink-0">
                  <Clock size={11} />
                  <span className="text-[11px]">
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
              </div>

              <h3 className="text-[15px] font-bold text-foreground leading-snug mb-2">
                {article.title}
              </h3>

              <p className="text-xs text-text-muted leading-relaxed mb-3 line-clamp-2">
                {article.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {article.keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-accent-blue/10 px-2 py-0.5 text-[10px] text-blue-400 border border-accent-blue/20"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
                <a
                  href={article.url}
                  className="flex items-center gap-1 text-[11px] text-accent-blue font-medium hover:text-accent-blue transition"
                >
                  상세보기 <ExternalLink size={10} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
