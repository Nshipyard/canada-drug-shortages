import { NextResponse } from "next/server";
import { getTrends, getInsights } from "@/lib/data";

// GET /api/v1/trends: quarterly new-report series (2020-Q1 to 2025-Q4).
export async function GET() {
  const { quarterly } = getTrends();
  return NextResponse.json({
    vintage: getInsights().vintage,
    quarterly: quarterly.filter((q) => q.quarter >= "2020-Q1" && q.quarter <= "2025-Q4"),
  });
}
