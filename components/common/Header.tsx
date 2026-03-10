"use client";

import { Bell, RefreshCw, Shield } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight tracking-tight">
              이르미 IRMI
            </h1>
            <p className="text-[10px] text-accent-blue/70 leading-none tracking-wider uppercase">
              민생위기 조기경보 레이더
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-lg bg-surface-bright border border-border px-3 py-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">LIVE</span>
            <span className="text-xs text-text-muted mx-0.5">|</span>
            <span className="text-xs text-text-muted">
              2026.03.05 09:00 갱신
            </span>
          </div>
          <button className="rounded-lg p-2 text-text-muted transition hover:bg-surface-hover hover:text-foreground">
            <RefreshCw size={16} />
          </button>
          <button className="relative rounded-lg p-2 text-text-muted transition hover:bg-surface-hover hover:text-foreground">
            <Bell size={16} />
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-surface pulse-critical" />
          </button>
        </div>
      </div>
    </header>
  );
}
