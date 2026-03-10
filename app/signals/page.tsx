"use client";

import { useState } from "react";
import SignalFilter from "@/components/signals/SignalFilter";
import SignalCard from "@/components/signals/SignalCard";
import { mockSignals } from "@/lib/mock-data";
import { Category, RiskLevel } from "@/lib/types";

export default function SignalsPage() {
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [level, setLevel] = useState<RiskLevel | "all">("all");

  const filtered = mockSignals.filter((s) => {
    if (category !== "전체" && s.category !== category) return false;
    if (level !== "all" && s.level !== level) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">위기 신호</h1>
        <p className="mt-1 text-sm text-text-muted">
          카테고리별·등급별 민생 위기 신호를 확인합니다.
        </p>
      </div>
      <SignalFilter
        selectedCategory={category}
        selectedLevel={level}
        onCategoryChange={setCategory}
        onLevelChange={setLevel}
      />
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface py-12 text-center text-sm text-text-muted">
            해당 조건의 위기 신호가 없습니다.
          </div>
        ) : (
          filtered.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))
        )}
      </div>
    </div>
  );
}
