"use client";

import { Bell, RefreshCw, Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-200">
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight tracking-tight">
              이르미
            </h1>
            <p className="text-[10px] text-gray-400 leading-none tracking-wider uppercase">
              IRMI Early Warning Radar
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-100 px-3 py-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-600">LIVE</span>
            <span className="text-[10px] text-gray-300 mx-0.5">|</span>
            <span className="text-[11px] text-gray-400">
              2026.03.05 09:00
            </span>
          </div>
          <button className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <RefreshCw size={15} />
          </button>
          <button className="relative rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
            <Bell size={15} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
