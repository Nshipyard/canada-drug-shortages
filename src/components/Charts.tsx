"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n";

const RED = "#d80621";
const RED_DARK = "#a80419";
const INK = "#0a0f1e";
const GRID = "rgba(10,15,30,0.08)";

interface QuarterRow {
  quarter: string;
  tier3_new: number;
  all_new: number;
}
interface CompanyRow {
  company: string;
  tier3_reports: number;
}
interface Atc1Row {
  atc1: string;
  name: string;
  reports: number;
  tier3_reports: number;
}

const DISPLAY_NAME: Record<string, string> = {
  "TEVA CANADA LIMITED": "Teva Canada",
  "PFIZER CANADA ULC": "Pfizer Canada ULC",
  "PHARMASCIENCE INC": "Pharmascience",
  "APOTEX INC": "Apotex",
  "ASPEN PHARMACARE CANADA INC.": "Aspen Pharmacare",
  "ACCORD HEALTHCARE INC": "Accord Healthcare",
  "FRESENIUS KABI CANADA LTD": "Fresenius Kabi",
  "BAXTER CORPORATION": "Baxter",
  "MINT PHARMACEUTICALS INC": "Mint Pharmaceuticals",
  "SEARCHLIGHT PHARMA INC": "Searchlight Pharma",
};

function displayCompany(c: string) {
  return DISPLAY_NAME[c] ?? c;
}

const ATC_FR: Record<string, string> = {
  A: "Digestif et métabolisme",
  B: "Sang et organes hématopoïétiques",
  C: "Système cardiovasculaire",
  D: "Dermatologie",
  G: "Génito-urinaire",
  H: "Hormones systémiques",
  J: "Anti-infectieux systémiques",
  L: "Antinéoplasiques",
  M: "Système musculo-squelettique",
  N: "Système nerveux",
  P: "Antiparasitaires",
  R: "Système respiratoire",
  S: "Organes sensoriels",
  V: "Divers",
  U: "Non classé (UNASS)",
};

function ChartShell({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <div className="rounded-[28px] border border-line bg-paper p-6 md:p-10">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">{children}</div>
      </div>
      <p className="mt-4 max-w-[760px] text-[13px] leading-relaxed text-ink/55">{caption}</p>
    </div>
  );
}

/** Tier 3 quarterly timeline: bars for Tier 3, line for all new reports. */
function Timeline({ rows }: { rows: QuarterRow[] }) {
  const { t } = useLang();
  const W = 1000;
  const H = 360;
  const PL = 48;
  const PR = 64;
  const PT = 20;
  const PB = 56;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;
  const maxTier = Math.max(1, ...rows.map((r) => r.tier3_new));
  const maxAll = Math.max(1, ...rows.map((r) => r.all_new));
  const bw = innerW / rows.length;
  const yT = (v: number) => PT + innerH - (v / maxTier) * innerH;
  const yA = (v: number) => PT + innerH - (v / maxAll) * innerH;
  const linePts = rows
    .map((r, i) => `${(PL + i * bw + bw / 2).toFixed(1)},${yA(r.all_new).toFixed(1)}`)
    .join(" ");
  const tierTicks = Array.from({ length: maxTier + 1 }, (_, i) => i);
  const allTicks = [0, Math.round(maxAll / 2), maxAll];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={t.charts.c1Title}>
      {tierTicks.map((v) => (
        <g key={v}>
          <line x1={PL} x2={W - PR} y1={yT(v)} y2={yT(v)} stroke={GRID} strokeWidth={1} />
          <text x={PL - 10} y={yT(v) + 4} textAnchor="end" fontSize={12} fill={INK} opacity={0.55}>
            {v}
          </text>
        </g>
      ))}
      {allTicks.map((v) => (
        <text key={v} x={W - PR + 10} y={yA(v) + 4} fontSize={12} fill={RED_DARK} opacity={0.75}>
          {v.toLocaleString("en-CA")}
        </text>
      ))}
      {rows.map((r, i) => (
        <g key={r.quarter}>
          {r.tier3_new > 0 && (
            <rect
              x={PL + i * bw + bw * 0.18}
              y={yT(r.tier3_new)}
              width={bw * 0.64}
              height={PT + innerH - yT(r.tier3_new)}
              rx={2}
              fill={RED}
            />
          )}
          {i % 4 === 0 && (
            <text x={PL + i * bw + bw / 2} y={H - PB + 26} textAnchor="middle" fontSize={12} fill={INK} opacity={0.55}>
              {r.quarter}
            </text>
          )}
        </g>
      ))}
      <polyline points={linePts} fill="none" stroke={INK} strokeWidth={2} opacity={0.7} />
      <g transform={`translate(${PL}, ${H - 12})`}>
        <rect x={0} y={-11} width={14} height={14} rx={3} fill={RED} />
        <text x={20} y={0} fontSize={13} fill={INK}>
          {t.charts.c1LegendTier3}
        </text>
        <line x1={280} x2={300} y1={-4} y2={-4} stroke={INK} strokeWidth={2} opacity={0.7} />
        <text x={308} y={0} fontSize={13} fill={INK}>
          {t.charts.c1LegendAll}
        </text>
      </g>
    </svg>
  );
}

/** Company Tier 3 ranking, top 10 horizontal bars. */
function CompanyBars({ rows }: { rows: CompanyRow[] }) {
  const top = rows.slice(0, 10);
  const max = Math.max(1, ...top.map((r) => r.tier3_reports));
  const W = 1000;
  const rowH = 48;
  const H = top.length * rowH + 30;
  const labelW = 300;
  const valW = 60;
  const barMax = W - labelW - valW - 20;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      {top.map((r, i) => {
        const y = i * rowH;
        const w = Math.max(3, (r.tier3_reports / max) * barMax);
        return (
          <g key={r.company}>
            <text x={0} y={y + 26} fontSize={15} fill={INK}>
              <tspan fill={INK} opacity={0.45} fontSize={13} fontFamily="monospace">
                {i + 1}
              </tspan>
              <tspan dx={10}>{displayCompany(r.company)}</tspan>
            </text>
            <rect x={labelW} y={y + 10} width={w} height={20} rx={10} fill={i < 3 ? RED : RED} opacity={i < 3 ? 1 : 0.45} />
            <text x={labelW + w + 10} y={y + 26} fontSize={15} fontWeight={700} fill={RED_DARK}>
              {r.tier3_reports}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** ATC class comparison: total reports bar + Tier 3 bar (own scale) per class. */
function AtcBars({ rows, lang }: { rows: Atc1Row[]; lang: string }) {
  const { t } = useLang();
  const list = rows.filter((r) => r.reports > 0);
  const maxRep = Math.max(1, ...list.map((r) => r.reports));
  const maxT3 = Math.max(1, ...list.map((r) => r.tier3_reports));
  const W = 1000;
  const rowH = 46;
  const H = list.length * rowH + 44;
  const labelW = 320;
  const repW = 250;
  const gutter = 70;
  const t3X = labelW + repW + gutter;
  const t3W = 230;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img">
      <text x={labelW} y={20} fontSize={12} fill={INK} opacity={0.55}>
        {t.charts.reports}
      </text>
      <text x={t3X} y={20} fontSize={12} fill={RED_DARK} opacity={0.8}>
        {t.charts.tier3}
      </text>
      {list.map((r, i) => {
        const y = 30 + i * rowH;
        const wRep = Math.max(3, (r.reports / maxRep) * repW);
        const wT3 = (r.tier3_reports / maxT3) * t3W;
        const label = lang === "fr" ? ATC_FR[r.atc1] ?? r.name : r.name;
        return (
          <g key={r.atc1}>
            <text x={0} y={y + 18} fontSize={13} fill={INK}>
              <tspan fontFamily="monospace" fill={INK} opacity={0.45} fontSize={12}>
                {r.atc1}
              </tspan>
              <tspan dx={10}>{label}</tspan>
            </text>
            <rect x={labelW} y={y + 4} width={wRep} height={16} rx={8} fill={INK} opacity={0.18} />
            <text x={labelW + wRep + 8} y={y + 17} fontSize={13} fill={INK} opacity={0.6}>
              {r.reports.toLocaleString(lang === "fr" ? "fr-CA" : "en-CA")}
            </text>
            {r.tier3_reports > 0 && (
              <>
                <rect x={t3X} y={y + 4} width={Math.max(6, wT3)} height={16} rx={8} fill={RED} />
                <text x={t3X + Math.max(6, wT3) + 8} y={y + 17} fontSize={13} fontWeight={700} fill={RED_DARK}>
                  {r.tier3_reports}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function Charts() {
  const { t, lang } = useLang();
  const [quarters, setQuarters] = useState<QuarterRow[]>([]);
  const [tier3, setTier3] = useState<CompanyRow[]>([]);
  const [atcs, setAtcs] = useState<Atc1Row[]>([]);

  useEffect(() => {
    fetch("/api/v1/trends").then((r) => r.json()).then((d) => setQuarters(d.quarterly ?? []));
    fetch("/api/v1/companies/tier3").then((r) => r.json()).then((d) => setTier3(d.companies ?? []));
    fetch("/api/v1/atc").then((r) => r.json()).then((d) => setAtcs(d.atc1 ?? []));
  }, []);

  if (quarters.length === 0 || tier3.length === 0 || atcs.length === 0) return null;

  return (
    <section id="charts" className="bg-paper-warm">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-canada">{t.charts.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.charts.title}</h2>
        <p className="mt-5 max-w-[720px] text-[18px] leading-relaxed text-ink/70">{t.charts.body}</p>

        <div className="mt-10">
          <h3 className="display max-w-[800px] text-[26px] leading-tight md:text-[32px]">{t.charts.c1Title}</h3>
          <div className="mt-5">
            <ChartShell caption={t.charts.c1Note}>
              <Timeline rows={quarters} />
            </ChartShell>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="display max-w-[800px] text-[26px] leading-tight md:text-[32px]">{t.charts.c2Title}</h3>
          <div className="mt-5">
            <ChartShell caption={t.charts.c2Note}>
              <CompanyBars rows={tier3} />
            </ChartShell>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="display max-w-[800px] text-[26px] leading-tight md:text-[32px]">{t.charts.c3Title}</h3>
          <div className="mt-5">
            <ChartShell caption={t.charts.c3Note}>
              <AtcBars rows={atcs} lang={lang} />
            </ChartShell>
          </div>
        </div>
      </div>
    </section>
  );
}
