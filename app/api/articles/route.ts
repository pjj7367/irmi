import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Category, RiskLevel } from "@/lib/types";

const CATEGORY_REVERSE: Record<string, string> = {
  "고용": "employment",
  "금융": "finance",
  "물가": "prices",
  "부동산": "realEstate",
  "자영업": "selfEmployed",
};

function toRiskLevel(score: number): RiskLevel {
  if (score >= 30) return "critical";
  if (score >= 20) return "warning";
  if (score >= 10) return "watch";
  return "safe";
}

function parseKeywords(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // not JSON
  }
  return [];
}

function extractSource(url: string | null): string {
  if (!url) return "알 수 없음";
  try {
    const hostname = new URL(url).hostname;
    if (hostname.includes("mk.co.kr")) return "매일경제";
    if (hostname.includes("chosun.com")) return "조선일보";
    if (hostname.includes("hankyung.com")) return "한국경제";
    return hostname.replace("www.", "");
  } catch {
    return "매일경제";
  }
}

interface ArticleRow {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  category_label: string | null;
  original_category_name: string | null;
  keywords: string | null;
  published_at: string;
  url: string | null;
  writer: string | null;
  relevance_score: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const limit = Math.min(Number(searchParams.get("limit") || 20), 100);

  const db = getDb();

  let sql = `
    SELECT id, title, summary, category, category_label,
           original_category_name, keywords, published_at,
           url, writer, relevance_score
    FROM articles
    WHERE 1=1
  `;
  const params: unknown[] = [];

  if (category && category !== "전체") {
    const dbCategory = CATEGORY_REVERSE[category];
    if (dbCategory) {
      sql += " AND category = ?";
      params.push(dbCategory);
    }
  }

  if (q) {
    sql += " AND (title LIKE ? OR summary LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  sql += " ORDER BY published_at DESC LIMIT ?";
  params.push(limit);

  const rows = db.prepare(sql).all(...params) as ArticleRow[];

  const articles = rows.map((row) => {
    const keywords = parseKeywords(row.keywords);
    const displayKeywords =
      keywords.length > 0
        ? keywords.slice(0, 4)
        : row.original_category_name
          ? [row.original_category_name]
          : [];

    return {
      id: row.id,
      title: row.title,
      summary: row.summary || "",
      source: extractSource(row.url),
      category: (row.category_label || "기타") as Category,
      keywords: displayKeywords,
      riskLevel: toRiskLevel(row.relevance_score),
      publishedAt: row.published_at,
      url: row.url || "#",
      writer: row.writer || null,
    };
  });

  return NextResponse.json(articles);
}
