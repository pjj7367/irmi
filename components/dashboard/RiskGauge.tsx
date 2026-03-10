"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { RiskScore } from "@/lib/types";
import { getScoreGaugeColor, getScoreLevel, getRiskLabel } from "@/lib/utils";

export default function RiskGauge({ data }: { data: RiskScore }) {
  const color = getScoreGaugeColor(data.overall);
  const level = getScoreLevel(data.overall);
  const label = getRiskLabel(level);

  const TrendIcon =
    data.trend === "up"
      ? TrendingUp
      : data.trend === "down"
        ? TrendingDown
        : Minus;

  const trendLabel =
    data.trend === "up" ? "상승세" : data.trend === "down" ? "하락세" : "보합";

  const circumference = 2 * Math.PI * 70;
  const progress = (data.overall / 100) * circumference * 0.75;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-1 text-sm font-semibold text-text-muted">
        종합 민생 리스크 지수
      </h2>
      <div className="flex flex-col items-center py-4">
        <div className="relative h-48 w-48">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-[135deg]">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#253a54"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${progress} ${circumference - progress}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold" style={{ color }}>
              {data.overall}
            </span>
            <span
              className="mt-1 rounded-full px-3 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: color + "18", color }}
            >
              {label}
            </span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-sm text-text-muted">
          <TrendIcon
            size={16}
            className={
              data.trend === "up"
                ? "text-red-400"
                : data.trend === "down"
                  ? "text-green-400"
                  : "text-text-muted"
            }
          />
          <span>전주 대비 {trendLabel}</span>
        </div>
      </div>
    </div>
  );
}
