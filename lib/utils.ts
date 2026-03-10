import { RiskLevel } from "./types";

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "text-red-400";
    case "warning":
      return "text-orange-400";
    case "watch":
      return "text-sky-400";
    case "safe":
      return "text-green-400";
  }
}

export function getRiskBg(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "bg-risk-critical-bg border-risk-critical-border";
    case "warning":
      return "bg-risk-warning-bg border-risk-warning-border";
    case "watch":
      return "bg-risk-watch-bg border-risk-watch-border";
    case "safe":
      return "bg-risk-safe-bg border-risk-safe-border";
  }
}

export function getRiskBadge(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "bg-risk-critical-bg text-red-400";
    case "warning":
      return "bg-risk-warning-bg text-orange-400";
    case "watch":
      return "bg-risk-watch-bg text-sky-400";
    case "safe":
      return "bg-risk-safe-bg text-green-400";
  }
}

export function getRiskLabel(level: RiskLevel): string {
  switch (level) {
    case "critical":
      return "긴급";
    case "warning":
      return "주의";
    case "watch":
      return "관찰";
    case "safe":
      return "안전";
  }
}

export function getScoreLevel(score: number): RiskLevel {
  if (score >= 75) return "critical";
  if (score >= 60) return "warning";
  if (score >= 45) return "watch";
  return "safe";
}

export function getScoreGaugeColor(score: number): string {
  if (score >= 75) return "#dc2626";
  if (score >= 60) return "#f97316";
  if (score >= 45) return "#38bdf8";
  return "#22c55e";
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}
