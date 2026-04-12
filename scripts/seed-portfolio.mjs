/**
 * AlphaLens — Portfolio Seed Script
 * Run with: node scripts/seed-portfolio.mjs
 *
 * - Looks up Clerk user IDs for the two specified emails
 * - Seeds Portfolio, Holdings, and Transactions in MongoDB
 */

import mongoose from 'mongoose';
import dns from 'dns';

// ─── DNS fix (same as mongoose.ts) ────────────────────────────────────────────
try {
    if (dns.setDefaultResultOrder) dns.setDefaultResultOrder('ipv4first');
    dns.setServers(['8.8.8.8']);
} catch {}

// ─── Config ───────────────────────────────────────────────────────────────────
const MONGODB_URI = 'mongodb+srv://gargmishti:alphalens@cluster0.mqad0fe.mongodb.net/?appName=Cluster0';
const CLERK_SECRET_KEY = 'sk_test_ohetAxntGBWEcjnEUUteok9ECyfCsjf1WLZGDK9tkY';

const TARGET_EMAILS = ['gargmishti9@gmail.com', 'timepassinphone@gmail.com'];

// ─── Schemas (mirror of the app's models) ────────────────────────────────────
const PortfolioSchema = new mongoose.Schema({ userId: String, balance: Number, totalInvested: Number }, { timestamps: true });
const HoldingSchema   = new mongoose.Schema({ userId: String, symbol: String, company: String, shares: Number, avgBuyPrice: Number, totalInvested: Number }, { timestamps: true });
const TransactionSchema = new mongoose.Schema({
    userId: String, type: String, symbol: String, company: String,
    shares: Number, pricePerShare: Number, totalAmount: Number,
    status: String, stripePaymentId: String,
}, { timestamps: true });

const Portfolio   = mongoose.models.Portfolio   || mongoose.model('Portfolio',   PortfolioSchema);
const Holding     = mongoose.models.Holding     || mongoose.model('Holding',     HoldingSchema);
const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

// ─── Dummy data sets ──────────────────────────────────────────────────────────

// User 1 (gargmishti9@gmail.com) — active tech-heavy portfolio
const USER1_DATA = {
    balance: 14823.50,
    totalInvested: 47200.00,
    holdings: [
        { symbol: 'AAPL', company: 'Apple Inc.',           shares: 52,  avgBuyPrice: 172.30, totalInvested: 8959.60  },
        { symbol: 'NVDA', company: 'NVIDIA Corporation',   shares: 18,  avgBuyPrice: 785.00, totalInvested: 14130.00 },
        { symbol: 'MSFT', company: 'Microsoft Corporation',shares: 30,  avgBuyPrice: 388.00, totalInvested: 11640.00 },
        { symbol: 'GOOG', company: 'Alphabet Inc.',        shares: 8,   avgBuyPrice: 163.00, totalInvested: 1304.00  },
        { symbol: 'TSLA', company: 'Tesla, Inc.',          shares: 40,  avgBuyPrice: 205.60, totalInvested: 8224.00  },
        { symbol: 'AMZN', company: 'Amazon.com, Inc.',     shares: 12,  avgBuyPrice: 165.20, totalInvested: 1982.40  },
        { symbol: 'META', company: 'Meta Platforms, Inc.', shares: 3,   avgBuyPrice: 320.00, totalInvested: 960.00   },
    ],
    transactions: [
        { type: 'DEPOSIT',  symbol: null,   company: null,               shares: null, pricePerShare: null, totalAmount: 30000.00,  daysAgo: 90 },
        { type: 'DEPOSIT',  symbol: null,   company: null,               shares: null, pricePerShare: null, totalAmount: 15000.00,  daysAgo: 60 },
        { type: 'BUY',  symbol: 'AAPL', company: 'Apple Inc.',           shares: 52,   pricePerShare: 172.30, totalAmount: 8959.60, daysAgo: 85 },
        { type: 'BUY',  symbol: 'NVDA', company: 'NVIDIA Corporation',   shares: 18,   pricePerShare: 785.00, totalAmount: 14130.00, daysAgo: 80 },
        { type: 'BUY',  symbol: 'MSFT', company: 'Microsoft Corporation',shares: 30,   pricePerShare: 388.00, totalAmount: 11640.00, daysAgo: 75 },
        { type: 'BUY',  symbol: 'GOOG', company: 'Alphabet Inc.',        shares: 8,    pricePerShare: 163.00, totalAmount: 1304.00, daysAgo: 70 },
        { type: 'BUY',  symbol: 'TSLA', company: 'Tesla, Inc.',          shares: 40,   pricePerShare: 205.60, totalAmount: 8224.00, daysAgo: 55 },
        { type: 'SELL', symbol: 'TSLA', company: 'Tesla, Inc.',          shares: 5,    pricePerShare: 220.00, totalAmount: 1100.00,  daysAgo: 40 },
        { type: 'BUY',  symbol: 'AMZN', company: 'Amazon.com, Inc.',     shares: 12,   pricePerShare: 165.20, totalAmount: 1982.40, daysAgo: 30 },
        { type: 'BUY',  symbol: 'META', company: 'Meta Platforms, Inc.', shares: 3,    pricePerShare: 320.00, totalAmount: 960.00,  daysAgo: 20 },
    ],
};

// User 2 (timepassinphone@gmail.com) — diversified, index-like portfolio
const USER2_DATA = {
    balance: 8240.75,
    totalInvested: 22500.00,
    holdings: [
        { symbol: 'SPY',  company: 'SPDR S&P 500 ETF',          shares: 25,  avgBuyPrice: 480.00, totalInvested: 12000.00 },
        { symbol: 'QQQ',  company: 'Invesco QQQ Trust',          shares: 20,  avgBuyPrice: 420.00, totalInvested: 8400.00  },
        { symbol: 'NFLX', company: 'Netflix, Inc.',              shares: 5,   avgBuyPrice: 580.00, totalInvested: 2900.00  },
        { symbol: 'DIS',  company: 'The Walt Disney Company',    shares: 30,  avgBuyPrice: 105.00, totalInvested: 3150.00  },
    ],
    transactions: [
        { type: 'DEPOSIT', symbol: null, company: null, shares: null, pricePerShare: null, totalAmount: 20000.00, daysAgo: 120 },
        { type: 'DEPOSIT', symbol: null, company: null, shares: null, pricePerShare: null, totalAmount: 10000.00, daysAgo: 45  },
        { type: 'BUY', symbol: 'SPY',  company: 'SPDR S&P 500 ETF',       shares: 25, pricePerShare: 480.00, totalAmount: 12000.00, daysAgo: 115 },
        { type: 'BUY', symbol: 'QQQ',  company: 'Invesco QQQ Trust',       shares: 20, pricePerShare: 420.00, totalAmount: 8400.00,  daysAgo: 110 },
        { type: 'BUY', symbol: 'NFLX', company: 'Netflix, Inc.',           shares: 5,  pricePerShare: 580.00, totalAmount: 2900.00,  daysAgo: 60  },
        { type: 'SELL', symbol: 'QQQ', company: 'Invesco QQQ Trust',       shares: 5,  pricePerShare: 435.00, totalAmount: 2175.00,  daysAgo: 50  },
        { type: 'BUY', symbol: 'DIS',  company: 'The Walt Disney Company', shares: 30, pricePerShare: 105.00, totalAmount: 3150.00,  daysAgo: 40  },
    ],
};

// ─── Helper: fetch Clerk user by email ───────────────────────────────────────
async function getClerkUserIdByEmail(email) {
    const url = `https://api.clerk.com/v1/users?email_address=${encodeURIComponent(email)}&limit=1`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Clerk API error for ${email}: ${res.status} — ${text}`);
    }
    const users = await res.json();
    if (!users || users.length === 0) {
        console.warn(`⚠️  No Clerk user found for email: ${email}`);
        return null;
    }
    return users[0].id;
}

// ─── Seeder ───────────────────────────────────────────────────────────────────
async function seedUser(userId, data, email) {
    console.log(`\n📦 Seeding user: ${email} (${userId})`);

    // 1. Clear existing data for this user
    await Portfolio.deleteMany({ userId });
    await Holding.deleteMany({ userId });
    await Transaction.deleteMany({ userId });
    console.log(`   ✓ Cleared old data`);

    // 2. Create Portfolio
    await Portfolio.create({
        userId,
        balance: data.balance,
        totalInvested: data.totalInvested,
    });
    console.log(`   ✓ Portfolio created (balance: $${data.balance})`);

    // 3. Create Holdings
    for (const h of data.holdings) {
        await Holding.create({ userId, ...h });
    }
    console.log(`   ✓ ${data.holdings.length} holdings inserted`);

    // 4. Create Transactions (with past dates)
    const now = Date.now();
    for (const tx of data.transactions) {
        const createdAt = new Date(now - tx.daysAgo * 24 * 60 * 60 * 1000);
        await Transaction.create({
            userId,
            type: tx.type,
            symbol:       tx.symbol   || undefined,
            company:      tx.company  || undefined,
            shares:       tx.shares   || undefined,
            pricePerShare: tx.pricePerShare || undefined,
            totalAmount:  tx.totalAmount,
            status: 'COMPLETED',
            createdAt,
            updatedAt: createdAt,
        });
    }
    console.log(`   ✓ ${data.transactions.length} transactions inserted`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { bufferCommands: false, family: 4 });
    console.log('✅ Connected\n');

    const userDataMap = {
        'gargmishti9@gmail.com':   USER1_DATA,
        'timepassinphone@gmail.com': USER2_DATA,
    };

    for (const email of TARGET_EMAILS) {
        const userId = await getClerkUserIdByEmail(email);
        if (!userId) {
            console.log(`⏭️  Skipping ${email} — not found in Clerk`);
            continue;
        }
        await seedUser(userId, userDataMap[email], email);
    }

    console.log('\n🎉 Seed complete!');
    await mongoose.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
