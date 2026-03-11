"use client";

import { useState, useEffect } from "react";
import { Loader2, Clock, Target } from "lucide-react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface Similarity {
  period: string;
  similarity: number;
  peakCount: number;
  categoryDistribution: Record<string, number>;
  topSubcategories: { name: string; category: string; count: number }[];
}

interface CrisisPeriod {
  label: string;
  startWeek: string;
  endWeek: string;
  peakCount: number;
  avgCount: number;
  categoryDistribution: Record<string, number>;
  topSubcategories: { name: string; category: string; count: number }[];
}

interface PatternData {
  crisisPeriods: CrisisPeriod[];
  latestFingerprint: {
    label: string;
    categoryDistribution: Record<string, number>;
    topSubcategories: { name: string; category: string; count: number }[];
  };
  similarities: Similarity[];
  stats: { avg: number; std: number; threshold: number };
}

export default function CrisisSimulator() {
  const [data, setData] = useState<PatternData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    fetch("/api/patterns")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <Loader2 size={24} className="mx-auto animate-spin text-text-muted" />
        <p className="mt-2 text-sm text-text-muted">패턴 분석 중...</p>
      </div>
    );
  }

  if (!data || data.similarities.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm text-sm text-text-muted">
        패턴 데이터가 없습니다.
      </div>
    );
  }

  const selected = data.similarities[selectedIdx];
  const latestDist = data.latestFingerprint.categoryDistribution;

  // Build radar chart data: comparing latest vs selected crisis period
  const radarData = Object.keys(latestDist).map((cat) => ({
    category: cat,
    현재: latestDist[cat],
    과거위기: selected.categoryDistribution[cat] || 0,
  }));

  return (
    <div className="space-y-4">
      {/* Similarity overview */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          위기 패턴 매칭
        </h2>
        <p className="mb-3 text-xs text-text-muted">
          최근 4주와 과거 위기 기간의 카테고리 분포 유사도
        </p>

        <div className="flex gap-4">
          {/* Crisis library */}
          <div className="w-48 shrink-0 space-y-1.5">
            <p className="mb-1 text-[11px] font-semibold text-text-muted">
              <Clock size={11} className="mr-1 inline" />
              감지된 위기 기간 ({data.crisisPeriods.length})
            </p>
            {data.similarities.map((sim, i) => (
              <button
                key={sim.period}
                onClick={() => setSelectedIdx(i)}
                className={`w-full rounded-lg px-3 py-2 text-left text-xs transition ${
                  selectedIdx === i
                    ? "bg-accent-blue/15 text-accent-blue"
                    : "bg-surface-bright text-text-secondary hover:bg-surface-hover"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{sim.period}</span>
                  <span
                    className={`font-bold ${
                      sim.similarity >= 90
                        ? "text-red-600"
                        : sim.similarity >= 80
                          ? "text-orange-600"
                          : "text-text-muted"
                    }`}
                  >
                    {sim.similarity}%
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Radar chart comparison */}
          <div className="flex-1">
            <div className="flex items-center justify-center gap-6">
              <div className="h-48 w-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fontSize: 10, fill: "#9CA3AF" }}
                    />
                    <Radar
                      name="현재"
                      dataKey="현재"
                      stroke="#38bdf8"
                      fill="#38bdf8"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Radar
                      name="과거위기"
                      dataKey="과거위기"
                      stroke="#f87171"
                      fill="#f87171"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {/* Similarity gauge */}
                <div>
                  <div className="flex items-center gap-2">
                    <Target size={14} className="text-text-muted" />
                    <span className="text-xs text-text-muted">유사도</span>
                    <span
                      className={`text-xl font-bold ${
                        selected.similarity >= 90
                          ? "text-red-600"
                          : selected.similarity >= 80
                            ? "text-orange-600"
                            : "text-sky-600"
                      }`}
                    >
                      {selected.similarity}%
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-32 rounded-full bg-surface-bright">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selected.similarity >= 90
                          ? "bg-red-500"
                          : selected.similarity >= 80
                            ? "bg-orange-500"
                            : "bg-sky-500"
                      }`}
                      style={{ width: `${selected.similarity}%` }}
                    />
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px]">
                    <div className="h-2 w-4 rounded-sm bg-sky-400" />
                    <span className="text-text-muted">현재 (최근 4주)</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <div className="h-2 w-4 rounded-sm bg-red-400" />
                    <span className="text-text-muted">
                      과거 위기 ({selected.period})
                    </span>
                  </div>
                </div>

                {/* Top subcategories */}
                <div>
                  <p className="mb-1 text-[11px] text-text-muted">
                    과거 주요 이슈
                  </p>
                  {selected.topSubcategories.slice(0, 3).map((sc) => (
                    <div key={sc.name} className="text-[11px] text-text-secondary">
                      {sc.category} &gt; {sc.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
