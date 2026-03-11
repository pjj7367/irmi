import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const LABELS: Record<string, string> = {
  employment: "고용",
  finance: "금융",
  prices: "물가",
  realEstate: "부동산",
  selfEmployed: "자영업",
};

interface WeekRow {
  week_num: string;
  category: string;
  cnt: number;
}

interface SubcatRow {
  original_category_name: string;
  category_label: string;
  cnt: number;
}

export async function GET() {
  const db = getDb();

  // 1. Weekly total counts for crisis auto-detection
  const weeklyTotals = db.prepare(`
    SELECT strftime('%W', published_at) as week_num, COUNT(*) as cnt
    FROM articles
    GROUP BY week_num
    ORDER BY week_num
  `).all() as { week_num: string; cnt: number }[];

  const totalValues = weeklyTotals.map((r) => r.cnt);
  const avg = totalValues.reduce((s, v) => s + v, 0) / totalValues.length;
  const std = Math.sqrt(totalValues.reduce((s, v) => s + (v - avg) ** 2, 0) / totalValues.length);

  // 2. Auto-detect crisis periods (weeks where total > avg + 0.8*std)
  const threshold = avg + 0.8 * std;
  const crisisPeriods: { startWeek: string; endWeek: string; peakWeek: string; peakCount: number; avgCount: number; weeks: string[] }[] = [];
  let currentCrisis: { weeks: string[]; counts: number[] } | null = null;

  for (const row of weeklyTotals) {
    if (row.cnt > threshold) {
      if (!currentCrisis) currentCrisis = { weeks: [], counts: [] };
      currentCrisis.weeks.push(row.week_num);
      currentCrisis.counts.push(row.cnt);
    } else {
      if (currentCrisis && currentCrisis.weeks.length >= 1) {
        const peakIdx = currentCrisis.counts.indexOf(Math.max(...currentCrisis.counts));
        crisisPeriods.push({
          startWeek: currentCrisis.weeks[0],
          endWeek: currentCrisis.weeks[currentCrisis.weeks.length - 1],
          peakWeek: currentCrisis.weeks[peakIdx],
          peakCount: currentCrisis.counts[peakIdx],
          avgCount: Math.round(currentCrisis.counts.reduce((s, v) => s + v, 0) / currentCrisis.counts.length),
          weeks: currentCrisis.weeks,
        });
      }
      currentCrisis = null;
    }
  }
  if (currentCrisis && currentCrisis.weeks.length >= 1) {
    const peakIdx = currentCrisis.counts.indexOf(Math.max(...currentCrisis.counts));
    crisisPeriods.push({
      startWeek: currentCrisis.weeks[0],
      endWeek: currentCrisis.weeks[currentCrisis.weeks.length - 1],
      peakWeek: currentCrisis.weeks[peakIdx],
      peakCount: currentCrisis.counts[peakIdx],
      avgCount: Math.round(currentCrisis.counts.reduce((s, v) => s + v, 0) / currentCrisis.counts.length),
      weeks: currentCrisis.weeks,
    });
  }

  // 3. Per-category weekly counts for fingerprinting
  const weeklyCats = db.prepare(`
    SELECT strftime('%W', published_at) as week_num, category, COUNT(*) as cnt
    FROM articles
    GROUP BY week_num, category
    ORDER BY week_num
  `).all() as WeekRow[];

  const allWeeks = [...new Set(weeklyCats.map((r) => r.week_num))].sort();

  // 4. Build fingerprints for each crisis period and the latest period
  const fingerprints = crisisPeriods.map((crisis) => {
    const catDist = computeCategoryDistribution(weeklyCats, crisis.weeks);
    const topSubcats = getTopSubcategories(db, crisis.weeks);
    return {
      ...crisis,
      label: `${Number(crisis.startWeek)}~${Number(crisis.endWeek)}주`,
      categoryDistribution: catDist,
      topSubcategories: topSubcats,
    };
  });

  // Latest period fingerprint (last 4 weeks)
  const latestWeeks = allWeeks.slice(-4);
  const latestFingerprint = {
    startWeek: latestWeeks[0],
    endWeek: latestWeeks[latestWeeks.length - 1],
    label: "최근 4주",
    categoryDistribution: computeCategoryDistribution(weeklyCats, latestWeeks),
    topSubcategories: getTopSubcategories(db, latestWeeks),
  };

  // 5. Compute similarity between latest and each crisis period
  const similarities = fingerprints.map((fp) => {
    const sim = cosineSimilarity(
      Object.values(latestFingerprint.categoryDistribution),
      Object.values(fp.categoryDistribution)
    );
    return {
      period: fp.label,
      similarity: Math.round(sim * 100),
      peakCount: fp.peakCount,
      categoryDistribution: fp.categoryDistribution,
      topSubcategories: fp.topSubcategories,
    };
  });

  similarities.sort((a, b) => b.similarity - a.similarity);

  // 6. Timeline data for visualization
  const timeline = allWeeks.map((w) => {
    const entry: Record<string, number | string> = { week: `${Number(w)}주` };
    for (const row of weeklyCats.filter((r) => r.week_num === w)) {
      entry[LABELS[row.category] || row.category] = row.cnt;
    }
    return entry;
  });

  return NextResponse.json({
    timeline,
    crisisPeriods: fingerprints,
    latestFingerprint,
    similarities,
    stats: { avg: Math.round(avg), std: Math.round(std), threshold: Math.round(threshold) },
  });
}

function computeCategoryDistribution(
  weeklyCats: WeekRow[],
  weeks: string[]
): Record<string, number> {
  const dist: Record<string, number> = { 물가: 0, 고용: 0, 자영업: 0, 금융: 0, 부동산: 0 };
  for (const row of weeklyCats) {
    if (weeks.includes(row.week_num)) {
      const label = LABELS[row.category] || row.category;
      if (label in dist) dist[label] += row.cnt;
    }
  }
  const total = Object.values(dist).reduce((s, v) => s + v, 0) || 1;
  for (const key of Object.keys(dist)) {
    dist[key] = Math.round((dist[key] / total) * 100);
  }
  return dist;
}

function getTopSubcategories(db: ReturnType<typeof getDb>, weeks: string[]): { name: string; category: string; count: number }[] {
  const placeholders = weeks.map(() => "?").join(",");
  return db.prepare(`
    SELECT original_category_name as name, category_label as category, COUNT(*) as count
    FROM articles
    WHERE strftime('%W', published_at) IN (${placeholders})
      AND original_category_name IS NOT NULL
    GROUP BY original_category_name, category_label
    ORDER BY count DESC
    LIMIT 5
  `).all(...weeks) as { name: string; category: string; count: number }[];
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}
