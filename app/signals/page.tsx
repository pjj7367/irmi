"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import SignalFilter from "@/components/signals/SignalFilter";
import SignalCard from "@/components/signals/SignalCard";
import ThreatSummary from "@/components/signals/ThreatSummary";
import { Category, RiskLevel, Signal } from "@/lib/types";

export default function SignalsPage() {
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [level, setLevel] = useState<RiskLevel | "all">("all");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSignals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== "전체") params.set("category", category);
      if (level !== "all") params.set("level", level);

      const res = await fetch(`/api/signals?${params}`);
      const data = await res.json();
      setSignals(data);
    } catch {
      setSignals([]);
    } finally {
      setLoading(false);
    }
  }, [category, level]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">위기 신호</h1>
        <p className="mt-1 text-sm text-text-muted">
          기사량 급등을 자동 감지하여 민생 위기 신호를 표시합니다.
        </p>
      </div>

      <ThreatSummary signals={signals} />

      <SignalFilter
        selectedCategory={category}
        selectedLevel={level}
        onCategoryChange={setCategory}
        onLevelChange={setLevel}
      />

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-border bg-surface py-12 text-center">
            <Loader2 size={24} className="mx-auto animate-spin text-text-muted" />
            <p className="mt-2 text-sm text-text-muted">위기 신호를 분석하는 중...</p>
          </div>
        ) : signals.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface py-12 text-center text-sm text-text-muted">
            해당 조건의 위기 신호가 없습니다.
          </div>
        ) : (
          signals.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))
        )}
      </div>
    </div>
  );
}
