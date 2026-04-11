import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { connectToDatabase } from '@/database/mongoose';
import { Portfolio } from '@/database/models/portfolio.model';
import { Transaction } from '@/database/models/transaction.model';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const amount = parseFloat(session.metadata?.amount || '0');

        if (userId && amount > 0) {
            try {
                await connectToDatabase();

                // Credit the user's portfolio
                let portfolio = await Portfolio.findOne({ userId });
                if (!portfolio) {
                    portfolio = await Portfolio.create({ userId, balance: 10000 + amount, totalInvested: 0 });
                } else {
                    portfolio.balance += amount;
                    await portfolio.save();
                }

                // Record the deposit transaction
                await Transaction.create({
                    userId,
                    type: 'DEPOSIT',
                    totalAmount: amount,
                    stripePaymentId: session.payment_intent as string,
                    status: 'COMPLETED',
                });

                console.log(`✅ Deposited $${amount} to user ${userId}`);
            } catch (error) {
                console.error('Webhook processing error:', error);
                return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}
