"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { RiskScore, Category } from "@/lib/types";
import { getScoreGaugeColor, getScoreLevel, getRiskLabel } from "@/lib/utils";

export default function CategoryChart({ data }: { data: RiskScore }) {
  const categories = Object.entries(data.categories) as [Category, number][];

  const radarData = categories.map(([name, value]) => ({
    category: name,
    value,
  }));

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 text-sm font-semibold text-text-muted">
        5대 카테고리별 위험도
      </h2>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#253a54" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fontSize: 12, fill: "#7a8da6" }}
            />
            <PolarRadiusAxis
              domain={[0, 100]}
              tick={{ fontSize: 10, fill: "#7a8da6" }}
              axisLine={false}
            />
            <Radar
              dataKey="value"
              stroke="#818cf8"
              fill="#818cf8"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {categories.map(([name, value]) => {
          const level = getScoreLevel(value);
          const color = getScoreGaugeColor(value);
          return (
            <div key={name} className="text-center">
              <div className="text-xs text-text-muted">{name}</div>
              <div className="text-lg font-bold" style={{ color }}>
                {value}
              </div>
              <div
                className="mx-auto mt-0.5 rounded-full px-2 py-px text-[10px] font-medium"
                style={{ backgroundColor: color + "18", color }}
              >
                {getRiskLabel(level)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
