import { NextResponse } from "next/server";
import { getAtc } from "@/lib/data";

// GET /api/v1/atc: level-1 breakdown and top-30 level-2 classes.
export async function GET() {
  return NextResponse.json(getAtc());
}
