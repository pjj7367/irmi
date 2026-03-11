"use client";

import { RiskScore, Category } from "@/lib/types";
import { getScoreLevel, getRiskLabel } from "@/lib/utils";

interface CategoryGaugesProps {
  data: RiskScore;
}

const categoryMeta: Record<Category, { icon: string; label: string; emoji: string }> = {
  물가: { icon: "P", label: "물가", emoji: "" },
  고용: { icon: "E", label: "고용", emoji: "" },
  자영업: { icon: "B", label: "자영업", emoji: "" },
  금융: { icon: "F", label: "금융", emoji: "" },
  부동산: { icon: "R", label: "부동산", emoji: "" },
};

function getBarColor(score: number) {
  if (score >= 75) return "bg-red-500";
  if (score >= 60) return "bg-orange-400";
  if (score >= 45) return "bg-sky-400";
  return "bg-emerald-400";
}

function getScoreColor(score: number) {
  if (score >= 75) return "text-red-600";
  if (score >= 60) return "text-orange-600";
  if (score >= 45) return "text-sky-600";
  return "text-emerald-600";
}

function getBadgeStyle(score: number) {
  if (score >= 75) return "bg-red-50 text-red-600 border-red-100";
  if (score >= 60) return "bg-orange-50 text-orange-600 border-orange-100";
  if (score >= 45) return "bg-sky-50 text-sky-600 border-sky-100";
  return "bg-emerald-50 text-emerald-600 border-emerald-100";
}

function getCardBorder(score: number) {
  if (score >= 75) return "border-red-200 hover:border-red-300 hover:shadow-red-100/50";
  if (score >= 60) return "border-orange-200 hover:border-orange-300 hover:shadow-orange-100/50";
  if (score >= 45) return "border-gray-200 hover:border-gray-300";
  return "border-gray-200 hover:border-gray-300";
}

export default function CategoryGauges({ data }: CategoryGaugesProps) {
  const categories = Object.entries(data.categories) as [Category, number][];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {categories.map(([category, score]) => {
        const level = getScoreLevel(score);
        const meta = categoryMeta[category];
        // Mini ring
        const r = 28;
        const circ = 2 * Math.PI * r;
        const prog = (score / 100) * circ;
        const ringHex =
          score >= 75 ? "#ef4444" :
          score >= 60 ? "#f59e0b" :
          score >= 45 ? "#0ea5e9" : "#22c55e";

        return (
          <div
            key={category}
            className={`rounded-2xl border bg-white p-5 transition-all duration-200 hover:shadow-lg cursor-default ${getCardBorder(score)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 text-[10px] font-black text-gray-500 border border-gray-100">
                  {meta.icon}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {meta.label}
                </span>
              </div>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${getBadgeStyle(score)}`}>
                {getRiskLabel(level)}
              </span>
            </div>

            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <svg width="72" height="72" viewBox="0 0 72 72">
                  <circle cx="36" cy="36" r={r} fill="none" stroke="#F3F4F6" strokeWidth="5" />
                  <circle
                    cx="36" cy="36" r={r}
                    fill="none"
                    stroke={ringHex}
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    strokeDashoffset={circ - prog}
                    transform="rotate(-90 36 36)"
                    className="gauge-animate"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-black tabular-nums ${getScoreColor(score)}`}>
                    {score}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColor(score)} gauge-animate`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
