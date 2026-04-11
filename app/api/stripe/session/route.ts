import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function GET(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const sessionId = request.nextUrl.searchParams.get('session_id');
        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session id' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session || session.metadata?.userId !== userId) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        return NextResponse.json({
            id: session.id,
            paymentStatus: session.payment_status,
            amount: session.metadata?.amount ?? null,
        });
    } catch (error) {
        console.error('Stripe session lookup error:', error);
        return NextResponse.json({ error: 'Failed to fetch checkout session' }, { status: 500 });
    }
}
