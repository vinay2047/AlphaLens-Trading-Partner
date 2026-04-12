'use client';
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getOrCreatePortfolio, getTransactions } from '@/lib/actions/portfolio.actions';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import PortfolioCharts from '@/components/portfolio/PortfolioCharts';
import HoldingsTable from '@/components/portfolio/HoldingsTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import AddFundsModal from '@/components/portfolio/AddFundsModal';
import TradeModal, { type TradeSuccessPayload } from '@/components/portfolio/TradeModal';
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

    const buildPortfolioSummary = (base: PortfolioData, holdings: HoldingData[], balance: number, totalInvested: number): PortfolioData => {
        const totalPortfolioValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
        const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0);

        return {
            ...base,
            balance,
            totalInvested,
            holdings,
            totalPortfolioValue,
            totalPnL,
            totalPnLPercent: totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0,
        };
    };

    const handleTradeSuccess = ({ type, symbol, company, shares, pricePerShare, totalAmount }: TradeSuccessPayload) => {
        setPortfolio((prev) => {
            if (!prev) return prev;

            if (type === 'BUY') {
                const existingHolding = prev.holdings.find((holding) => holding.symbol === symbol);
                const nextHoldings = existingHolding
                    ? prev.holdings.map((holding) => {
                        if (holding.symbol !== symbol) return holding;

                        const nextShares = holding.shares + shares;
                        const nextTotalInvested = holding.totalInvested + totalAmount;
                        const nextCurrentValue = nextShares * pricePerShare;
                        const nextPnl = nextCurrentValue - nextTotalInvested;

                        return {
                            ...holding,
                            company,
                            shares: nextShares,
                            avgBuyPrice: nextTotalInvested / nextShares,
                            totalInvested: nextTotalInvested,
                            currentPrice: pricePerShare,
                            currentValue: nextCurrentValue,
                            pnl: nextPnl,
                            pnlPercent: nextTotalInvested > 0 ? (nextPnl / nextTotalInvested) * 100 : 0,
                        };
                    })
                    : [
                        {
                            symbol,
                            company,
                            shares,
                            avgBuyPrice: pricePerShare,
                            totalInvested: totalAmount,
                            currentPrice: pricePerShare,
                            currentValue: totalAmount,
                            pnl: 0,
                            pnlPercent: 0,
                        },
                        ...prev.holdings,
                    ];
                const nextTotalInvested = prev.totalInvested + totalAmount;

                return buildPortfolioSummary(
                    prev,
                    nextHoldings,
                    Math.max(0, prev.balance - totalAmount),
                    nextTotalInvested,
                );
            }

            const nextHoldings = prev.holdings.flatMap((holding) => {
                if (holding.symbol !== symbol) return [holding];

                const nextShares = holding.shares - shares;
                if (nextShares <= 0) {
                    return [];
                }

                const investedReduction = holding.totalInvested * (shares / holding.shares);
                const nextTotalInvested = holding.totalInvested - investedReduction;
                const nextCurrentValue = nextShares * holding.currentPrice;
                const nextPnl = nextCurrentValue - nextTotalInvested;

                return [{
                    ...holding,
                    shares: nextShares,
                    totalInvested: nextTotalInvested,
                    currentValue: nextCurrentValue,
                    pnl: nextPnl,
                    pnlPercent: nextTotalInvested > 0 ? (nextPnl / nextTotalInvested) * 100 : 0,
                }];
            });
            const nextTotalInvested = nextHoldings.reduce((sum, holding) => sum + holding.totalInvested, 0);

            return buildPortfolioSummary(
                prev,
                nextHoldings,
                prev.balance + totalAmount,
                nextTotalInvested,
            );
        });

        setTransactions((prev) => [
            {
                id: `temp-${Date.now()}`,
                type,
                symbol,
                company,
                shares,
                pricePerShare,
                totalAmount,
                status: 'COMPLETED',
                createdAt: new Date().toISOString(),
            },
            ...prev,
        ].slice(0, 50));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4 border border-gray-800 bg-black/60 p-8 rounded-2xl backdrop-blur-md shadow-lg">
                    <Loader2 className="h-8 w-8 text-teal-500 animate-spin" />
                    <p className="text-gray-400 text-sm font-medium">Booting your portfolio...</p>
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
             <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#10E55A]/5 blur-[100px] rounded-full pointer-events-none opacity-40 mix-blend-screen overflow-hidden"></div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Portfolio</h1>
                    <p className="text-gray-400 font-medium text-sm">Manage your AlphaFunds & Analytics</p>
                </div>
                <div className="flex items-center gap-3 relative z-10">
                    <Button
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        className="bg-black border border-gray-800 hover:bg-gray-900 text-gray-300 rounded-lg px-4 h-10 transition-colors shadow-sm text-sm"
                        size="sm"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin text-[#10E55A]' : 'text-gray-500'}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setAddFundsOpen(true)}
                        disabled={verifyingDeposit}
                        className="bg-[#10E55A] hover:bg-[#00CC47] text-black font-bold rounded-lg px-6 h-10 transition-all shadow-none text-sm"
                        size="sm"
                    >
                        {verifyingDeposit ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4 mr-1.5" />
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
                        <h2 className="text-xl font-bold tracking-tight text-white mb-2">Your Holdings</h2>
                        <span className="text-xs font-medium text-gray-400">{portfolio.holdings.length} Active Positions</span>
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
                                    className="bg-black border border-gray-800 shadow-sm text-gray-400 hover:bg-gray-900 hover:text-white rounded-md text-[11px] px-3 font-medium transition-all h-7"
                                >
                                    Sell {h.symbol}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold tracking-tight text-white mb-2">Activities</h2>
                        <span className="text-xs font-medium text-gray-400">{transactions.length} Records</span>
                    </div>
                    <TransactionHistory transactions={transactions} />

                    {/* DCA Auto-Invest Manager */}
                    <DCAManager />
                </div>
            </div>

            {/* How to trade info */}
            <div className="rounded-2xl border border-gray-800 bg-black p-6 shadow-md relative z-10 group overflow-hidden">
                <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[#10E55A] mt-1">
                        <Search className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-white mb-1">Want to discover new assets?</h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
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
                    onTradeSuccess={handleTradeSuccess}
                />
            )}
        </div>
    );
};

export default PortfolioPage;
