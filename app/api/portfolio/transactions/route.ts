import { NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { getTransactions } from "@/lib/actions/portfolio.actions";

export async function GET() {
    try {
        await client.connect();
        const result = await getTransactions();

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Failed to load transactions" }, { status: 500 });
        }

        return NextResponse.json(result.data ?? []);
    } catch (error) {
        console.error("GET /api/portfolio/transactions failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
