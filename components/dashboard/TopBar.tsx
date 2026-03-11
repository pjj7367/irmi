"use client";

import { TrendingUp, AlertTriangle, Activity, ArrowUpRight } from "lucide-react";
import { RiskScore } from "@/lib/types";
import { getScoreLevel } from "@/lib/utils";

interface TopBarProps {
  data: RiskScore;
}

export default function TopBar({ data }: TopBarProps) {
  const level = getScoreLevel(data.overall);

  const gradientClass =
    level === "critical"
      ? "from-red-50 via-orange-50/60 to-white"
      : level === "warning"
        ? "from-amber-50 via-orange-50/40 to-white"
        : "from-emerald-50 via-cyan-50/40 to-white";

  const ringColor =
    level === "critical"
      ? "#ef4444"
      : level === "warning"
        ? "#f59e0b"
        : level === "watch"
          ? "#0ea5e9"
          : "#22c55e";

  const scoreColor =
    level === "critical"
      ? "text-red-600"
      : level === "warning"
        ? "text-orange-600"
        : level === "watch"
          ? "text-sky-600"
          : "text-emerald-600";

  // SVG ring progress
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const progress = (data.overall / 100) * circumference;

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${gradientClass} border border-gray-100 p-8 shadow-sm`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Left: Score Ring */}
        <div className="flex items-center gap-8">
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="8"
              />
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                transform="rotate(-90 70 70)"
                className="transition-all duration-1000"
                style={{ filter: `drop-shadow(0 0 6px ${ringColor}40)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-black tabular-nums tracking-tight ${scoreColor}`}>
                {data.overall}
              </span>
              <span className="text-xs text-gray-400 font-medium -mt-0.5">/ 100</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                <AlertTriangle size={16} className={scoreColor} />
              </div>
              <span className="text-lg font-bold text-gray-900">
                민생위기 종합 지수
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              5개 카테고리 뉴스 기반 실시간 위기 수준 평가
            </p>
            <div className="flex items-center gap-3 mt-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3 py-1">
                <ArrowUpRight size={13} className="text-red-500" />
                <span className="text-xs font-bold text-red-600">+5%</span>
                <span className="text-xs text-red-400">전주 대비</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-gray-400">
                <Activity size={13} />
                <span className="text-xs">3월 1주차 기준</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Category mini bars */}
        <div className="hidden lg:grid grid-cols-5 gap-3">
          {(Object.entries(data.categories) as [string, number][]).map(([cat, score]) => {
            const catLevel = getScoreLevel(score);
            const barColor =
              catLevel === "critical" ? "bg-red-500" :
              catLevel === "warning" ? "bg-orange-400" :
              catLevel === "watch" ? "bg-sky-400" : "bg-emerald-400";
            return (
              <div key={cat} className="text-center">
                <div className="text-[11px] text-gray-400 mb-1">{cat}</div>
                <div className="text-lg font-black text-gray-900 tabular-nums">{score}</div>
                <div className="mt-1 h-1.5 w-14 rounded-full bg-gray-100 mx-auto overflow-hidden">
                  <div className={`h-full rounded-full ${barColor} gauge-animate`} style={{ width: `${score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
