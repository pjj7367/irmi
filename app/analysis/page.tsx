"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import NewsCard from "@/components/analysis/NewsCard";
import KeywordCloud from "@/components/analysis/KeywordCloud";
import { Category, NewsArticle } from "@/lib/types";

const categories: (Category | "전체")[] = ["전체", "물가", "고용", "자영업", "금융", "부동산"];

export default function AnalysisPage() {
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "전체") params.set("category", category);
      if (debouncedQuery) params.set("q", debouncedQuery);
      params.set("limit", "20");

      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();
      setArticles(data);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, debouncedQuery]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">뉴스 분석</h1>
        <p className="mt-1 text-sm text-text-muted">
          실시간 뉴스 분석 결과와 주요 키워드를 확인합니다.
        </p>
      </div>

      <KeywordCloud articles={articles} />

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                category === cat
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="기사 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-4 text-sm text-foreground outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
          />
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface py-12 text-center">
            <Loader2 size={24} className="mx-auto animate-spin text-text-muted" />
            <p className="mt-2 text-sm text-text-muted">기사를 불러오는 중...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface py-12 text-center text-sm text-text-muted">
            검색 결과가 없습니다.
          </div>
        ) : (
          articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
