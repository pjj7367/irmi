"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockTrendData } from "@/lib/mock-data";

const COLORS: Record<string, string> = {
  물가: "#dc2626",
  고용: "#2563eb",
  자영업: "#d97706",
  금융: "#7c3aed",
  부동산: "#059669",
};

export default function TrendChart() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="mb-4 text-sm font-semibold text-text-muted">
        카테고리별 위험도 추이 (최근 9주)
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              domain={[40, 90]}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#E5E7EB" }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              labelStyle={{ color: "#111827" }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
            {Object.entries(COLORS).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
