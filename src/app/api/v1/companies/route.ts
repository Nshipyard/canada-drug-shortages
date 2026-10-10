import { NextResponse } from "next/server";
import { rankedCompanies } from "@/lib/data";

// GET /api/v1/companies?sort=tier3|reports|days&limit=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sortRaw = searchParams.get("sort");
  const sort = sortRaw === "tier3" || sortRaw === "days" ? sortRaw : "reports";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "20", 10) || 20, 1), 239);
  return NextResponse.json({ sort, limit, companies: rankedCompanies(sort, limit) });
}
