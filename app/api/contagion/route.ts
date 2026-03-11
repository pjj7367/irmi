import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

const CATEGORIES = ["employment", "finance", "prices", "realEstate", "selfEmployed"];
const LABELS: Record<string, string> = {
  employment: "고용",
  finance: "금융",
  prices: "물가",
  realEstate: "부동산",
  selfEmployed: "자영업",
};

// Representative keywords per category for bridge detection
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  employment: ["고용", "취업", "실업", "해고", "채용", "일자리", "근로", "노동", "임금", "퇴직"],
  finance: ["금리", "대출", "은행", "금융", "투자", "증시", "주식", "펀드", "보험", "연체"],
  prices: ["물가", "인플레", "소비자", "가격", "인상", "장바구니", "원자재", "유가", "식품", "전기료"],
  realEstate: ["부동산", "아파트", "전세", "매매", "분양", "임대", "건설", "재건축", "PF", "주택"],
  selfEmployed: ["자영업", "소상공인", "폐업", "창업", "매출", "상권", "프랜차이즈", "배달", "임대료", "골목"],
};

interface WeekCatRow {
  week_num: string;
  category: string;
  cnt: number;
}

interface BridgeRow {
  cnt: number;
}

export async function GET() {
  const db = getDb();

  // 1. Weekly counts per category for temporal correlation
  const weeklyCounts = db.prepare(`
    SELECT strftime('%W', published_at) as week_num, category, COUNT(*) as cnt
    FROM articles
    GROUP BY week_num, category
    ORDER BY week_num
  `).all() as WeekCatRow[];

  // Build per-category weekly time series
  const weeks = [...new Set(weeklyCounts.map((r) => r.week_num))].sort();
  const series: Record<string, number[]> = {};
  for (const cat of CATEGORIES) {
    series[cat] = weeks.map((w) => {
      const row = weeklyCounts.find((r) => r.week_num === w && r.category === cat);
      return row?.cnt || 0;
    });
  }

  // 2. Compute contagion matrix
  const matrix: { from: string; to: string; correlation: number; bridgeScore: number; contagionIndex: number }[] = [];

  for (let i = 0; i < CATEGORIES.length; i++) {
    for (let j = 0; j < CATEGORIES.length; j++) {
      if (i === j) continue;

      const catA = CATEGORIES[i];
      const catB = CATEGORIES[j];

      // Pearson correlation of weekly counts
      const a = series[catA];
      const b = series[catB];
      const correlation = pearson(a, b);

      // Bridge score: articles in category A mentioning category B keywords
      const keywords = CATEGORY_KEYWORDS[catB];
      const likeConditions = keywords.map(() => "(title LIKE ? OR summary LIKE ?)").join(" OR ");
      const likeParams = keywords.flatMap((kw) => [`%${kw}%`, `%${kw}%`]);

      const bridgeResult = db.prepare(`
        SELECT COUNT(*) as cnt FROM articles
        WHERE category = ? AND (${likeConditions})
      `).get(catA, ...likeParams) as BridgeRow;

      const totalInA = db.prepare(
        "SELECT COUNT(*) as cnt FROM articles WHERE category = ?"
      ).get(catA) as BridgeRow;

      const bridgeScore = totalInA.cnt > 0
        ? Math.round((bridgeResult.cnt / totalInA.cnt) * 1000) / 1000
        : 0;

      const contagionIndex = Math.round((0.6 * bridgeScore + 0.4 * Math.max(correlation, 0)) * 1000) / 1000;

      matrix.push({
        from: LABELS[catA],
        to: LABELS[catB],
        correlation: Math.round(correlation * 1000) / 1000,
        bridgeScore,
        contagionIndex,
      });
    }
  }

  // Sort by contagion index descending
  matrix.sort((a, b) => b.contagionIndex - a.contagionIndex);

  // 3. Build network nodes and links for visualization
  const categories = CATEGORIES.map((c) => LABELS[c]);
  const links = matrix.map((m) => ({
    source: m.from,
    target: m.to,
    value: m.contagionIndex,
    correlation: m.correlation,
    bridge: m.bridgeScore,
  }));

  return NextResponse.json({ categories, matrix, links });
}

function pearson(a: number[], b: number[]): number {
  const n = a.length;
  if (n === 0) return 0;
  const avgA = a.reduce((s, v) => s + v, 0) / n;
  const avgB = b.reduce((s, v) => s + v, 0) / n;
  let num = 0, denA = 0, denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - avgA;
    const db = b[i] - avgB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}
