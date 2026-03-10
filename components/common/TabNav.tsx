"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, AlertTriangle, Newspaper, MapPin } from "lucide-react";

const tabs = [
  { href: "/", label: "종합 리스크", icon: BarChart3 },
  { href: "/signals", label: "위기 신호", icon: AlertTriangle },
  { href: "/analysis", label: "뉴스 분석", icon: Newspaper },
  { href: "/regions", label: "지역별 현황", icon: MapPin },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-border bg-surface/60">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-5 py-3 text-sm font-medium transition ${
                  isActive
                    ? "border-accent-blue text-accent-blue"
                    : "border-transparent text-text-muted hover:border-border-bright hover:text-foreground"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
