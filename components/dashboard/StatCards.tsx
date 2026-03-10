"use client";

import { AlertTriangle, Newspaper, TrendingUp, MapPin } from "lucide-react";
import { mockSignals, mockNewsArticles, mockRegions } from "@/lib/mock-data";

export default function StatCards() {
  const criticalSignals = mockSignals.filter((s) => s.level === "critical").length;
  const totalArticles = mockNewsArticles.length;
  const riskyRegions = mockRegions.filter((r) => r.level === "critical" || r.level === "warning").length;

  const stats = [
    {
      label: "긴급 신호",
      value: criticalSignals,
      unit: "건",
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-risk-critical-bg",
    },
    {
      label: "주의 신호",
      value: mockSignals.filter((s) => s.level === "warning").length,
      unit: "건",
      icon: TrendingUp,
      color: "text-orange-400",
      bg: "bg-risk-warning-bg",
    },
    {
      label: "분석 기사",
      value: totalArticles,
      unit: "건",
      icon: Newspaper,
      color: "text-blue-400",
      bg: "bg-accent-blue/10",
    },
    {
      label: "주의 지역",
      value: riskyRegions,
      unit: "곳",
      icon: MapPin,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-surface p-4"
          >
            <div className="flex items-center gap-2">
              <div className={`rounded-lg p-1.5 ${stat.bg}`}>
                <Icon size={16} className={stat.color} />
              </div>
              <span className="text-xs text-text-muted">{stat.label}</span>
            </div>
            <div className="mt-2">
              <span className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </span>
              <span className="ml-1 text-sm text-text-muted">{stat.unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
