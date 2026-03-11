"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface Link {
  source: string;
  target: string;
  value: number;
  correlation: number;
  bridge: number;
}

interface ContagionData {
  categories: string[];
  links: Link[];
}

const CATEGORY_COLORS: Record<string, string> = {
  물가: "#f87171",
  고용: "#fb923c",
  자영업: "#facc15",
  금융: "#38bdf8",
  부동산: "#a78bfa",
};

// Pentagon positions (5 nodes)
function pentagonPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 5 }, (_, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  });
}

export default function ContagionNetwork() {
  const [data, setData] = useState<ContagionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<Link | null>(null);

  useEffect(() => {
    fetch("/api/contagion")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
        <Loader2 size={24} className="mx-auto animate-spin text-text-muted" />
        <p className="mt-2 text-sm text-text-muted">연쇄 위험 분석 중...</p>
      </div>
    );
  }

  if (!data) return null;

  const cx = 160, cy = 140, r = 100;
  const points = pentagonPoints(cx, cy, r);
  const catPositions: Record<string, { x: number; y: number }> = {};
  data.categories.forEach((cat, i) => {
    catPositions[cat] = points[i];
  });

  // Get top links (bidirectional, take the stronger direction)
  const pairMap: Record<string, Link> = {};
  for (const link of data.links) {
    const key = [link.source, link.target].sort().join("-");
    if (!pairMap[key] || link.value > pairMap[key].value) {
      pairMap[key] = link;
    }
  }
  const topLinks = Object.values(pairMap).sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold text-foreground">
        연쇄 위험 네트워크
      </h2>
      <p className="mb-3 text-xs text-text-muted">
        카테고리 간 기사 키워드 교차 + 시계열 상관관계 기반
      </p>

      <div className="flex gap-4">
        {/* SVG Network */}
        <div className="shrink-0">
          <svg width="320" height="280" viewBox="0 0 320 280">
            {/* Links */}
            {topLinks.map((link) => {
              const from = catPositions[link.source];
              const to = catPositions[link.target];
              if (!from || !to) return null;
              const opacity = Math.min(link.value * 3, 1);
              const width = Math.max(link.value * 8, 0.5);
              const isHovered =
                hovered?.source === link.source && hovered?.target === link.target;
              return (
                <line
                  key={`${link.source}-${link.target}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isHovered ? "#111827" : "#f87171"}
                  strokeWidth={isHovered ? width + 1 : width}
                  strokeOpacity={isHovered ? 1 : opacity}
                  className="cursor-pointer transition-all"
                  onMouseEnter={() => setHovered(link)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
            })}

            {/* Nodes */}
            {data.categories.map((cat) => {
              const pos = catPositions[cat];
              const color = CATEGORY_COLORS[cat] || "#9CA3AF";
              return (
                <g key={cat}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={22}
                    fill={color}
                    fillOpacity={0.2}
                    stroke={color}
                    strokeWidth={2}
                  />
                  <text
                    x={pos.x}
                    y={pos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#374151"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {cat}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Matrix / Rankings */}
        <div className="flex-1 min-w-0">
          {hovered ? (
            <div className="rounded-xl bg-surface-bright p-3">
              <p className="text-xs font-semibold text-foreground">
                {hovered.source} → {hovered.target}
              </p>
              <div className="mt-2 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">연쇄 지수</span>
                  <span className="font-bold text-red-600">
                    {hovered.value}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">키워드 브릿지</span>
                  <span className="text-foreground">{hovered.bridge}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">시계열 상관</span>
                  <span className="text-foreground">{hovered.correlation}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-2 text-xs font-semibold text-text-muted">
                연쇄 강도 TOP 5
              </p>
              <div className="space-y-1.5">
                {topLinks.slice(0, 5).map((link, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-lg bg-surface-bright px-3 py-2 text-xs"
                    onMouseEnter={() => setHovered(link)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span className="font-semibold text-foreground">
                      {link.source}
                    </span>
                    <span className="text-text-muted">→</span>
                    <span className="font-semibold text-foreground">
                      {link.target}
                    </span>
                    <span className="ml-auto font-bold text-red-600">
                      {link.value}
                    </span>
                    <div
                      className="h-1.5 w-12 rounded-full bg-gray-200"
                    >
                      <div
                        className="h-full rounded-full bg-red-400/80"
                        style={{ width: `${Math.min(link.value * 300, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
