import { NextResponse } from "next/server";
import {
  getInsights,
  getTrends,
  getAtc,
  lookupReport,
  rankedCompanies,
} from "@/lib/data";

// Minimal MCP server over streamable HTTP (JSON-RPC 2.0 via POST).
// Supports: initialize, tools/list, tools/call. Stateless.

const SERVER = { name: "canada-drug-shortages", version: "1.0.0" };

const TOOLS = [
  {
    name: "shortage_lookup",
    description:
      "Full record for one drug shortage report: brand name, company, DIN, ATC class, status, Tier 3 flag, start/end dates, duration in days, and raw registry values. 24,377 reports from the Health Product Shortages Canada extract (archived 2025-12-20, reference date 2025-12-01).",
    inputSchema: {
      type: "object",
      properties: {
        report_id: { type: "string", description: "Report id, e.g. 75200" },
        din: { type: "string", description: "Drug identification number, e.g. 00437999" },
      },
    },
  },
  {
    name: "company_ranking",
    description:
      "Rank the 239 canonical companies by Tier 3 critical-shortage reports, total reports, or shortage-days.",
    inputSchema: {
      type: "object",
      properties: {
        sort: { type: "string", description: "tier3, reports, or days", enum: ["tier3", "reports", "days"] },
        limit: { type: "integer", description: "Max companies, default 10" },
      },
    },
  },
  {
    name: "tier3_trend",
    description:
      "Tier 3 (critical shortage) trend: designations by year 2022 to 2025 plus the quarterly series of new Tier 3 reports and all new reports from 2020-Q1. Note the Tier 3 flag first appears in the data in 2022, when the committee process was formalized, so the rise mixes real growth with the flag's rollout.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "atc_breakdown",
    description:
      "Shortage reports by ATC drug class: level-1 breakdown (reports, Tier 3 reports, open reports, shortage days) and the top-30 level-2 classes.",
    inputSchema: { type: "object", properties: {} },
  },
];

function ok(id: unknown, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}
function err(id: unknown, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
function textResult(data: unknown) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handle(msg: any) {
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    return err(msg?.id ?? null, -32600, "Invalid Request");
  }
  const id = msg.id ?? null;
  switch (msg.method) {
    case "initialize":
      return ok(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER,
      });
    case "notifications/initialized":
      return null;
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const { name, arguments: args } = msg.params ?? {};
      try {
        if (name === "shortage_lookup") {
          const key = String(args.report_id ?? args.din ?? "");
          const hit = lookupReport(key);
          if (!hit) return err(id, -32001, `No shortage report ${key}`);
          return ok(id, textResult(hit));
        }
        if (name === "company_ranking") {
          const sortRaw = String(args.sort ?? "reports");
          const sort = sortRaw === "tier3" || sortRaw === "days" ? sortRaw : "reports";
          const limit = Math.min(Math.max(parseInt(String(args.limit ?? "10"), 10) || 10, 1), 239);
          return ok(id, textResult({ sort, companies: rankedCompanies(sort, limit) }));
        }
        if (name === "tier3_trend") {
          const ins = getInsights();
          const { quarterly } = getTrends();
          return ok(id, textResult({
            tier3_total: ins.tier3_total,
            tier3_open: ins.tier3_open,
            by_year: ins.tier3_by_year,
            top3_companies: ins.tier3_top3_companies,
            top3_share: ins.tier3_top3_share,
            quarterly: quarterly.filter((q) => q.quarter >= "2020-Q1" && q.quarter <= "2025-Q4"),
            caveat:
              "The Tier 3 flag first appears in this dataset in 2022, matching when the current committee process was formalized, so the rise mixes real growth with the flag's rollout.",
          }));
        }
        if (name === "atc_breakdown") {
          return ok(id, textResult(getAtc()));
        }
        return err(id, -32602, `Unknown tool ${name}`);
      } catch (e) {
        return err(id, -32000, `Tool error: ${(e as Error).message}`);
      }
    }
    default:
      return err(id, -32601, `Method not found: ${msg.method}`);
  }
}

export async function POST(req: Request) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(err(null, -32700, "Parse error"), { status: 400 });
  }
  if (Array.isArray(body)) {
    const out = body.map(handle).filter((r) => r !== null);
    return NextResponse.json(out);
  }
  const out = handle(body);
  if (out === null) return new NextResponse(null, { status: 202 });
  return NextResponse.json(out);
}

export async function GET() {
  return NextResponse.json(
    { error: "This MCP server accepts JSON-RPC 2.0 via POST only." },
    { status: 405 }
  );
}

export async function DELETE() {
  return new NextResponse(null, { status: 405 });
}
