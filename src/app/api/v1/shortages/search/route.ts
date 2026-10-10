import { NextResponse } from "next/server";
import { searchReports } from "@/lib/data";

// GET /api/v1/shortages/search?q=&company=&atc1=&tier3=&status=&page=&limit=
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") ?? "25", 10) || 25, 1), 100);
  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10) || 1, 1);
  const tier3Raw = searchParams.get("tier3");
  const statusRaw = searchParams.get("status");
  const status =
    statusRaw === "open" || statusRaw === "anticipated" || statusRaw === "avoided" || statusRaw === "resolved"
      ? statusRaw
      : undefined;
  const result = searchReports({
    q: searchParams.get("q") ?? undefined,
    company: searchParams.get("company") ?? undefined,
    atc1: searchParams.get("atc1") ?? undefined,
    tier3: tier3Raw === "true" ? true : tier3Raw === "false" ? false : undefined,
    status,
    page,
    limit,
  });
  return NextResponse.json(result);
}
