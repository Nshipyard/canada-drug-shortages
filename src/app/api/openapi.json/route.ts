import { NextResponse } from "next/server";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "Drug Shortages, Ranked API",
    version: "1.0.0",
    description:
      "24,377 shortage reports and 3,221 discontinuation reports from the Health Product Shortages Canada monthly bulk extract (archived 2025-12-20, reference date 2025-12-01), normalized with 239 canonical companies, ATC classes, and a Tier 3 flag for critical shortages. An independent open-source project, not affiliated with the Government of Canada or Health Canada. MIT licensed.",
  },
  servers: [{ url: "https://shortages.canada.nshipyard.com/api/v1" }],
  paths: {
    "/summary": {
      get: {
        summary: "Headline aggregates: report counts, open/resolved/avoided splits, Tier 3 totals and shares, duration medians and means, vintage",
        responses: { "200": { description: "insights.json aggregates" } },
      },
    },
    "/shortages/search": {
      get: {
        summary: "Search 24,377 shortage reports by brand name, DIN, or company. Filterable by company, ATC level 1, Tier 3, and status",
        parameters: [
          { name: "q", in: "query", required: false, schema: { type: "string" }, example: "salbutamol" },
          { name: "company", in: "query", required: false, schema: { type: "string" }, example: "TEVA CANADA LIMITED" },
          { name: "atc1", in: "query", required: false, schema: { type: "string" }, example: "N" },
          { name: "tier3", in: "query", required: false, schema: { type: "boolean" }, example: true },
          { name: "status", in: "query", required: false, schema: { type: "string", enum: ["open", "anticipated", "avoided", "resolved"] } },
          { name: "page", in: "query", required: false, schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", default: 25, maximum: 100 } },
        ],
        responses: { "200": { description: "Paginated matching report records" } },
      },
    },
    "/companies": {
      get: {
        summary: "239 canonical companies ranked by report volume, Tier 3 count, or shortage-days",
        parameters: [
          { name: "sort", in: "query", required: false, schema: { type: "string", enum: ["tier3", "reports", "days"] }, example: "tier3" },
          { name: "limit", in: "query", required: false, schema: { type: "integer", default: 20, maximum: 239 } },
        ],
        responses: { "200": { description: "Ranked company list" } },
      },
    },
    "/companies/tier3": {
      get: {
        summary: "The Tier 3 (critical shortage) company ranking with top-3 and top-5 shares",
        responses: { "200": { description: "Tier 3 companies plus concentration shares" } },
      },
    },
    "/trends": {
      get: {
        summary: "Quarterly series 2020-Q1 to 2025-Q4: new Tier 3 reports and all new reports per quarter",
        responses: { "200": { description: "Quarterly trend series" } },
      },
    },
    "/atc": {
      get: {
        summary: "ATC level-1 breakdown and top-30 level-2 classes by report volume",
        responses: { "200": { description: "ATC classes with report counts and Tier 3 splits" } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
