import { NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { getLeaderboard } from "@/lib/actions/leaderboard.actions";

export async function GET() {
    try {
        await client.connect();
        const result = await getLeaderboard();

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Failed to load leaderboard" }, { status: 500 });
        }

        return NextResponse.json(result.data ?? []);
    } catch (error) {
        console.error("GET /api/leaderboard failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
