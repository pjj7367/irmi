import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

interface WeekRow {
  week_num: string;
  category_label: string;
  cnt: number;
}

interface MidWeekRow {
  week_num: string;
  middle_category_name: string;
  cnt: number;
}

export async function GET() {
  const db = getDb();

  // 1. Weekly counts by top-level category (5 categories x ~52 weeks)
  const weeklyByCategory = db.prepare(`
    SELECT strftime('%W', published_at) as week_num,
      category_label,
      COUNT(*) as cnt
    FROM articles
    WHERE category_label IS NOT NULL
    GROUP BY week_num, category_label
    ORDER BY week_num
  `).all() as WeekRow[];

  // Build stacked area data: [{week, 물가, 고용, 자영업, 금융, 부동산}, ...]
  const weekMap: Record<string, Record<string, number>> = {};
  for (const row of weeklyByCategory) {
    if (!weekMap[row.week_num]) {
      weekMap[row.week_num] = { 물가: 0, 고용: 0, 자영업: 0, 금융: 0, 부동산: 0 };
    }
    weekMap[row.week_num][row.category_label] = row.cnt;
  }

  const areaData = Object.entries(weekMap)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([week, cats]) => ({
      week: `${Number(week)}주`,
      ...cats,
    }));

  // 2. Weekly counts by middle category (for heatmap)
  const weeklyByMid = db.prepare(`
    SELECT strftime('%W', published_at) as week_num,
      middle_category_name,
      COUNT(*) as cnt
    FROM articles
    WHERE middle_category_name IS NOT NULL AND middle_category_name != ''
    GROUP BY week_num, middle_category_name
    ORDER BY week_num
  `).all() as MidWeekRow[];

  // Compute z-scores for heatmap
  // First, get per-midcat average and stddev
  const midStats: Record<string, { values: number[]; weekCounts: Record<string, number> }> = {};
  for (const row of weeklyByMid) {
    if (!midStats[row.middle_category_name]) {
      midStats[row.middle_category_name] = { values: [], weekCounts: {} };
    }
    midStats[row.middle_category_name].values.push(row.cnt);
    midStats[row.middle_category_name].weekCounts[row.week_num] = row.cnt;
  }

  const weeks = [...new Set(weeklyByMid.map((r) => r.week_num))].sort(
    (a, b) => Number(a) - Number(b)
  );

  // Filter to meaningful categories (exclude empty, very small)
  const midCategories = Object.entries(midStats)
    .filter(([name, s]) => name.length > 0 && s.values.length >= 10)
    .sort((a, b) => {
      const sumA = a[1].values.reduce((s, v) => s + v, 0);
      const sumB = b[1].values.reduce((s, v) => s + v, 0);
      return sumB - sumA;
    })
    .map(([name]) => name);

  const heatmapData: {
    category: string;
    cells: { week: string; count: number; zScore: number }[];
  }[] = [];

  for (const cat of midCategories) {
    const stat = midStats[cat];
    const vals = stat.values;
    const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
    const std = Math.sqrt(
      vals.reduce((s, v) => s + (v - avg) ** 2, 0) / vals.length
    );

    const cells = weeks.map((w) => {
      const count = stat.weekCounts[w] || 0;
      const zScore = std > 0 ? (count - avg) / std : 0;
      return {
        week: `${Number(w)}주`,
        count,
        zScore: Math.round(zScore * 100) / 100,
      };
    });

    heatmapData.push({ category: cat, cells });
  }

  return NextResponse.json({
    areaData,
    heatmapData,
    weeks: weeks.map((w) => `${Number(w)}주`),
  });
}
