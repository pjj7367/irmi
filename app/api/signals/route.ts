import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { RiskLevel, Category } from "@/lib/types";

const CATEGORY_MAP: Record<string, Category> = {
  employment: "고용",
  finance: "금융",
  prices: "물가",
  realEstate: "부동산",
  selfEmployed: "자영업",
};

const CATEGORY_REVERSE: Record<string, string> = {
  "고용": "employment",
  "금융": "finance",
  "물가": "prices",
  "부동산": "realEstate",
  "자영업": "selfEmployed",
};

function classifyLevel(surgeRatio: number, velocity: number): RiskLevel | null {
  if (surgeRatio > 3.0 && velocity > 1.5) return "critical";
  if (surgeRatio > 2.0 || (surgeRatio > 1.5 && velocity > 2.0)) return "warning";
  if (surgeRatio > 1.5) return "watch";
  return null;
}

interface WeeklyRow {
  original_category_name: string;
  category: string;
  category_label: string;
  w0: number;
  w1: number;
  w2: number;
  w3: number;
  w4: number;
}

interface ArticleRow {
  id: string;
  title: string;
  published_at: string;
  url: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const filterCategory = searchParams.get("category");
  const filterLevel = searchParams.get("level");

  const db = getDb();

  // Get the most recent date in the DB as reference point
  const { max_date } = db.prepare(
    "SELECT MAX(date(published_at)) as max_date FROM articles"
  ).get() as { max_date: string };

  // Build category filter for SQL
  let categoryWhere = "";
  const params: string[] = [];
  if (filterCategory && filterCategory !== "전체") {
    const dbCat = CATEGORY_REVERSE[filterCategory];
    if (dbCat) {
      categoryWhere = "AND category = ?";
      params.push(dbCat);
    }
  }

  // Calculate weekly counts for each subcategory over 5 weeks
  const weeklyRows = db.prepare(`
    SELECT original_category_name, category, category_label,
      SUM(CASE WHEN published_at >= date('${max_date}', '-6 days') THEN 1 ELSE 0 END) as w0,
      SUM(CASE WHEN published_at >= date('${max_date}', '-13 days') AND published_at < date('${max_date}', '-6 days') THEN 1 ELSE 0 END) as w1,
      SUM(CASE WHEN published_at >= date('${max_date}', '-20 days') AND published_at < date('${max_date}', '-13 days') THEN 1 ELSE 0 END) as w2,
      SUM(CASE WHEN published_at >= date('${max_date}', '-27 days') AND published_at < date('${max_date}', '-20 days') THEN 1 ELSE 0 END) as w3,
      SUM(CASE WHEN published_at >= date('${max_date}', '-34 days') AND published_at < date('${max_date}', '-27 days') THEN 1 ELSE 0 END) as w4
    FROM articles
    WHERE published_at >= date('${max_date}', '-34 days')
      AND original_category_name IS NOT NULL
      ${categoryWhere}
    GROUP BY original_category_name, category, category_label
    HAVING w0 >= 3
  `).all(...params) as WeeklyRow[];

  // Compute surge signals
  const signals = [];

  for (const row of weeklyRows) {
    const baseline = (row.w1 + row.w2 + row.w3 + row.w4) / 4;
    const surgeRatio = row.w0 / Math.max(baseline, 1);
    const velocity = row.w0 / Math.max(row.w1, 1);

    const level = classifyLevel(surgeRatio, velocity);
    if (!level) continue;

    // Apply level filter
    if (filterLevel && filterLevel !== "all" && level !== filterLevel) continue;

    const categoryLabel = (CATEGORY_MAP[row.category] || row.category_label || "기타") as Category;

    // Fetch top articles for this subcategory in the recent 7 days
    const topArticles = db.prepare(`
      SELECT id, title, published_at, url
      FROM articles
      WHERE original_category_name = ?
        AND published_at >= date('${max_date}', '-6 days')
      ORDER BY relevance_score DESC, published_at DESC
      LIMIT 5
    `).all(row.original_category_name) as ArticleRow[];

    const baselineRounded = Math.round(baseline * 10) / 10;
    const ratioDisplay = Math.round(surgeRatio * 10) / 10;

    signals.push({
      id: `surge-${row.category}-${row.original_category_name}`,
      title: `${categoryLabel} > ${row.original_category_name} 기사 급등`,
      description: `최근 1주 ${row.w0}건으로 직전 4주 평균(${baselineRounded}건) 대비 ${ratioDisplay}배 급등. ` +
        (velocity > 1.5
          ? `전주(${row.w1}건) 대비 ${Math.round(velocity * 10) / 10}배 가속 중.`
          : `전주(${row.w1}건) 대비 소폭 변동.`),
      level,
      category: categoryLabel,
      relatedArticles: row.w0,
      date: max_date,
      keywords: [row.original_category_name],
      subcategory: row.original_category_name,
      surgeRatio: Math.round(surgeRatio * 100) / 100,
      velocity: Math.round(velocity * 100) / 100,
      weeklyTrend: [row.w4, row.w3, row.w2, row.w1, row.w0],
      topArticles: topArticles.map((a) => ({
        id: a.id,
        title: a.title,
        publishedAt: a.published_at,
        url: a.url || "#",
      })),
    });
  }

  // Sort by level priority then surge ratio
  const levelOrder: Record<string, number> = { critical: 0, warning: 1, watch: 2, safe: 3 };
  signals.sort((a, b) => {
    const ld = levelOrder[a.level] - levelOrder[b.level];
    if (ld !== 0) return ld;
    return b.surgeRatio - a.surgeRatio;
  });

  return NextResponse.json(signals);
}
