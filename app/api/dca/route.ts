import { NextRequest, NextResponse } from "next/server";

import client from "@/lib/mongodb";
import { createDCAPlan, deleteDCAPlan, getUserDCAPlans, toggleDCAPlan } from "@/lib/actions/dca.actions";

export async function GET() {
    try {
        await client.connect();
        const result = await getUserDCAPlans();

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Failed to load DCA plans" }, { status: 500 });
        }

        return NextResponse.json(result.data ?? []);
    } catch (error) {
        console.error("GET /api/dca failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await client.connect();
        const body = await request.json();
        const result = await createDCAPlan({
            symbol: String(body?.symbol || ""),
            company: String(body?.company || body?.symbol || ""),
            amount: Number(body?.amount || 0),
            frequency: body?.frequency,
        });

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Failed to create DCA plan" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("POST /api/dca failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        await client.connect();
        const body = await request.json();
        const result = await toggleDCAPlan(String(body?.planId || ""));

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Failed to update DCA plan" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/dca failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        await client.connect();

        const { searchParams } = new URL(request.url);
        const planId = searchParams.get("id");

        if (!planId) {
            return NextResponse.json({ error: "Plan id is required" }, { status: 400 });
        }

        const result = await deleteDCAPlan(planId);

        if (!result.success) {
            return NextResponse.json({ error: result.error || "Failed to delete DCA plan" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/dca failed:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
