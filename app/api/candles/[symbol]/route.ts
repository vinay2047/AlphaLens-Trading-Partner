import { NextResponse } from 'next/server';
import { getStockCandles } from '@/lib/actions/finnhub.actions';

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ symbol: string }> }
) {
    const { symbol } = await params;
    try {
        const bars = await getStockCandles(symbol.toUpperCase(), 120);
        return NextResponse.json(bars ?? []);
    } catch {
        return NextResponse.json([], { status: 500 });
    }
}
