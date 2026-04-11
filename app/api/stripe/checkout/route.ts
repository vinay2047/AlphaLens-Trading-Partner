import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount } = await request.json();

        if (!amount || amount < 1) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'AlphaFunds Deposit',
                            description: `Add $${amount} to your AlphaLens portfolio`,
                        },
                        unit_amount: Math.round(amount * 100), // Stripe uses cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.nextUrl.origin}/portfolio?payment=success&amount=${amount}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.nextUrl.origin}/portfolio?payment=cancelled`,
            metadata: {
                userId,
                amount: amount.toString(),
                type: 'ALPHA_FUNDS_DEPOSIT',
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}
