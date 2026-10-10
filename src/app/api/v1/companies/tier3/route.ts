import { NextResponse } from "next/server";
import { getCompanies, getInsights } from "@/lib/data";

// GET /api/v1/companies/tier3: the Tier 3 ranking (critical shortages).
export async function GET() {
  const { tier3 } = getCompanies();
  const { tier3_total, tier3_open, tier3_top3_share, tier3_top5_share, tier3_top3_companies } = getInsights();
  return NextResponse.json({
    total: tier3_total,
    open: tier3_open,
    top3_share: tier3_top3_share,
    top5_share: tier3_top5_share,
    top3_companies: tier3_top3_companies,
    companies: tier3,
  });
}
