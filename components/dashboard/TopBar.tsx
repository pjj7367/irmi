"use client";

import { TrendingUp, AlertTriangle, Clock, Activity } from "lucide-react";
import { RiskScore } from "@/lib/types";
import { getScoreLevel } from "@/lib/utils";

interface TopBarProps {
  data: RiskScore;
}

export default function TopBar({ data }: TopBarProps) {
  const level = getScoreLevel(data.overall);
  const scoreColor =
    level === "critical"
      ? "text-red-400"
      : level === "warning"
        ? "text-orange-400"
        : level === "watch"
          ? "text-sky-400"
          : "text-emerald-400";

  const glowClass =
    level === "critical"
      ? "glow-red"
      : level === "warning"
        ? "glow-orange"
        : "glow-green";

  return (
    <div className={`panel p-5 ${glowClass}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-risk-critical-bg border border-risk-critical-border">
              <AlertTriangle
                size={20}
                className={level === "critical" ? "text-red-400 pulse-critical" : "text-orange-400"}
              />
            </div>
            <span className="text-sm font-semibold text-text-muted tracking-wide">
              민생위기 종합 지수
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-6xl font-black tabular-nums tracking-tighter ${scoreColor}`}>
              {data.overall}
            </span>
            <span className="text-xl text-text-muted font-semibold">점</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 rounded-xl bg-risk-critical-bg border border-risk-critical-border px-4 py-2">
            <TrendingUp size={16} className="text-red-400" />
            <span className="text-sm font-bold text-red-400">
              전주 대비 +5% 상승
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-text-muted">
            <Activity size={14} className="text-accent-cyan" />
            <span className="text-xs text-text-muted">3월 1주차 기준</span>
          </div>
        </div>
      </div>
    </div>
  );
}
