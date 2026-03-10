"use client";

import { RiskScore, Category } from "@/lib/types";
import { getScoreLevel, getRiskLabel } from "@/lib/utils";

interface CategoryGaugesProps {
  data: RiskScore;
}

const categoryMeta: Record<Category, { icon: string; label: string }> = {
  물가: { icon: "P", label: "물가" },
  고용: { icon: "E", label: "고용" },
  자영업: { icon: "B", label: "자영업" },
  금융: { icon: "F", label: "금융" },
  부동산: { icon: "R", label: "부동산" },
};

function getBarGradient(score: number) {
  if (score >= 75) return "from-red-500 to-red-400";
  if (score >= 60) return "from-orange-500 to-orange-400";
  if (score >= 45) return "from-sky-500 to-sky-400";
  return "from-emerald-500 to-emerald-400";
}

function getScoreColor(score: number) {
  if (score >= 75) return "text-red-400";
  if (score >= 60) return "text-orange-400";
  if (score >= 45) return "text-sky-400";
  return "text-emerald-400";
}

function getBadgeColor(score: number) {
  if (score >= 75) return "bg-risk-critical-bg text-red-400 border-risk-critical-border";
  if (score >= 60) return "bg-risk-warning-bg text-orange-400 border-risk-warning-border";
  if (score >= 45) return "bg-risk-watch-bg text-sky-400 border-risk-watch-border";
  return "bg-risk-safe-bg text-emerald-400 border-risk-safe-border";
}

export default function CategoryGauges({ data }: CategoryGaugesProps) {
  const categories = Object.entries(data.categories) as [Category, number][];

  return (
    <div className="panel p-5">
      <h2 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent-cyan" />
        카테고리별 위험도
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
        {categories.map(([category, score]) => {
          const level = getScoreLevel(score);
          const meta = categoryMeta[category];
          return (
            <div key={category} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-blue/10 text-[10px] font-black text-accent-blue border border-accent-blue/25">
                    {meta.icon}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {meta.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xl font-black tabular-nums ${getScoreColor(score)}`}
                  >
                    {score}
                  </span>
                  <span
                    className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold ${getBadgeColor(score)}`}
                  >
                    {getRiskLabel(level)}
                  </span>
                </div>
              </div>

              <div className="relative h-3.5 w-full rounded-full bg-surface-bright overflow-hidden border border-border">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getBarGradient(score)} gauge-animate`}
                  style={{ width: `${score}%` }}
                />
                <div className="absolute inset-y-0 left-[45%] w-px bg-border/40" />
                <div className="absolute inset-y-0 left-[60%] w-px bg-border/40" />
                <div className="absolute inset-y-0 left-[75%] w-px bg-border/50" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
