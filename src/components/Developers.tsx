"use client";

import { useLang } from "@/i18n";
import McpConnect from "./McpConnect";

const endpoints = [
  {
    method: "GET",
    path: "/api/v1/shortages/search?q=salbutamol&limit=3",
    desc: "Search 24,377 shortage reports by brand name, DIN, or company. Filterable by company, ATC level 1, Tier 3, and status",
    response: `{
  "total": 73,
  "page": 1,
  "limit": 3,
  "hits": [
    {
      "report_id": "97054",
      "din": "02245669",
      "brand_name": "APO-SALBUTAMOL HFA",
      "company_canonical": "APOTEX INC",
      "status": "Resolved",
      "atc_code": "R03AC",
      "duration_days": 60.0,
      "tier3": false
    }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/companies/tier3",
    desc: "The Tier 3 critical-shortage company ranking with top-3 and top-5 concentration shares",
    response: `{
  "total": 59,
  "open": 24,
  "top3_share": 0.4915,
  "companies": [
    { "company": "TEVA CANADA LIMITED", "tier3_reports": 13 },
    { "company": "PFIZER CANADA ULC", "tier3_reports": 9 },
    { "company": "PHARMASCIENCE INC", "tier3_reports": 7 }
  ]
}`,
  },
  {
    method: "GET",
    path: "/api/v1/trends",
    desc: "Quarterly series 2020-Q1 to 2025-Q4: new Tier 3 reports and all new reports per quarter",
    response: `{
  "quarterly": [
    { "quarter": "2020-Q1", "tier3_new": 0, "all_new": 680 },
    { "quarter": "2025-Q4", "tier3_new": 3, "all_new": 345 }
  ]
}`,
  },
];

export default function Developers() {
  const { t } = useLang();
  return (
    <section id="developers" className="bg-ink text-white">
      <div className="mx-auto max-w-[1392px] px-6 py-20 md:py-28">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">{t.developers.kicker}</p>
        <h2 className="display mt-4 max-w-[720px] text-[40px] md:text-[52px]">{t.developers.title}</h2>
        <p className="mt-5 max-w-[720px] text-[18px] leading-relaxed text-white/70">{t.developers.body}</p>

        <h3 className="mt-14 text-[13px] font-semibold uppercase tracking-[0.12em] text-white/60">{t.developers.endpoints}</h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {endpoints.map((e) => (
            <article key={e.path} className="flex min-w-0 flex-col rounded-[24px] border border-white/15 bg-white/5 p-6">
              <p className="font-mono text-[12px] font-semibold text-white/60">{e.method}</p>
              <code className="mt-1 break-all font-mono text-[13px] text-white">{e.path}</code>
              <p className="mt-2 text-[14px] text-white/65">{e.desc}</p>
              <pre className="mt-4 flex-1 overflow-x-auto rounded-[16px] bg-black/40 p-4 font-mono text-[12px] leading-relaxed text-white/80">
                {e.response}
              </pre>
              <a
                href={e.path}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block self-start rounded-full border border-white/25 px-5 py-2 text-[14px] font-semibold hover:border-white"
              >
                {t.developers.tryIt} →
              </a>
            </article>
          ))}
        </div>

        <div className="mt-8">
          <a href="/api/openapi.json" target="_blank" rel="noreferrer" className="block rounded-[24px] bg-white/[0.06] p-6 hover:bg-white/[0.09]">
            <h4 className="text-[19px] font-semibold">{t.developers.openapi}</h4>
            <code className="mt-2 block font-mono text-[13px] text-white/60">GET /api/openapi.json</code>
          </a>
        </div>

        <McpConnect
          config={{
            slug: "drug-shortages-ranked",
            displayName: "Drug Shortages, Ranked",
            exampleEn: 'Rank companies by Tier 3 critical shortage reports and show me the top 3',
            exampleFr: 'Classe les entreprises par rapports de pénurie critique de niveau 3 et montre-moi les 3 premières',
          }}
        />
      </div>
    </section>
  );
}
