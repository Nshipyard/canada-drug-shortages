// Data access for canada-drug-shortages. All numbers come from the computed
// JSON files in src/lib (built from the monthly Health Product Shortages
// Canada extract, archived 2025-12-20, reference date 2025-12-01).
import fs from "fs";
import path from "path";

const LIB = path.join(process.cwd(), "src", "lib");

function read<T>(name: string): T {
  return JSON.parse(fs.readFileSync(path.join(LIB, name), "utf8")) as T;
}

export interface Insights {
  vintage: string;
  total_shortage_reports: number;
  total_discontinuation_reports: number;
  open_shortages: number;
  open_actual: number;
  open_anticipated: number;
  resolved: number;
  avoided: number;
  tier3_total: number;
  tier3_open: number;
  tier3_by_year: Record<string, number>;
  tier3_top3_share: number;
  tier3_top5_share: number;
  tier3_top3_companies: string[];
  companies_total: number;
  median_resolved_duration_days: number;
  mean_resolved_duration_days: number;
  resolved_with_duration: number;
  open_median_days_running: number;
  longest_resolved_days: number;
  date_range: { first_start: string; last_updated: string };
}

export interface CompanyRow {
  company: string;
  reports: number;
  tier3_reports: number;
  open_reports: number;
  shortage_days: number;
  median_duration_days: number | null;
}

export interface Atc1Row {
  atc1: string;
  name: string;
  reports: number;
  tier3_reports: number;
  open_reports: number;
  shortage_days: number;
  companies: number;
}

export interface Atc2Row {
  atc2: string;
  description: string;
  reports: number;
  tier3_reports: number;
  open_reports: number;
}

export interface QuarterRow {
  quarter: string;
  tier3_new: number;
  all_new: number;
}

export interface Report {
  report_id: string;
  din: string;
  report_type: string;
  brand_name: string;
  company_raw: string;
  company_canonical: string;
  common_name: string;
  ingredients: string;
  strengths: string;
  status: string;
  atc_code: string;
  atc_description: string;
  atc1: string;
  atc2: string;
  actual_start: string;
  actual_end: string;
  date_created: string;
  date_updated: string;
  tier3_raw: string;
  duration_days: number | null;
  is_open: boolean;
  tier3: boolean;
}

const cache = new Map<string, unknown>();

function load<T>(name: string): T {
  if (!cache.has(name)) cache.set(name, read<T>(name));
  return cache.get(name) as T;
}

export function getInsights(): Insights {
  return load<Insights>("insights.json");
}
export function getReports(): Report[] {
  return load<Report[]>("reports.json");
}
export function getCompanies(): { all: CompanyRow[]; tier3: CompanyRow[] } {
  return load<{ all: CompanyRow[]; tier3: CompanyRow[] }>("companies.json");
}
export function getTrends(): { quarterly: QuarterRow[] } {
  return load<{ quarterly: QuarterRow[] }>("trends.json");
}
export function getAtc(): { atc1: Atc1Row[]; atc2_top30: Atc2Row[] } {
  return load<{ atc1: Atc1Row[]; atc2_top30: Atc2Row[] }>("atc.json");
}

/** Normalize registry status to explorer slugs. */
export function statusSlug(status: string): "open" | "anticipated" | "avoided" | "resolved" | "unknown" {
  switch (status) {
    case "Actual shortage":
      return "open";
    case "Anticipated shortage":
      return "anticipated";
    case "Avoided shortage":
      return "avoided";
    case "Resolved":
      return "resolved";
    default:
      return "unknown";
  }
}

export interface SearchParams {
  q?: string;
  company?: string;
  atc1?: string;
  tier3?: boolean;
  status?: "open" | "anticipated" | "avoided" | "resolved";
  page: number;
  limit: number;
}

export function searchReports(p: SearchParams): { total: number; page: number; limit: number; hits: Report[] } {
  const q = (p.q ?? "").trim().toLowerCase();
  const company = (p.company ?? "").trim();
  const atc1 = (p.atc1 ?? "").trim().toUpperCase();
  const reports = getReports();
  const out: Report[] = [];
  for (const r of reports) {
    if (p.tier3 === true && !r.tier3) continue;
    if (p.tier3 === false && r.tier3) continue;
    if (p.status && statusSlug(r.status) !== p.status) continue;
    if (company && r.company_canonical !== company) continue;
    if (atc1 && r.atc1 !== atc1) continue;
    if (q) {
      const hay = `${r.brand_name} ${r.din} ${r.company_canonical} ${r.common_name} ${r.report_id}`.toLowerCase();
      if (!hay.includes(q)) continue;
    }
    out.push(r);
  }
  const total = out.length;
  const start = (p.page - 1) * p.limit;
  return { total, page: p.page, limit: p.limit, hits: out.slice(start, start + p.limit) };
}

export function lookupReport(idOrDin: string): Report | null {
  const key = idOrDin.trim().toLowerCase();
  const reports = getReports();
  for (const r of reports) {
    if (r.report_id.toLowerCase() === key || r.din.toLowerCase() === key) return r;
  }
  return null;
}

/** Ranked companies, by tier3_reports, reports, or shortage_days. */
export function rankedCompanies(sort: "tier3" | "reports" | "days" = "reports", limit = 20): CompanyRow[] {
  const rows = [...getCompanies().all];
  if (sort === "tier3") rows.sort((a, b) => b.tier3_reports - a.tier3_reports || b.reports - a.reports);
  else if (sort === "days") rows.sort((a, b) => b.shortage_days - a.shortage_days);
  else rows.sort((a, b) => b.reports - a.reports);
  return rows.slice(0, limit);
}

/** ATC level-1 names in EN and FR. U keeps the computed label from data. */
export const ATC_NAMES: Record<string, { en: string; fr: string }> = {
  A: { en: "Alimentary tract and metabolism", fr: "Voies digestives et métabolisme" },
  B: { en: "Blood and blood forming organs", fr: "Sang et organes hématopoïétiques" },
  C: { en: "Cardiovascular system", fr: "Système cardiovasculaire" },
  D: { en: "Dermatologicals", fr: "Dermatologie" },
  G: { en: "Genito-urinary system and sex hormones", fr: "Appareil génito-urinaire et hormones sexuelles" },
  H: { en: "Systemic hormonal preparations", fr: "Préparations hormonales systémiques" },
  J: { en: "Antiinfectives for systemic use", fr: "Anti-infectieux à usage systémique" },
  L: { en: "Antineoplastic and immunomodulating agents", fr: "Antinéoplasiques et immunomodulateurs" },
  M: { en: "Musculo-skeletal system", fr: "Système musculo-squelettique" },
  N: { en: "Nervous system", fr: "Système nerveux" },
  P: { en: "Antiparasitic products", fr: "Antiparasitaires" },
  R: { en: "Respiratory system", fr: "Système respiratoire" },
  S: { en: "Sensory organs", fr: "Organes sensoriels" },
  V: { en: "Various", fr: "Divers" },
};
