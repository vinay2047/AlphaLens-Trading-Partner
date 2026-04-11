'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrCreatePortfolio, getTransactions } from '@/lib/actions/portfolio.actions';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PortfolioCharts from '@/components/portfolio/PortfolioCharts';
import HoldingsTable from '@/components/portfolio/HoldingsTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import AddFundsModal from '@/components/portfolio/AddFundsModal';
import TradeModal from '@/components/portfolio/TradeModal';
import DCAManager from '@/components/portfolio/DCAManager';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PortfolioPage = () => {
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [addFundsOpen, setAddFundsOpen] = useState(false);
    const [tradeOpen, setTradeOpen] = useState(false);
    const [selectedHolding, setSelectedHolding] = useState<HoldingData | null>(null);
    const [verifyingDeposit, setVerifyingDeposit] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const loadData = async (showRefresh = false) => {
        if (showRefresh) setRefreshing(true);
        try {
            const [portfolioRes, txRes] = await Promise.all([
                getOrCreatePortfolio(),
                getTransactions(),
            ]);

            if (portfolioRes.success && portfolioRes.data) {
                setPortfolio(portfolioRes.data);
            }
            if (txRes.success && txRes.data) {
                setTransactions(txRes.data);
            }
        } catch {
            toast.error('Failed to load portfolio data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        const payment = searchParams.get('payment');
        const amount = searchParams.get('amount');
        const sessionId = searchParams.get('session_id');

        const clearPaymentParams = () => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('payment');
            params.delete('amount');
            params.delete('session_id');
            const nextQuery = params.toString();
            router.replace(nextQuery ? `/portfolio?${nextQuery}` : '/portfolio');
        };

        const verifyDeposit = async () => {
            if (payment === 'cancelled') {
                toast.info('Payment was cancelled');
                clearPaymentParams();
                return;
            }

            if (payment !== 'success' || !amount || !sessionId) {
                return;
            }

            setVerifyingDeposit(true);
            try {
                const response = await fetch(`/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Unable to verify payment');
                }

                if (data.paymentStatus === 'paid') {
                    toast.success(`Successfully added $${amount} to your portfolio!`, {
                        description: 'Your AlphaFunds balance has been updated.',
                    });
                    setTimeout(() => loadData(true), 1000);
                } else {
                    toast.info('Your payment is still processing.');
                }
            } catch (error) {
                console.error('Failed to verify Stripe checkout session', error);
                toast.error('Unable to verify your deposit yet. Please refresh in a moment.');
            } finally {
                setVerifyingDeposit(false);
                clearPaymentParams();
            }
        };

        verifyDeposit();
    }, [router, searchParams]);

    const handleSellFromTable = (holding: HoldingData) => {
        setSelectedHolding(holding);
        setTradeOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 border border-teal-500/20 bg-gray-800/50 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_30px_rgba(16,229,90,0.1)]">
                    <Loader2 className="h-10 w-10 text-teal-400 animate-spin" />
                    <p className="text-gray-400 text-lg font-medium">Booting your portfolio...</p>
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500 text-lg">Failed to load portfolio</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 relative">
             {/* Subtle ambient lighting inner page */}
             <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen overflow-hidden"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Portfolio</h1>
                    <p className="text-gray-400 font-medium text-lg">Manage your AlphaFunds & Analytics</p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <Button
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        className="bg-[#000000] border border-gray-700 hover:bg-gray-800 text-gray-300 rounded-xl px-4 py-5 transition-colors shadow-none"
                        size="sm"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 text-teal-400 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setAddFundsOpen(true)}
                        disabled={verifyingDeposit}
                        className="bg-teal-400 hover:bg-teal-300 text-black font-extrabold rounded-xl px-5 py-5 shadow-[0_0_20px_rgba(16,229,90,0.2)] transition-all"
                        size="sm"
                    >
                        {verifyingDeposit ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="h-5 w-5 mr-1" />
                        )}
                        {verifyingDeposit ? 'Verifying...' : 'Add Funds'}
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <PortfolioSummary portfolio={portfolio} />

            {/* Analytics Charts */}
            {portfolio.holdings.length > 0 && (
                <div className="relative z-10 w-full overflow-hidden">
                    <PortfolioCharts holdings={portfolio.holdings} />
                </div>
            )}

            {/* Holdings & Transactions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative z-10">
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Your Holdings</h2>
                        <span className="text-sm font-medium text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">{portfolio.holdings.length} Active Positions</span>
                    </div>
                    <HoldingsTable holdings={portfolio.holdings} />

                    {/* Quick sell from holdings */}
                    {portfolio.holdings.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {portfolio.holdings.map((h) => (
                                <Button
                                    key={h.symbol}
                                    onClick={() => handleSellFromTable(h)}
                                    variant="outline"
                                    size="sm"
                                    className="bg-[#000000] border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500 rounded-xl text-xs px-4 font-semibold transition-all h-9"
                                >
                                    Sell {h.symbol}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Activities</h2>
                        <span className="text-sm font-medium text-gray-400">{transactions.length} Records</span>
                    </div>
                    <TransactionHistory transactions={transactions} />

                    {/* DCA Auto-Invest Manager */}
                    <DCAManager />
                </div>
            </div>

            {/* How to trade info */}
            <div className="rounded-[2xl] border border-gray-800 bg-[#000000] p-8 shadow-2xl relative z-10 transition-all hover:border-teal-500/30 group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-start gap-5 relative z-10">
                    <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 shadow-[0_0_15px_rgba(16,229,90,0.15)] mt-1">
                        <Search className="h-6 w-6 stroke-[2.5px]" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Want to discover new assets?</h3>
                        <p className="text-gray-400 text-base leading-relaxed max-w-3xl">
                            Search for any stock using the global spotlight search bar. Add it to your watchlist or perform split-second execution directly using your AlphaFunds seamlessly.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AddFundsModal open={addFundsOpen} onClose={() => setAddFundsOpen(false)} />

            {selectedHolding && (
                <TradeModal
                    open={tradeOpen}
                    onClose={() => {
                        setTradeOpen(false);
                        setSelectedHolding(null);
                    }}
                    symbol={selectedHolding.symbol}
                    company={selectedHolding.company}
                    currentPrice={selectedHolding.currentPrice}
                    balance={portfolio.balance}
                    currentShares={selectedHolding.shares}
                    defaultType="SELL"
                />
            )}
        </div>
    );
};

export default PortfolioPage;
