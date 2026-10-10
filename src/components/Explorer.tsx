"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/i18n";

interface Hit {
  report_id: string;
  din: string;
  brand_name: string;
  company_canonical: string;
  status: string;
  atc_code: string;
  atc1: string;
  actual_start: string;
  duration_days: number | null;
  tier3: boolean;
}

interface SearchResponse {
  total: number;
  page: number;
  limit: number;
  hits: Hit[];
}

function fmt(n: number, lang: string) {
  return n.toLocaleString(lang === "fr" ? "fr-CA" : "en-CA");
}

function shortCompany(c: string) {
  if (!c) return c;
  return c
    .replace(/\s+(INC|LTD|LLC|CORP|CORPORATION|ULC|LIMITED|GMBH|S\.?A\.?|S\.?E\.?C\.?|LP)$/i, "")
    .trim();
}

export default function Explorer() {
  const { t, lang } = useLang();
  const e = t.explorer;
  const [q, setQ] = useState("");
  const [company, setCompany] = useState("");
  const [atc1, setAtc1] = useState("");
  const [tier3Only, setTier3Only] = useState(false);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [res, setRes] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<{ company: string; reports: number }[]>([]);
  const [atcs, setAtcs] = useState<{ atc1: string; name: string; reports: number }[]>([]);

  useEffect(() => {
    fetch("/api/v1/companies?sort=reports&limit=239")
      .then((r) => r.json())
      .then((d) => setCompanies(d.companies ?? []));
    fetch("/api/v1/atc")
      .then((r) => r.json())
      .then((d) => setAtcs(d.atc1 ?? []));
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (q.trim()) params.set("q", q.trim());
      if (company) params.set("company", company);
      if (atc1) params.set("atc1", atc1);
      if (tier3Only) params.set("tier3", "true");
      if (status) params.set("status", status);
      fetch(`/api/v1/shortages/search?${params}`)
        .then((r) => r.json())
        .then((d) => setRes(d))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(id);
  }, [q, company, atc1, tier3Only, status, page]);

  const totalPages = res ? Math.max(1, Math.ceil(res.total / res.limit)) : 1;

  function setFilter(setter: (v: string) => void, v: string) {
    setter(v);
    setPage(1);
  }

  return (
    <div>
      <input
        value={q}
        onChange={(ev) => setFilter(setQ, ev.target.value)}
        placeholder={e.search}
        className="w-full rounded-full border border-line bg-paper px-6 py-3.5 text-[16px] outline-none placeholder:text-ink/35 focus:border-canada"
        aria-label={e.search}
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          value={company}
          onChange={(ev) => setFilter(setCompany, ev.target.value)}
          className="max-w-[260px] rounded-full border border-line bg-paper px-5 py-2.5 text-[15px] font-medium outline-none focus:border-canada"
          aria-label={e.companyFilter}
        >
          <option value="">{e.companyFilter}</option>
          {companies.map((c) => (
            <option key={c.company} value={c.company}>
              {shortCompany(c.company)} ({fmt(c.reports, lang)})
            </option>
          ))}
        </select>
        <select
          value={atc1}
          onChange={(ev) => setFilter(setAtc1, ev.target.value)}
          className="max-w-[260px] rounded-full border border-line bg-paper px-5 py-2.5 text-[15px] font-medium outline-none focus:border-canada"
          aria-label={e.atcFilter}
        >
          <option value="">{e.atcFilter}</option>
          {atcs.map((a) => (
            <option key={a.atc1} value={a.atc1}>
              {a.atc1} · {a.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(ev) => setFilter(setStatus, ev.target.value)}
          className="rounded-full border border-line bg-paper px-5 py-2.5 text-[15px] font-medium outline-none focus:border-canada"
          aria-label={e.colStatus}
        >
          <option value="">{e.allStatuses}</option>
          {["open", "anticipated", "avoided", "resolved"].map((s) => (
            <option key={s} value={s}>
              {e.statusNames[s]}
            </option>
          ))}
        </select>
        <button
          onClick={() => { setTier3Only(!tier3Only); setPage(1); }}
          aria-pressed={tier3Only}
          className={`rounded-full border px-5 py-2.5 text-[15px] font-semibold transition-colors ${
            tier3Only ? "border-canada bg-canada text-white" : "border-line bg-paper hover:border-ink"
          }`}
        >
          {e.tier3Toggle}
        </button>
      </div>

      <div className="mt-8">
        {!res && !loading && <p className="max-w-[640px] text-[15px] leading-relaxed text-ink/55">{e.empty}</p>}
        {loading && !res && <p className="text-[15px] text-ink/55">…</p>}
        {res && (
          <>
            <p className="mb-4 text-[14px] text-ink/55">
              {e.showing} {fmt(res.hits.length, lang)} {e.of} {fmt(res.total, lang)}
              {loading && <span> …</span>}
            </p>
            {res.hits.length === 0 && <p className="text-[15px] text-ink/55">{e.noResult}</p>}
            {res.hits.length > 0 && (
              <div className="overflow-x-auto rounded-[24px] border border-line bg-paper">
                <table className="w-full min-w-[880px] text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-line text-[12px] uppercase tracking-[0.08em] text-ink/50">
                      <th className="px-5 py-3.5 font-semibold">{e.colBrand}</th>
                      <th className="px-5 py-3.5 font-semibold">{e.colCompany}</th>
                      <th className="px-5 py-3.5 font-semibold">{e.colDin}</th>
                      <th className="px-5 py-3.5 font-semibold">{e.colAtc}</th>
                      <th className="px-5 py-3.5 font-semibold">{e.colStatus}</th>
                      <th className="px-5 py-3.5 font-semibold">{e.colTier3}</th>
                      <th className="px-5 py-3.5 font-semibold">{e.colStart}</th>
                      <th className="px-5 py-3.5 font-semibold">{e.colDuration}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {res.hits.map((h) => (
                      <tr key={h.report_id} className="border-b border-line/60 last:border-0 hover:bg-ink/[0.02]">
                        <td className="max-w-[280px] px-5 py-3.5 font-medium leading-snug">{h.brand_name}</td>
                        <td className="px-5 py-3.5 text-ink/70">{shortCompany(h.company_canonical)}</td>
                        <td className="px-5 py-3.5 font-mono text-[13px] text-ink/70">{h.din || "-"}</td>
                        <td className="px-5 py-3.5 font-mono text-[13px] text-ink/70">{h.atc_code || "-"}</td>
                        <td className="px-5 py-3.5">
                          <span className="whitespace-nowrap rounded-full bg-ink/5 px-3 py-1 text-[12px] font-medium">
                            {h.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {h.tier3 ? (
                            <span className="whitespace-nowrap rounded-full bg-canada px-3 py-1 text-[12px] font-semibold text-white">
                              {e.tier3Yes}
                            </span>
                          ) : (
                            <span className="text-ink/35">{e.tier3No}</span>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[13px] text-ink/70">{h.actual_start || "-"}</td>
                        <td className="whitespace-nowrap px-5 py-3.5 font-mono text-[13px] text-ink/70">
                          {h.duration_days == null ? "-" : fmt(Math.round(h.duration_days), lang)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="rounded-full border border-line px-5 py-2.5 text-[15px] font-semibold disabled:opacity-40 enabled:hover:border-ink"
              >
                ← {e.pagePrev}
              </button>
              <p className="font-mono text-[13px] text-ink/55">
                {fmt(page, lang)} {e.pageOf} {fmt(totalPages, lang)}
              </p>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="rounded-full border border-line px-5 py-2.5 text-[15px] font-semibold disabled:opacity-40 enabled:hover:border-ink"
              >
                {e.pageNext} →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
