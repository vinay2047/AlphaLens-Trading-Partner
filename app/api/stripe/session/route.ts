import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { connectToDatabase } from '@/database/mongoose';
import { Portfolio } from '@/database/models/portfolio.model';
import { Transaction } from '@/database/models/transaction.model';
import { deleteCacheKeys } from '@/lib/redis-cache';
import { leaderboardCacheKey, portfolioCacheKey, transactionsCacheKey } from '@/lib/cache-keys';

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

        let credited = false;

        // If payment is complete, credit funds to the portfolio (idempotent).
        // This acts as a fallback when the Stripe webhook is unavailable or
        // delayed (e.g. local dev without `stripe listen`).
        if (session.payment_status === 'paid') {
            const amount = parseFloat(session.metadata?.amount || '0');
            const stripePaymentId =
                typeof session.payment_intent === 'string' ? session.payment_intent : '';

            if (amount > 0 && stripePaymentId) {
                try {
                    await connectToDatabase();

                    // Idempotency: skip if this payment was already processed
                    const existingDeposit = await Transaction.findOne({
                        stripePaymentId,
                        type: 'DEPOSIT',
                        status: 'COMPLETED',
                    });

                    if (!existingDeposit) {
                        let portfolio = await Portfolio.findOne({ userId });
                        if (!portfolio) {
                            portfolio = await Portfolio.create({
                                userId,
                                balance: 10000 + amount,
                                totalInvested: 0,
                            });
                        } else {
                            portfolio.balance += amount;
                            await portfolio.save();
                        }

                        await Transaction.create({
                            userId,
                            type: 'DEPOSIT',
                            totalAmount: amount,
                            stripePaymentId,
                            status: 'COMPLETED',
                        });

                        await deleteCacheKeys([
                            portfolioCacheKey(userId),
                            transactionsCacheKey(userId),
                            leaderboardCacheKey(),
                        ]);

                        credited = true;
                        console.log(
                            `Session-based deposit completed: $${amount} credited to user ${userId}`
                        );
                    } else {
                        // Already credited (by webhook or a previous session check)
                        credited = true;
                    }
                } catch (creditError) {
                    console.error('Session credit error (non-fatal):', creditError);
                    // Don't fail the whole request — the user can still see payment status
                }
            }
        }

        return NextResponse.json({
            id: session.id,
            paymentStatus: session.payment_status,
            amount: session.metadata?.amount ?? null,
            credited,
        });
    } catch (error) {
        console.error('Stripe session lookup error:', error);
        return NextResponse.json({ error: 'Failed to fetch checkout session' }, { status: 500 });
    }
}
