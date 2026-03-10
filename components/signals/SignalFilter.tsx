"use client";

import { Category, RiskLevel } from "@/lib/types";

const categories: (Category | "전체")[] = ["전체", "물가", "고용", "자영업", "금융", "부동산"];
const levels: { value: RiskLevel | "all"; label: string }[] = [
  { value: "all", label: "전체 등급" },
  { value: "critical", label: "긴급" },
  { value: "warning", label: "주의" },
  { value: "watch", label: "관찰" },
];

interface Props {
  selectedCategory: Category | "전체";
  selectedLevel: RiskLevel | "all";
  onCategoryChange: (c: Category | "전체") => void;
  onLevelChange: (l: RiskLevel | "all") => void;
}

export default function SignalFilter({
  selectedCategory,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedCategory === cat
                ? "bg-accent-blue text-white"
                : "bg-surface-bright text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {levels.map((lev) => (
          <button
            key={lev.value}
            onClick={() => onLevelChange(lev.value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              selectedLevel === lev.value
                ? "bg-accent-blue text-white"
                : "bg-surface-bright text-text-secondary hover:bg-surface-hover"
            }`}
          >
            {lev.label}
          </button>
        ))}
      </div>
    </div>
  );
}
