"use client";

import { useState } from "react";
import RegionMap from "@/components/regions/RegionMap";
import { mockRegions } from "@/lib/mock-data";
import { RiskLevel } from "@/lib/types";

const levels: { value: RiskLevel | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "critical", label: "긴급" },
  { value: "warning", label: "주의" },
  { value: "watch", label: "관찰" },
  { value: "safe", label: "안전" },
];

export default function RegionsPage() {
  const [level, setLevel] = useState<RiskLevel | "all">("all");

  const filtered =
    level === "all"
      ? mockRegions
      : mockRegions.filter((r) => r.level === level);

  const avg = Math.round(
    mockRegions.reduce((sum, r) => sum + r.score, 0) / mockRegions.length
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-foreground">지역별 현황</h1>
          <p className="mt-1 text-sm text-text-muted">
            전국 주요 지역별 민생 리스크 점수를 확인합니다.
          </p>
        </div>
        <div className="panel px-4 py-2 text-sm">
          전국 평균{" "}
          <span className="font-bold text-foreground">{avg}점</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {levels.map((lev) => (
          <button
            key={lev.value}
            onClick={() => setLevel(lev.value)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
              level === lev.value
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {lev.label}
          </button>
        ))}
      </div>

      <RegionMap allRegions={mockRegions} filtered={filtered} />
    </div>
  );
}
