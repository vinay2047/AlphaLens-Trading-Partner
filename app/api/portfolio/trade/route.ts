import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { buyStock, sellStock } from "@/lib/actions/portfolio.actions";

export async function POST(request: NextRequest) {
    try {
        await client.connect();

        const body = await request.json();
        const type = body?.type as "BUY" | "SELL";
        const symbol = String(body?.symbol || "");
        const company = String(body?.company || "");
        const shares = Number(body?.shares || 0);

        const result = type === "SELL"
            ? await sellStock(symbol, shares)
            : await buyStock(symbol, company, shares);

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Trade failed" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/portfolio/trade failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
