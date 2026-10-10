# Drug Shortages, Ranked (SKILL.md)

## What this skill covers

The canada-drug-shortages project: Canada's drug shortage registry (24,377 shortage reports, Health Product Shortages Canada extract archived 2025-12-20, reference date 2025-12-01) normalized, ranked, and served over REST and MCP. Use this skill whenever answering a question about drug shortages in Canada, company chronicity, Tier 3 critical shortages, duration stats, or ATC class patterns.

## What the data answers

- Which companies file the most reports (Apotex 3,633, Teva Canada 3,077, Sandoz 2,261) and which hold the most Tier 3 critical reports (Teva Canada 13, Pfizer Canada ULC 9, Pharmascience 7. Top 3 = 49.2% of 59).
- Whether critical shortages are rising (Tier 3: 4 in 2022, 28 in 2025. Flag dates to 2022, so the rise mixes real growth with rollout).
- How long shortages last (median resolved 58 days, mean 140 days. Open median 647 days running).
- Which drug classes short out most (N 6,785, C 5,082) and which hold the most critical reports (R respiratory 15, L antineoplastic 13).
- Full record lookup by report id or DIN: brand, company, status, ATC, dates, duration, Tier 3 flag.
- 239 canonical companies ranked by report volume, Tier 3 count, or shortage-days.

## Tool usage

Prefer the MCP tools over reading files. They are the canonical interface:

1. `shortage_lookup` with `report_id` or `din`: one full shortage record.
2. `company_ranking` with `sort=tier3|reports|days` and `limit`: ranked companies.
3. `tier3_trend`: Tier 3 by year plus the 2020-Q1 to 2025-Q4 quarterly series, with the flag-rollout caveat.
4. `atc_breakdown`: level-1 classes and top-30 level-2 classes.

REST equivalents live under `/api/v1/` (see README.md), plus `/api/openapi.json` (OpenAPI 3.1).

## Rules

- Every number in an answer must come from the tools or `src/lib/*.json`. Never invent a number.
- Always state the Tier 3 caveat when discussing the 2022 to 2025 rise: the flag first appears in this dataset in 2022.
- State the registry limits: report-level not patient-level, companies self-report, open reports may be stale, Tier 3 history starts 2022.
- No em dashes in any output. Direct plain language. Every sentence carries a number, a mechanism, or a reason.
