"use client";

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  ComposedChart,
} from "recharts";
import { mockLeadingIndicatorData } from "@/lib/mock-data";
import { TrendingUp } from "lucide-react";

export default function LeadingIndicatorChart() {
  // Calculate the lead advantage
  const latest = mockLeadingIndicatorData[mockLeadingIndicatorData.length - 1];
  const gap = latest.이르미지표 - latest.통계청지표;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-start justify-between p-6 pb-0">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            선행 지표 비교
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            통계청 공식 지표 대비 이르미 뉴스 기반 지표
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-3 py-1.5">
          <TrendingUp size={13} className="text-blue-500" />
          <span className="text-xs font-bold text-blue-600">+{gap}pt 선행</span>
        </div>
      </div>

      <div className="flex items-center gap-6 px-6 mt-3">
        <div className="flex items-center gap-2 text-[12px] text-gray-500">
          <div className="h-0.5 w-5 bg-blue-500 rounded-full" />
          이르미 뉴스 지표
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-400">
          <div className="h-0.5 w-5 bg-gray-300 rounded-full border-dashed" style={{ borderTop: "2px dashed #D1D5DB", height: 0 }} />
          통계청 공식 지표
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-400">
          <div className="h-3 w-3 rounded-sm bg-blue-50 border border-blue-100" />
          격차 영역
        </div>
      </div>

      <div className="h-72 px-2 pb-4 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={mockLeadingIndicatorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#F3F4F6" }}
              tickLine={false}
            />
            <YAxis
              domain={[50, 85]}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #E5E7EB",
                fontSize: "12px",
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "#111827", fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="이르미지표"
              fill="#3B82F6"
              fillOpacity={0.06}
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="통계청지표"
              stroke="#D1D5DB"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={false}
              name="통계청 공식 지표"
            />
            <Line
              type="monotone"
              dataKey="이르미지표"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#3B82F6", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#3B82F6", stroke: "#fff", strokeWidth: 2 }}
              name="이르미 뉴스 지표"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
