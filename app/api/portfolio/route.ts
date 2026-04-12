import { NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { getOrCreatePortfolio } from "@/lib/actions/portfolio.actions";

export async function GET() {
    try {
        await client.connect();
        const result = await getOrCreatePortfolio();

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Failed to load portfolio" }, { status: 500 });
        }

        return NextResponse.json(result.data);
    } catch (error) {
        console.error("GET /api/portfolio failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
