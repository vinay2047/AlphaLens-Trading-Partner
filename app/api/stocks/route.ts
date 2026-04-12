import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { getPortfolioBalance, getUserHoldingForSymbol } from "@/lib/actions/portfolio.actions";
import { isStockInWatchlist } from "@/lib/actions/watchlist.actions";

export async function GET(request: NextRequest) {
    try {
        await client.connect();

        const { searchParams } = new URL(request.url);
        const rawSymbol = searchParams.get("symbol");

        if (!rawSymbol) {
            return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
        }

        const symbol = rawSymbol.toUpperCase();
        const { userId } = await auth();

        const [watchlist, holding, balance] = await Promise.all([
            userId ? isStockInWatchlist(userId, symbol) : Promise.resolve(false),
            getUserHoldingForSymbol(symbol),
            getPortfolioBalance(),
        ]);

        return NextResponse.json({
            isInWatchlist: watchlist,
            holding,
            balance,
        });
    } catch (error) {
        console.error("GET /api/stocks failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
