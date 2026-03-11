"use client";

import { ExternalLink, Clock, Flame, AlertTriangle, Eye } from "lucide-react";
import { mockNewsArticles } from "@/lib/mock-data";
import { getRiskLabel } from "@/lib/utils";
import { RiskLevel } from "@/lib/types";

function getBadgeStyle(level: RiskLevel) {
  switch (level) {
    case "critical":
      return {
        className: "bg-red-50 text-red-600 border-red-100",
        Icon: Flame,
      };
    case "warning":
      return {
        className: "bg-orange-50 text-orange-600 border-orange-100",
        Icon: AlertTriangle,
      };
    case "watch":
      return {
        className: "bg-sky-50 text-sky-600 border-sky-100",
        Icon: Eye,
      };
    case "safe":
      return {
        className: "bg-emerald-50 text-emerald-600 border-emerald-100",
        Icon: Eye,
      };
  }
}

function getCardAccent(level: RiskLevel) {
  switch (level) {
    case "critical":
      return "border-l-red-400 hover:bg-red-50/30";
    case "warning":
      return "border-l-orange-400 hover:bg-orange-50/30";
    case "watch":
      return "border-l-sky-400 hover:bg-sky-50/30";
    case "safe":
      return "border-l-emerald-400 hover:bg-emerald-50/30";
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6 h-full flex flex-col shadow-sm">
      <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-red-500 pulse-critical" />
        최신 위기 리포트
      </h2>

      <div className="flex flex-col gap-3 flex-1">
        {topArticles.map((article) => {
          const badge = getBadgeStyle(article.riskLevel);
          const BadgeIcon = badge.Icon;
          return (
            <div
              key={article.id}
              className={`rounded-xl border border-gray-100 border-l-[3px] ${getCardAccent(article.riskLevel)} bg-white p-4 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.className}`}
                >
                  <BadgeIcon size={10} />
                  {getRiskLabel(article.riskLevel)}
                </span>
                <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
                  <Clock size={11} />
                  <span className="text-[11px]">
                    {timeAgo(article.publishedAt)}
                  </span>
                </div>
              </div>

              <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-1.5">
                {article.title}
              </h3>

              <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                {article.summary}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {article.keywords.slice(0, 3).map((kw) => (
                    <span
                      key={kw}
                      className="rounded-full bg-gray-50 px-2 py-0.5 text-[10px] text-gray-500 border border-gray-100"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
                <a
                  href={article.url}
                  className="flex items-center gap-1 text-[11px] text-blue-500 font-medium hover:text-blue-600 transition"
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
