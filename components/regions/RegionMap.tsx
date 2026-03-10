"use client";

import { useState, useRef, useEffect, useCallback, type MouseEvent } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { RegionRisk } from "@/lib/types";
import { getScoreLevel, getRiskLabel } from "@/lib/utils";

const PROVINCES: { name: string; d: string; lx: number; ly: number }[] = [
  { name: "경기", d: "M163.1,256.2 L155.7,236.4 L165.6,240.8 L169.2,237.1 L154.9,234.1 L157.2,243.4 L155.2,240.3 L151.4,243.8 L149.5,236.1 L166.2,227.8 L164.6,214.9 L173.4,224.5 L179.9,221.8 L183.2,225 L191.2,212.8 L186.5,214.8 L185.9,204.1 L181.5,203.2 L170.2,213.5 L157.5,208.2 L151.2,211.2 L148.5,197.1 L157.9,196.8 L158.4,182.9 L167.9,179.1 L178.5,161.2 L186.4,156.9 L193.8,168.2 L198.1,164.7 L200.5,171.8 L207.6,170.1 L209.3,178 L218.7,182.9 L218.8,189.4 L213.7,192.7 L214.5,208 L234.6,215.3 L228.9,219 L231.7,224.9 L224.7,248 L220.4,246.8 L218.8,253.7 L210,254.9 L198.4,267.7 L189.3,261.5 L173.9,267.1 L163.1,256.2 Z", lx: 202, ly: 180 },
  { name: "강원", d: "M291.4,177.4 L332.2,240.4 L332.7,247.5 L324.6,256.1 L315.3,251.2 L300.9,255.7 L294.9,251.8 L293,257 L269.3,246.6 L263.6,248.5 L265.8,241.9 L257.9,239.3 L246.8,244.1 L242.6,238.7 L239.6,246.1 L230.4,247.5 L228.9,219 L234.6,215.1 L214.5,208 L213.7,192.7 L218.8,189.4 L218.7,182.9 L209.3,178 L207.6,170.1 L200.5,171.8 L198.1,164.7 L193.8,168.2 L185.9,156.7 L230.4,151.5 L244.6,157.3 L262.8,144.5 L267.6,130.3 L291.4,177.4 Z", lx: 252.2, ly: 208.1 },
  { name: "충북", d: "M199.8,281.2 L206.9,278.2 L198.8,264.7 L210,254.9 L218.8,253.7 L227.9,242 L230.7,247.7 L238,247.2 L242.6,238.7 L246.8,244.1 L257.9,239.3 L265.8,241.9 L263.6,248.5 L269.3,246.6 L271.9,251 L286.6,254 L273,265 L271.6,274.3 L260.1,269.4 L258.4,274.2 L248.3,273.8 L249,282.5 L241.7,280.2 L236.3,284.5 L239.6,290.9 L236.4,286.6 L231.3,291.1 L238.4,298.5 L234.8,317.1 L246.1,317.7 L248.2,323 L243,323.2 L241.9,333.4 L236.5,337.3 L222.4,336 L218.4,321.7 L211.6,320.1 L215.9,307.1 L211,301 L205.7,302.6 L205.9,296.1 L199.1,292.3 L199.8,281.2 Z", lx: 236.3, ly: 281.7 },
  { name: "충남", d: "M160,259.2 L170.8,268.8 L190,261.6 L205.7,275.3 L206.9,278.6 L198.2,283.9 L188,282.4 L193.2,292.9 L190.9,299.4 L198,305.9 L195.7,315.8 L201.2,324.4 L203.8,317.3 L208.2,323.5 L214.2,319 L218.4,321.7 L219.5,339 L205.7,338.4 L201.6,328.6 L187.6,334 L177.3,326.6 L170.9,334.3 L158.1,338.7 L156.7,331.6 L147,328.4 L150.5,318 L147.6,312.7 L151.2,310.9 L146,308.3 L149.4,303.8 L145.1,292.6 L138.7,289 L133.9,292.4 L133.1,280.8 L125.1,284.9 L129.4,281.4 L125.1,278.6 L122.8,282.6 L122.2,277.3 L128.1,266.8 L133.9,267.1 L134.6,260.9 L133.6,275.2 L136.4,270.1 L138.6,272.8 L143,267.1 L136.5,262.3 L140.1,261.6 L138.2,258.2 L144.4,259.3 L147.3,254 L160,259.2 Z", lx: 163.5, ly: 293.8 },
  { name: "전북", d: "M179.4,327.3 L187.6,334 L201.6,328.6 L204.1,337.2 L211.2,340.8 L214.1,335.8 L219.5,339 L220.1,333.7 L236.5,337.3 L237.2,346.1 L222.6,357.9 L217.6,374.7 L223.3,383.4 L218.2,393.9 L210.2,389.7 L204.6,394.8 L186.4,395 L182.5,393.3 L182,381.7 L175.5,387.4 L168.3,380 L152.8,394.9 L142.8,384.4 L146.4,377.2 L158.8,375.2 L144.7,370.2 L151,363.2 L146.2,353.8 L151.8,364.1 L155.9,355 L160.7,355.3 L153.4,343.2 L144,354.4 L148.2,341.1 L162.5,340.3 L172.5,327.9 L179.4,327.3 Z", lx: 183.1, ly: 360 },
  { name: "전남", d: "M172.6,462.4 L166,462 L165.4,449.8 L163.9,461 L148.7,475.4 L144.8,456.3 L131.7,449.9 L133.5,438.3 L138.3,443.4 L144.1,436.1 L137.6,435.2 L141.7,431.5 L139.2,419 L138.8,425.3 L134.1,421.7 L139.7,415 L135.7,411.8 L131.1,418 L125.1,411.7 L137.4,406.2 L136.4,411.4 L142.7,416.7 L145.1,410.9 L134.2,401.2 L140.7,389.4 L144,391.1 L141.5,384.4 L152.8,394.9 L168.3,380 L175.5,387.4 L182,381.7 L182.5,393.3 L186.4,395 L204.6,394.8 L212.1,390.2 L230.6,417.5 L229.4,424.2 L221.1,428.2 L217.1,425.5 L220.9,432.7 L229.9,430.1 L228.6,439.8 L222.6,438.3 L219.4,442.3 L221.4,448.7 L215.5,446.2 L218.2,439 L211.4,428.9 L202.6,431.7 L207.3,433.7 L203.8,439.6 L212.6,451.5 L205.3,451.9 L207.6,457.8 L201.6,463.2 L187,455.1 L196,441.9 L200.4,445.3 L200.9,438.7 L195.5,438.1 L176.9,448.4 L180.3,450.2 L178.3,461.2 L172.6,462.4 Z", lx: 177.1, ly: 429.1 },
  { name: "경북", d: "M336.3,267.8 L339.9,283.3 L333.4,315.9 L337.6,331.3 L333.3,335.1 L338.5,339.7 L345.2,332.2 L347,337.7 L339.3,365.7 L328.2,367.5 L318.5,361 L308.3,370.3 L282.1,372 L278.6,362 L288.7,361.3 L293.6,349.8 L289.4,337.8 L278.7,340.6 L276.9,348.1 L273.9,343.6 L270.3,347.1 L269.2,350.8 L275.7,353.8 L269.2,358.2 L272.5,362.6 L267.2,362.7 L269.6,369.6 L255,366.8 L257.5,361.5 L252.4,353.2 L236.8,347.1 L243,323.2 L248.2,323 L246.1,317.7 L234.8,317.1 L238.4,298.5 L231.2,291.5 L236.4,286.6 L239.6,290.9 L236.3,284.5 L241.7,280.2 L249,282.5 L248.3,273.8 L258.4,274.2 L260,269.4 L271.6,274.3 L273,265 L281.3,256.4 L293.2,257 L294.9,251.8 L300.9,255.7 L315.4,251.2 L324.6,256.1 L332.7,247.5 L337,254.5 L336.3,267.8 Z", lx: 284.6, ly: 316.2 },
  { name: "경남", d: "M274.3,411.8 L268,415.1 L274.8,412.9 L276.8,417.2 L270.8,419.4 L271.7,429.1 L275.2,427.7 L272.6,431.9 L263.7,426.9 L267.4,426.3 L265.2,421.9 L262.1,426.9 L260.1,423.4 L253.1,427.9 L247.8,424.5 L247.9,412.4 L242.9,416.3 L244.9,420.4 L239.4,417.8 L231.5,425.1 L217,395.1 L223.3,383.4 L217.6,374.6 L227.9,351.5 L237,346.3 L252.2,353 L257.5,361.5 L254.7,366.5 L268.9,370.5 L278.6,364.4 L283.4,372.6 L310.5,369.8 L308.8,376.7 L323.3,386.1 L301.3,402.1 L301.1,406.9 L295.8,406.4 L297,412.7 L283.7,407.9 L285.4,401.4 L281,404.3 L285.5,413.5 L281.5,414.6 L279.2,409.3 L274.3,411.8 Z", lx: 267.5, ly: 402.2 },
  { name: "제주", d: "M173.3,537.5 L175.6,544.4 L163.1,556.5 L132.6,563.2 L125.5,555.8 L135.2,541.1 L164.3,533.5 L173.3,537.5 Z", lx: 155.4, ly: 546.2 },
];

const CITIES: { name: string; d: string; lx: number; ly: number }[] = [
  { name: "서울", d: "M181.1,203.3 L185.9,204.1 L186.5,214.8 L191.2,212.8 L191.6,215.7 L189.1,217.5 L189.2,221.1 L184,224.9 L179.9,221.8 L173.4,224.5 L171.3,219.7 L167.7,221.3 L168.2,216 L164.5,214.8 L166.9,210.9 L170.2,213.5 L173.2,212.1 L173.5,207.4 L178.7,208.4 L181.1,203.3 Z", lx: 178, ly: 200 },
  { name: "부산", d: "M306.5,414.9 L306.3,410.4 L304.8,413 L305,410.1 L302.4,412.6 L302.5,409.3 L301.7,412.6 L298.7,412.4 L295.8,406.4 L301.1,406.9 L301.3,402.1 L308.5,400.4 L310.2,396.9 L316.2,394.6 L316.8,389.5 L320.6,390.9 L322,387.9 L326.3,388 L328.9,393.1 L326.1,393.7 L323.7,404.1 L316.8,406.7 L317.2,411 L312.5,408.9 L310.2,414.7 L309.3,412 L309.6,415 L306.5,414.9 Z", lx: 324, ly: 408 },
  { name: "대구", d: "M289.5,337.8 L292.7,341.1 L293.7,349.1 L288.6,355.8 L288.7,361.3 L284.5,362.8 L284.1,359.9 L280.9,360.1 L277.2,367.9 L268.5,370.3 L270.3,367.3 L267.2,362.7 L272.5,362.6 L269.2,358.2 L271.3,354.5 L275.7,353.8 L269.2,350.8 L270.3,347.1 L273.9,343.6 L276.9,348.1 L278.7,340.6 L280.2,342.2 L284.5,338.5 L289.5,337.8 Z", lx: 279.1, ly: 353.1 },
  { name: "인천", d: "M157.4,208.3 L166.4,212.8 L163,218.6 L165.5,223 L161.7,228.7 L152.6,232.3 L157.3,230.8 L153.7,226 L156.1,224.8 L153.2,222.3 L155.4,222.6 L153.5,221.4 L156.4,218.9 L154.1,219.6 L152.2,212.2 L157.4,208.3 Z", lx: 136, ly: 220 },
  { name: "광주", d: "M164.4,398.4 L163.8,400.1 L167.1,401.5 L175.3,398.9 L177.6,404.5 L181.1,405.1 L179,411.3 L165,414.7 L162.4,409.9 L157.5,409.9 L157.3,403.5 L164.4,398.4 Z", lx: 152, ly: 408 },
  { name: "대전", d: "M205.5,300 L205.7,302.6 L208.6,303.2 L211,301 L212.1,306.3 L215.9,307.3 L213.7,308.1 L209.2,323 L206.1,322.1 L203.8,317.3 L201.2,324.4 L195.7,315.8 L198,305.9 L201.6,304.9 L203,300 L205.5,300 Z", lx: 220, ly: 314 },
  { name: "울산", d: "M319.5,361.8 L325.8,363 L325.7,366.2 L328.2,367.5 L331.9,364.7 L338.3,366.9 L337.9,379.7 L335.4,381.2 L333.5,376 L334.5,380.7 L333,382.6 L330.6,380.1 L333.3,384.5 L332.5,390.5 L329.1,392.7 L326.3,388 L322.2,388 L321.9,383.9 L319.4,384.1 L312.8,376.4 L308.9,376.8 L307.3,374.2 L310.4,372.3 L309.5,369.1 L314.4,367.6 L314.1,363.6 L319.5,361.8 Z", lx: 342, ly: 378 },
  { name: "세종", d: "M190.8,280.7 L199.6,284.6 L197.5,288 L199.1,292.3 L205.9,296.1 L206.3,299.4 L203,300 L200.8,305.4 L195.9,306.6 L192.6,304 L190.7,298.2 L193.2,292.9 L189.8,290.7 L190.2,283.9 L188,282.5 L190.8,280.7 Z", lx: 180, ly: 288 },
];

function getMapFill(score: number): string {
  if (score >= 75) return "rgba(239,68,68,0.55)";
  if (score >= 60) return "rgba(245,158,11,0.5)";
  if (score >= 45) return "rgba(56,189,248,0.4)";
  return "rgba(34,197,94,0.4)";
}

function getMapFillHex(score: number): string {
  if (score >= 75) return "#dc2626";
  if (score >= 60) return "#d97706";
  if (score >= 45) return "#0ea5e9";
  return "#16a34a";
}

function getMapStroke(score: number): string {
  if (score >= 75) return "rgba(239,68,68,0.7)";
  if (score >= 60) return "rgba(245,158,11,0.6)";
  if (score >= 45) return "rgba(56,189,248,0.5)";
  return "rgba(34,197,94,0.5)";
}

interface Props {
  allRegions: RegionRisk[];
  filtered: RegionRisk[];
}

export default function RegionMap({ allRegions, filtered }: Props) {
  const [hovered, setHovered] = useState<RegionRisk | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectRegion = useCallback((name: string | null) => {
    setSelected((prev) => {
      const next = prev === name ? null : name;
      if (next && listRef.current) {
        const el = listRef.current.querySelector(`[data-region="${next}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      return next;
    });
  }, []);

  const lookup = new Map(allRegions.map((r) => [r.name, r]));
  const filteredSet = new Set(filtered.map((r) => r.name));
  const isFiltered = filtered.length !== allRegions.length;
  const sorted = [...filtered].sort((a, b) => b.score - a.score);

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left + 16, y: e.clientY - rect.top - 8 });
  };

  const regionStyle = (name: string) => {
    const region = lookup.get(name);
    const dimmed = isFiltered && !filteredSet.has(name);
    const isSelected = selected === name;
    return {
      fill: region ? getMapFill(region.score) : "#253a54",
      stroke: isSelected
        ? "rgba(165,210,255,0.8)"
        : region
          ? getMapStroke(region.score)
          : "#2f4a6a",
      strokeWidth: isSelected ? "2.5" : undefined,
      opacity: dimmed ? 0.2 : 1,
      filter: isSelected ? "url(#glow)" : undefined,
      className: "map-region",
      onMouseEnter: () => region && setHovered(region),
      onMouseLeave: () => setHovered(null),
      onClick: () => region && selectRegion(name),
    };
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <div
        ref={ref}
        className="panel relative animate-fade-in p-3"
        onMouseMove={handleMove}
      >
        <svg viewBox="100 120 280 470" className="mx-auto h-auto w-full max-h-[540px]">
          <defs>
            <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.72  0 0 0 0 1  0 0 0 0.7 0" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {PROVINCES.map((p) => (
            <path
              key={p.name}
              d={p.d}
              strokeWidth="1.5"
              strokeLinejoin="round"
              {...regionStyle(p.name)}
            />
          ))}
          {CITIES.map((c) => (
            <path
              key={c.name}
              d={c.d}
              strokeWidth="1"
              strokeLinejoin="round"
              {...regionStyle(c.name)}
            />
          ))}
          {/* Ulleungdo & Dokdo (경북 연동) */}
          <rect x="358" y="248" width="10" height="9" rx="2" strokeWidth="1.5" strokeLinejoin="round" {...regionStyle("경북")} />
          <rect x="376" y="253" width="5" height="4" rx="1" strokeWidth="1" strokeLinejoin="round" {...regionStyle("경북")} />
          <text x="363" y="241" textAnchor="middle" dominantBaseline="central" fill="#d4dde8" fontSize="7" fontWeight="600" stroke="#0f1d2e" strokeWidth="2" paintOrder="stroke" className="pointer-events-none select-none">울릉도</text>
          <text x="378.5" y="248" textAnchor="middle" dominantBaseline="central" fill="#d4dde8" fontSize="6" fontWeight="600" stroke="#0f1d2e" strokeWidth="2" paintOrder="stroke" className="pointer-events-none select-none">독도</text>
          {[...PROVINCES, ...CITIES].map((item) => {
            const dimmed = isFiltered && !filteredSet.has(item.name);
            if (dimmed) return null;
            return (
              <text
                key={`lbl-${item.name}`}
                x={item.lx}
                y={item.ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#d4dde8"
                fontSize="10"
                fontWeight="600"
                stroke="#0f1d2e"
                strokeWidth="2.5"
                paintOrder="stroke"
                className="pointer-events-none select-none"
              >
                {item.name}
              </text>
            );
          })}
        </svg>

        {hovered && (
          <div className="map-tooltip" style={{ left: pos.x, top: pos.y }}>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: getMapFillHex(hovered.score) }}
              />
              <span className="font-semibold text-foreground">
                {hovered.name}
              </span>
              <span className="font-bold" style={{ color: getMapFillHex(hovered.score) }}>
                {hovered.score}점
              </span>
            </div>
            <p className="mt-1 text-xs text-text-muted">{hovered.topIssue}</p>
            <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
              {hovered.trend === "up" ? (
                <TrendingUp size={11} className="text-red-400" />
              ) : hovered.trend === "down" ? (
                <TrendingDown size={11} className="text-emerald-400" />
              ) : (
                <Minus size={11} />
              )}
              <span>{getRiskLabel(getScoreLevel(hovered.score))}</span>
            </div>
          </div>
        )}
      </div>

      <div ref={listRef} className="space-y-2 lg:max-h-[580px] lg:overflow-y-auto lg:pr-1">
        {sorted.length === 0 ? (
          <div className="panel py-12 text-center text-sm text-text-muted">
            해당 등급의 지역이 없습니다.
          </div>
        ) : (
          sorted.map((region) => {
            const color = getMapFillHex(region.score);
            const level = getScoreLevel(region.score);
            const TrendIcon =
              region.trend === "up"
                ? TrendingUp
                : region.trend === "down"
                  ? TrendingDown
                  : Minus;

            return (
              <div
                key={region.name}
                data-region={region.name}
                className={`panel px-4 py-3 transition cursor-pointer ${
                  selected === region.name
                    ? "ring-1 ring-accent-blue/50"
                    : ""
                }`}
                onClick={() => selectRegion(region.name)}
                onMouseEnter={() => setHovered(region)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <h3 className="text-sm font-semibold text-foreground">
                      {region.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendIcon
                      size={14}
                      className={
                        region.trend === "up"
                          ? "text-red-400"
                          : region.trend === "down"
                            ? "text-emerald-400"
                            : "text-text-muted"
                      }
                    />
                    <span className="text-xl font-bold" style={{ color }}>
                      {region.score}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-bright">
                    <div
                      className="h-full rounded-full gauge-animate"
                      style={{
                        width: `${region.score}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-text-muted">{region.topIssue}</span>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: color + "18", color }}
                  >
                    {getRiskLabel(level)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
