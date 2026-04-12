import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { addToWatchlist, getUserWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";

export async function GET() {
    try {
        await client.connect();

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const items = await getUserWatchlist(userId);
        return NextResponse.json(items);
    } catch (error) {
        console.error("GET /api/watchlist failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await client.connect();

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await request.json();
        const symbol = String(body?.symbol || "");
        const company = String(body?.company || symbol);

        const item = await addToWatchlist(userId, symbol, company);
        return NextResponse.json(item);
    } catch (error) {
        console.error("POST /api/watchlist failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await client.connect();

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const symbol = searchParams.get("symbol");

        if (!symbol) {
            return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
        }

        const result = await removeFromWatchlist(userId, symbol);
        return NextResponse.json(result);
    } catch (error) {
        console.error("DELETE /api/watchlist failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
