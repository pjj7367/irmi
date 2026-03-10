export type RiskLevel = "critical" | "warning" | "watch" | "safe";

export type Category = "물가" | "고용" | "자영업" | "금융" | "부동산";

export interface RiskScore {
  overall: number;
  categories: Record<Category, number>;
  trend: "up" | "down" | "stable";
  updatedAt: string;
}

export interface Signal {
  id: string;
  title: string;
  description: string;
  level: RiskLevel;
  category: Category;
  region?: string;
  relatedArticles: number;
  date: string;
  keywords: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: Category;
  keywords: string[];
  riskLevel: RiskLevel;
  publishedAt: string;
  url: string;
}

export interface RegionRisk {
  name: string;
  score: number;
  level: RiskLevel;
  topIssue: string;
  trend: "up" | "down" | "stable";
}
