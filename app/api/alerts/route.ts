import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { createAlert, deleteAlert, getUserAlerts } from "@/lib/actions/alert.actions";

export async function GET() {
    try {
        await client.connect();

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const alerts = await getUserAlerts(userId);
        return NextResponse.json(alerts);
    } catch (error) {
        console.error("GET /api/alerts failed:", error);
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
        const alert = await createAlert({
            userId,
            symbol: String(body?.symbol || ""),
            targetPrice: Number(body?.targetPrice || 0),
            condition: body?.condition === "BELOW" ? "BELOW" : "ABOVE",
        });

        return NextResponse.json(alert);
    } catch (error) {
        console.error("POST /api/alerts failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await client.connect();

        const { searchParams } = new URL(request.url);
        const alertId = searchParams.get("id");

        if (!alertId) {
            return NextResponse.json({ error: "Alert id is required" }, { status: 400 });
        }

        const result = await deleteAlert(alertId);
        return NextResponse.json(result);
    } catch (error) {
        console.error("DELETE /api/alerts failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
