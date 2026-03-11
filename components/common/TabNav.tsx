"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, AlertTriangle, Newspaper, Eye, MapPin } from "lucide-react";

const tabs = [
  { href: "/", label: "종합 리스크", icon: BarChart3 },
  { href: "/signals", label: "위기 신호", icon: AlertTriangle },
  { href: "/analysis", label: "뉴스 분석", icon: Newspaper },
  { href: "/reporters", label: "기자의 시선", icon: Eye },
  { href: "/regions", label: "지역별 현황", icon: MapPin },
];

export default function TabNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-1.5">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
