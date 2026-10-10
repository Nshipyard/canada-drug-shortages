#!/usr/bin/env python3
"""
Drug Shortage Chronicity Tracker: data pipeline.
Source: Health Product Shortages Canada monthly bulk extract (en_report_export.zip),
archived 2025-12-20 from www.drugshortagescanada.ca (site moved to healthproductshortages.ca).
Extract date used as the reference "today": 2025-12-01 (max Date Updated in file).

Outputs:
  public/data/shortages_clean.csv      cleaned report-level data
  public/data/discontinuations_clean.csv
  public/data/company_merges.json      entity-resolution log
  public/data/quarantine.json          quarantined rows log
  src/lib/insights.json                headline numbers for the UI
  src/lib/companies.json               company table (rankings)
  src/lib/atc.json                     ATC rollups
  src/lib/trends.json                  quarterly series
"""
import json, os, re
from datetime import date
import pandas as pd
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw")
OUT_DATA = os.path.join(HERE, "..", "public", "data")
OUT_LIB = os.path.join(HERE, "..", "src", "lib")
os.makedirs(OUT_DATA, exist_ok=True)
os.makedirs(OUT_LIB, exist_ok=True)

EXTRACT_DATE = date(2025, 12, 1)
PLACEHOLDER_DATES = {"0001-01-01"}

# ---------------------------------------------------------------- cleaning log
fixes = []            # (problem, fix)
quarantine = []       # dicts describing quarantined rows
merges = []           # entity resolution log

def note_fix(problem, fix):
    fixes.append({"problem": problem, "fix": fix})

def load(path, skip=1):
    df = pd.read_csv(path, skiprows=skip, dtype=str, encoding="utf-8-sig")
    df = df.replace(r"^\s*$", np.nan, regex=True)
    for c in df.columns:
        if df[c].dtype == object:
            df[c] = df[c].str.strip()
    return df

s = load(os.path.join(RAW, "shortage_report_export.csv"))
d = load(os.path.join(RAW, "discontinuation_report_export.csv"))
raw_shortage_rows, raw_disc_rows = len(s), len(d)
note_fix("BOM + disclaimer header row", "utf-8-sig decode, skipped the disclaimer row, stripped whitespace-only cells to null")

# ------------------------------------------------------- company normalization
def canon_company(name):
    if pd.isna(name):
        return None
    n = str(name).strip()
    n = re.sub(r"\s+", " ", n)
    return n.upper()

s["company_raw"] = s["Company Name"].map(canon_company)
d["company_raw"] = d["Company Name"].map(canon_company)
null_co = int(s["company_raw"].isna().sum())
note_fix(f"{null_co} shortage reports with no company name", "excluded from company rankings, kept in the cleaned file with company_canonical=null")

# manual merges: only near-identical strings, logged
MERGE_GROUPS = [
    ["ALK ABELLO A/S", "ALK-ABELLO INC"],
    ["ALLERGAN INC", "ALLERGAN PHARMA CO."],
    ["AVIR PHARMA INC", "AVIR PHARMA INC."],
    ["DR REDDY'S LABORATORIES INC", "DR REDDY'S LABORATORIES LTD", "DR REDDYS LABORATORIES LTD",
     "DR. REDDY'S LABORATORIES CANADA INC.", "DR. REDDY'S LABORATORIES INC"],
    ["EMD SERONO A DIVISION OF EMD INC CANADA", "EMD SERONO, A DIVISION OF EMD INC., CANADA"],
    ["ENDO VENTURES LTD", "ENDO VENTURES LTD."],
    ["GENMED A DIVISION OF PFIZER CANADA INC", "GENMED A DIVISION OF PFIZER CANADA ULC"],
    ["HOSPIRA HEALTHCARE CORPORATION", "HOSPIRA HEALTHCARE ULC"],
    ["JUBILANT DRAXIMAGE INC", "JUBILANT DRAXIMAGE INC. DBA JUBILANT RADIOPHARMA"],
    ["LABORATOIRE RIVA INC", "LABORATOIRE RIVA INC."],
    ["OMEGA LABORATORIES LIMITED", "OMEGA LABORATORIES LTD"],
    ["PALADIN LABS INC", "PALADIN LABS INC."],
    ["PENDOPHARM DIVISION OF DE PHARMASCIENCE INC", "PENDOPHARM DIVISION OF PHARMASCIENCE INC"],
    ["STERINOVA INC", "STERINOVA INC."],
    ["TEVA WOMEN'S HEALTH INC. SUBSIDIARY OF TEVA PHARMACEUTICALS USA INC",
     "TEVA WOMENS HEALTH INC. SUBSIDIARY OF TEVA PHARMACEUTICALS USA INC"],
    ["WOCKHARDT UK LIMITED", "WOCKHARDT UK LTD"],
]
raw_to_canon = {}
for group in MERGE_GROUPS:
    counts = {g: int(((s["company_raw"] == g).sum() + (d["company_raw"] == g).sum())) for g in group}
    canonical = max(counts, key=counts.get)
    for g in group:
        raw_to_canon[g] = canonical
    merges.append({"canonical": canonical, "merged_variants": group, "row_counts": counts,
                   "rule": "near-identical string, punctuation/legal-suffix/apostrophe variant only"})

s["company_canonical"] = s["company_raw"].map(lambda x: raw_to_canon.get(x, x))
d["company_canonical"] = d["company_raw"].map(lambda x: raw_to_canon.get(x, x))
merged_rows = int(s["company_raw"].isin(raw_to_canon).sum() + d["company_raw"].isin(raw_to_canon).sum())
note_fix(f"{len(MERGE_GROUPS)} merge groups collapsing spelling variants ({merged_rows} rows affected)",
         "exact-match union on curated near-identical strings only; distinct legal entities kept separate (e.g. Valneva Austria vs Sweden, Sun Pharma's five entities); every merge logged to company_merges.json")

# ------------------------------------------------------------------ DIN repair
def canon_din(x):
    if pd.isna(x):
        return None
    x = str(x).strip()
    x = re.sub(r"\D", "", x)
    return x.zfill(8) if x else None

s["din"] = s["Drug Identification Number"].map(canon_din)
d["din"] = d["Drug Identification Number"].map(canon_din)
bad_din = int(s["din"].isna().sum())
note_fix(f"{bad_din} shortage rows with missing/unnumeric DINs", "DIN stripped to digits and zero-padded to 8; nulls kept as null, never guessed")

# ------------------------------------------------------------- date handling
def parse_d(x):
    if pd.isna(x):
        return None
    x = str(x).strip()[:10]
    if x in PLACEHOLDER_DATES:
        return None
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", x):
        return None
    try:
        y, m, dd = int(x[:4]), int(x[5:7]), int(x[8:10])
        return date(y, m, dd)
    except ValueError:
        return None

for c, nc in [("Actual start date", "start"), ("Actual end date", "end"),
              ("Anticipated start date", "start_ant"), ("Estimated end date", "end_est"),
              ("Date Created", "created"), ("Date Updated", "updated")]:
    s[nc] = s[c].map(parse_d)
    if c in ("Discontinuation date", "Anticipated discontinuation date"):
        pass

placeholder_hits = int(((s["Actual start date"].astype(str) == "0001-01-01") |
                        (s["Actual end date"].astype(str) == "0001-01-01") |
                        (s["Anticipated start date"].astype(str) == "0001-01-01") |
                        (s["Estimated end date"].astype(str) == "0001-01-01")).sum())
note_fix(f"{placeholder_hits} date cells holding 0001-01-01 placeholders", "treated as missing, never as real dates")

# quarantine: end before start
bad_order = s["start"].notna() & s["end"].notna() & (s["end"] < s["start"])
n_bad_order = int(bad_order.sum())
for rid in s.loc[bad_order, "Report ID"].head(25):
    quarantine.append({"report_id": str(rid), "reason": "actual end date before actual start date",
                       "action": "duration set to null, row kept"})
s.loc[bad_order, ["start", "end"]] = pd.NA
note_fix(f"{n_bad_order} reports where the actual end date predates the actual start",
         "quarantined from duration math (duration=null), row kept and flagged")

# ------------------------------------------------------------------ durations
def to_date(x):
    return x if isinstance(x, date) else None

s["start_d"] = s["start"].map(to_date)
s["end_d"] = s["end"].map(to_date)

def duration_days(row):
    st = row["start_d"]
    if st is None:
        return None
    if row["end_d"] is not None:
        en = min(row["end_d"], EXTRACT_DATE)
        return max((en - st).days, 0)
    if row["Shortage status"] in ("Actual shortage", "Anticipated shortage"):
        return (EXTRACT_DATE - st).days if st <= EXTRACT_DATE else 0
    return None

s["duration_days"] = s.apply(duration_days, axis=1)
s["is_open"] = s["Shortage status"].isin(["Actual shortage", "Anticipated shortage"])
s["tier3"] = s["Tier 3"] == "Yes"

# ------------------------------------------------------------------- ATC
def atc_parts(code):
    if pd.isna(code):
        return (None, None, None)
    c = str(code).strip().upper()
    if not re.match(r"^[A-Z]", c):
        return (None, None, None)
    return (c[0], c[:3] if len(c) >= 3 else None, c)

s[["atc1", "atc2", "atc_full"]] = pd.DataFrame(s["ATC Code"].map(atc_parts).tolist(), index=s.index)
null_atc = int(s["atc1"].isna().sum())
note_fix(f"{null_atc} shortage reports with no usable ATC code (blank or non-letter start)",
         "excluded from ATC rollups, kept in the file with atc1=null")

ATC1_NAMES = {
    "A": "Alimentary tract and metabolism", "B": "Blood and blood forming organs",
    "C": "Cardiovascular system", "D": "Dermatologicals", "G": "Genito-urinary system and sex hormones",
    "H": "Systemic hormonal preparations", "J": "Antiinfectives for systemic use",
    "L": "Antineoplastic and immunomodulating agents", "M": "Musculo-skeletal system",
    "N": "Nervous system", "P": "Antiparasitic products", "R": "Respiratory system",
    "S": "Sensory organs", "V": "Various",
}

# ------------------------------------------------------------ cleaned outputs
s_out = s[["Report ID", "din", "Report Type", "Brand name", "company_raw", "company_canonical",
           "Common or Proper name", "Ingredients", "Strength(s)", "Shortage status",
           "ATC Code", "ATC description", "atc1", "atc2", "Actual start date", "Actual end date",
           "Date Created", "Date Updated", "Tier 3", "duration_days", "is_open"]].copy()
s_out.columns = ["report_id", "din", "report_type", "brand_name", "company_raw", "company_canonical",
                 "common_name", "ingredients", "strengths", "status", "atc_code", "atc_description",
                 "atc1", "atc2", "actual_start", "actual_end", "date_created", "date_updated",
                 "tier3_raw", "duration_days", "is_open"]
s_out["tier3"] = s["tier3"]
s_out.to_csv(os.path.join(OUT_DATA, "shortages_clean.csv"), index=False)

d["disc_start"] = d["Discontinuation date"].map(parse_d)
d_out = d[["Report ID", "din", "Brand name", "company_raw", "company_canonical",
           "Discontinuation status", "ATC Code", "ATC description",
           "Discontinuation date", "Date Created", "Date Updated", "Tier 3"]].copy()
d_out.columns = ["report_id", "din", "brand_name", "company_raw", "company_canonical",
                 "status", "atc_code", "atc_description", "discontinuation_date",
                 "date_created", "date_updated", "tier3_raw"]
d_out.to_csv(os.path.join(OUT_DATA, "discontinuations_clean.csv"), index=False)

with open(os.path.join(OUT_DATA, "company_merges.json"), "w") as f:
    json.dump(merges, f, indent=2, ensure_ascii=False)
with open(os.path.join(OUT_DATA, "quarantine.json"), "w") as f:
    json.dump(quarantine, f, indent=2)
with open(os.path.join(OUT_DATA, "cleaning_fixes.json"), "w") as f:
    json.dump(fixes, f, indent=2, ensure_ascii=False)

# ----------------------------------------------------------------- insights
open_s = s[s["is_open"]]
resolved = s[s["Shortage status"] == "Resolved"]

def qstr(dt):
    return f"{dt.year}-Q{(dt.month - 1)//3 + 1}" if dt else None

s["quarter"] = s["start_d"].map(qstr)

# Tier 3 trend by quarter of actual start
t3q = s[s["tier3"] & s["start_d"].notna()].groupby("quarter").size()
allq = s[s["start_d"].notna()].groupby("quarter").size()
quarters = sorted(set(t3q.index) | set(allq.index))
tier3_trend = [{"quarter": q, "tier3_new": int(t3q.get(q, 0)), "all_new": int(allq.get(q, 0))} for q in quarters]
tier3_trend = [t for t in tier3_trend if t["quarter"] >= "2020-Q1"]

t3_by_year = s[s["tier3"]].copy()
t3_by_year["yr"] = t3_by_year["created"].map(lambda x: x.year if x else None)
t3_year = t3_by_year.groupby("yr").size().to_dict()

# company rankings
def company_table(df, tier_only=False):
    g = df.groupby("company_canonical", dropna=False)
    rows = []
    for name, grp in g:
        if pd.isna(name):
            continue
        rows.append({
            "company": name,
            "reports": int(len(grp)),
            "tier3_reports": int(grp["tier3"].sum()),
            "open_reports": int(grp["is_open"].sum()),
            "shortage_days": int(grp["duration_days"].dropna().sum()),
            "median_duration_days": float(grp["duration_days"].dropna().median()) if grp["duration_days"].notna().any() else None,
        })
    return sorted(rows, key=lambda r: (-r["reports"]))

companies = company_table(s)
t3_companies = sorted([c for c in companies if c["tier3_reports"] > 0],
                      key=lambda r: (-r["tier3_reports"], -r["reports"]))
t3_total = int(s["tier3"].sum())
top3_t3 = sum(c["tier3_reports"] for c in t3_companies[:3])
top5_t3 = sum(c["tier3_reports"] for c in t3_companies[:5])

# ATC1 rollup
atc1_rows = []
for code, grp in s[s["atc1"].notna()].groupby("atc1"):
    atc1_rows.append({
        "atc1": code,
        "name": ATC1_NAMES.get(code, code),
        "reports": int(len(grp)),
        "tier3_reports": int(grp["tier3"].sum()),
        "open_reports": int(grp["is_open"].sum()),
        "shortage_days": int(grp["duration_days"].dropna().sum()),
        "companies": int(grp["company_canonical"].nunique()),
    })
atc1_rows.sort(key=lambda r: -r["reports"])

# ATC2 rollup (for heatmap), top 30
atc2_rows = []
for code, grp in s[s["atc2"].notna()].groupby("atc2"):
    desc = grp["ATC description"].dropna().mode()
    atc2_rows.append({
        "atc2": code,
        "description": str(desc.iloc[0]) if len(desc) else code,
        "reports": int(len(grp)),
        "tier3_reports": int(grp["tier3"].sum()),
        "open_reports": int(grp["is_open"].sum()),
    })
atc2_rows.sort(key=lambda r: -r["reports"])

# duration stats
res_dur = resolved["duration_days"].dropna()
disc_counts = d.groupby("company_canonical").size().sort_values(ascending=False).head(10).to_dict()

insights = {
    "vintage": "Monthly bulk extract archived 2025-12-20 (source: drugshortagescanada.ca, now healthproductshortages.ca); reference date 2025-12-01",
    "total_shortage_reports": int(len(s)),
    "total_discontinuation_reports": int(len(d)),
    "open_shortages": int(open_s["is_open"].sum()),
    "open_actual": int((s["Shortage status"] == "Actual shortage").sum()),
    "open_anticipated": int((s["Shortage status"] == "Anticipated shortage").sum()),
    "resolved": int((s["Shortage status"] == "Resolved").sum()),
    "avoided": int((s["Shortage status"] == "Avoided shortage").sum()),
    "tier3_total": t3_total,
    "tier3_open": int(((s["tier3"]) & (s["is_open"])).sum()),
    "tier3_by_year": {str(k): int(v) for k, v in sorted(t3_year.items()) if k},
    "tier3_top3_share": round(top3_t3 / t3_total, 4) if t3_total else 0,
    "tier3_top5_share": round(top5_t3 / t3_total, 4) if t3_total else 0,
    "tier3_top3_companies": [c["company"] for c in t3_companies[:3]],
    "companies_total": int(s["company_canonical"].nunique()),
    "median_resolved_duration_days": float(res_dur.median()),
    "mean_resolved_duration_days": round(float(res_dur.mean()), 1),
    "resolved_with_duration": int(res_dur.count()),
    "open_median_days_running": float(open_s["duration_days"].dropna().median()),
    "longest_resolved_days": int(res_dur.max()),
    "date_range": {"first_start": str(s["start_d"].dropna().min()), "last_updated": str(s["updated"].dropna().max())},
}

with open(os.path.join(OUT_LIB, "insights.json"), "w") as f:
    json.dump(insights, f, indent=2)
with open(os.path.join(OUT_LIB, "companies.json"), "w") as f:
    json.dump({"all": companies, "tier3": t3_companies,
               "discontinuations_top10": [{"company": k, "reports": int(v)} for k, v in disc_counts.items()]}, f, indent=2)
with open(os.path.join(OUT_LIB, "atc.json"), "w") as f:
    json.dump({"atc1": atc1_rows, "atc2_top30": atc2_rows[:30]}, f, indent=2)
with open(os.path.join(OUT_LIB, "trends.json"), "w") as f:
    json.dump({"quarterly": tier3_trend}, f, indent=2)

# explorer payload: compact JSON (report-level, needed fields)
exp = s_out.copy()
exp["duration_days"] = exp["duration_days"].where(exp["duration_days"].notna(), None)
exp = exp.where(exp.notna(), None)
exp.to_json(os.path.join(OUT_LIB, "reports.json"), orient="records")

print(json.dumps(insights, indent=2))
print("\nTop 8 Tier3 companies:", [(c["company"], c["tier3_reports"]) for c in t3_companies[:8]])
print("\nTop 8 ATC1:", [(r["atc1"], r["name"], r["reports"], r["tier3_reports"]) for r in atc1_rows[:8]])
print("\nTop 10 companies by reports:", [(c["company"], c["reports"]) for c in companies[:10]])
print("\nQuarantined:", len(quarantine), "| merges:", len(merges))
