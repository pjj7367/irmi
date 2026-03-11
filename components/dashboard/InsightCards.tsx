"use client";

import { ArrowRight } from "lucide-react";
import { mockInsights } from "@/lib/mock-data";
import { getRiskLabel } from "@/lib/utils";
import { RiskLevel } from "@/lib/types";

function getGradient(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "from-red-500 to-rose-400";
    case "warning":
      return "from-orange-500 to-amber-400";
    case "watch":
      return "from-sky-500 to-cyan-400";
    case "safe":
      return "from-emerald-500 to-green-400";
  }
}

function getBgTint(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "bg-gradient-to-br from-red-50/80 to-white";
    case "warning":
      return "bg-gradient-to-br from-orange-50/80 to-white";
    case "watch":
      return "bg-gradient-to-br from-sky-50/60 to-white";
    case "safe":
      return "bg-gradient-to-br from-emerald-50/60 to-white";
  }
}

function getBorderColor(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "border-red-100 hover:border-red-200";
    case "warning":
      return "border-orange-100 hover:border-orange-200";
    case "watch":
      return "border-sky-100 hover:border-sky-200";
    case "safe":
      return "border-emerald-100 hover:border-emerald-200";
  }
}

function getTextColor(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "text-red-600";
    case "warning":
      return "text-orange-600";
    case "watch":
      return "text-sky-600";
    case "safe":
      return "text-emerald-600";
  }
}

export default function InsightCards() {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        오늘의 위기 요약
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockInsights.map((insight) => (
          <div
            key={insight.id}
            className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg cursor-default ${getBgTint(insight.level)} ${getBorderColor(insight.level)}`}
          >
            {/* Top gradient bar */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getGradient(insight.level)}`} />

            <div className="flex items-center gap-2 mb-3 mt-1">
              <span className={`text-xs font-bold ${getTextColor(insight.level)}`}>
                {getRiskLabel(insight.level)}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">{insight.category}</span>
            </div>

            <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2">
              {insight.title}
            </h3>

            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
              {insight.summary}
            </p>

            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
              상세 분석 <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
