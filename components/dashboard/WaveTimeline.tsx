"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

interface AreaDataPoint {
  week: string;
  물가: number;
  고용: number;
  자영업: number;
  금융: number;
  부동산: number;
}

interface HeatmapCell {
  week: string;
  count: number;
  zScore: number;
}

interface HeatmapRow {
  category: string;
  cells: HeatmapCell[];
}

interface WaveData {
  areaData: AreaDataPoint[];
  heatmapData: HeatmapRow[];
  weeks: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  물가: "#f87171",
  고용: "#fb923c",
  자영업: "#facc15",
  금융: "#38bdf8",
  부동산: "#a78bfa",
};

function zScoreToColor(z: number): string {
  if (z >= 3) return "bg-red-500";
  if (z >= 2) return "bg-red-400/80";
  if (z >= 1.5) return "bg-orange-400/70";
  if (z >= 1) return "bg-orange-300/50";
  if (z >= 0.5) return "bg-yellow-400/30";
  if (z > -0.5) return "bg-gray-200/50";
  return "bg-sky-400/20";
}

export default function WaveTimeline() {
  const [data, setData] = useState<WaveData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCell, setHoveredCell] = useState<{
    cat: string;
    week: string;
    count: number;
    z: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/waves")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <Loader2 size={24} className="mx-auto animate-spin text-text-muted" />
        <p className="mt-2 text-sm text-text-muted">파동 데이터 로딩 중...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* Stacked Area Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          주간 기사량 추이
        </h2>
        <p className="mb-3 text-xs text-text-muted">
          5개 카테고리별 주간 기사 건수 (2025년)
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.areaData}>
              <XAxis
                dataKey="week"
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                interval={4}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ color: "#111827" }}
              />
              {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex justify-center gap-4">
          {Object.entries(CATEGORY_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-[11px] text-text-muted">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-1 text-sm font-semibold text-foreground">
              중분류 히트맵
            </h2>
            <p className="mb-3 text-xs text-text-muted">
              z-score 기반 이상 감지 (빨간색 = 평소 대비 급등)
            </p>
          </div>
          {hoveredCell && (
            <div className="rounded-lg bg-surface-bright px-3 py-1.5 text-xs">
              <span className="font-semibold text-foreground">{hoveredCell.cat}</span>
              <span className="text-text-muted"> · {hoveredCell.week}</span>
              <span className="text-text-muted"> · {hoveredCell.count}건</span>
              <span className={`ml-1 font-bold ${hoveredCell.z >= 2 ? "text-red-600" : hoveredCell.z >= 1 ? "text-orange-600" : "text-text-muted"}`}>
                z={hoveredCell.z}
              </span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {data.heatmapData.map((row) => (
              <div key={row.category} className="mb-0.5 flex items-center gap-1">
                <div className="w-16 shrink-0 truncate text-right text-[10px] text-text-muted">
                  {row.category}
                </div>
                <div className="flex flex-1 gap-px">
                  {row.cells.map((cell) => (
                    <div
                      key={cell.week}
                      className={`h-4 flex-1 rounded-[2px] transition-opacity ${zScoreToColor(cell.zScore)} ${hoveredCell?.cat === row.category && hoveredCell?.week === cell.week ? "ring-1 ring-gray-800" : ""}`}
                      onMouseEnter={() =>
                        setHoveredCell({
                          cat: row.category,
                          week: cell.week,
                          count: cell.count,
                          z: cell.zScore,
                        })
                      }
                      onMouseLeave={() => setHoveredCell(null)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {/* Week labels */}
            <div className="mt-1 flex items-center gap-1">
              <div className="w-16 shrink-0" />
              <div className="flex flex-1 gap-px">
                {data.weeks
                  .filter((_, i) => i % 5 === 0)
                  .map((w) => (
                    <div
                      key={w}
                      className="text-[9px] text-text-muted"
                      style={{ width: `${(100 / data.weeks.length) * 5}%` }}
                    >
                      {w}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="text-[10px] text-text-muted">낮음</span>
          <div className="flex gap-px">
            <div className="h-3 w-6 rounded-sm bg-sky-400/20" />
            <div className="h-3 w-6 rounded-sm bg-gray-200/50" />
            <div className="h-3 w-6 rounded-sm bg-yellow-400/30" />
            <div className="h-3 w-6 rounded-sm bg-orange-300/50" />
            <div className="h-3 w-6 rounded-sm bg-orange-400/70" />
            <div className="h-3 w-6 rounded-sm bg-red-400/80" />
            <div className="h-3 w-6 rounded-sm bg-red-500" />
          </div>
          <span className="text-[10px] text-text-muted">급등</span>
        </div>
      </div>
    </div>
  );
}
