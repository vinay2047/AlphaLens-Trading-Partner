'use client';

import { useState, useEffect } from 'react';
import { getOrCreatePortfolio, getTransactions } from '@/lib/actions/portfolio.actions';
import PortfolioSummary from '@/components/portfolio/PortfolioSummary';
import HoldingsTable from '@/components/portfolio/HoldingsTable';
import TransactionHistory from '@/components/portfolio/TransactionHistory';
import AddFundsModal from '@/components/portfolio/AddFundsModal';
import TradeModal from '@/components/portfolio/TradeModal';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';

const PortfolioPage = () => {
    const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [addFundsOpen, setAddFundsOpen] = useState(false);
    const [tradeOpen, setTradeOpen] = useState(false);
    const [selectedHolding, setSelectedHolding] = useState<HoldingData | null>(null);
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
        if (payment === 'success' && amount) {
            toast.success(`Successfully added $${amount} to your portfolio!`, {
                description: 'Your AlphaFunds balance has been updated.',
            });
            // Reload data to reflect the deposit
            setTimeout(() => loadData(true), 1000);
        } else if (payment === 'cancelled') {
            toast.info('Payment was cancelled');
        }
    }, [searchParams]);

    const handleSellFromTable = (holding: HoldingData) => {
        setSelectedHolding(holding);
        setTradeOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 text-teal-500 animate-spin" />
                    <p className="text-gray-400 text-lg">Loading your portfolio...</p>
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-100">Portfolio</h1>
                    <p className="text-gray-500 mt-1">Manage your AlphaFunds & Holdings</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => loadData(true)}
                        disabled={refreshing}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-xl px-4"
                        size="sm"
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setAddFundsOpen(true)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-gray-900 font-semibold rounded-xl px-5 shadow-lg hover:shadow-teal-500/20 transition-all"
                        size="sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Funds
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <PortfolioSummary portfolio={portfolio} />

            {/* Holdings & Transactions */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-100">Your Holdings</h2>
                        <span className="text-sm text-gray-500">{portfolio.holdings.length} stocks</span>
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
                                    className="bg-gray-700/50 border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-500/30 rounded-lg text-xs"
                                >
                                    Sell {h.symbol}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-100">Recent Activity</h2>
                        <span className="text-sm text-gray-500">{transactions.length} transactions</span>
                    </div>
                    <TransactionHistory transactions={transactions} />
                </div>
            </div>

            {/* How to trade info */}
            <div className="rounded-xl border border-gray-600/50 bg-gradient-to-br from-gray-800 to-gray-800/50 p-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                        <Search className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-200 mb-1">Want to buy stocks?</h3>
                        <p className="text-gray-400 text-sm">
                            Search for any stock using the search bar in the navigation, then visit the stock detail page to buy or sell shares using your AlphaFunds balance.
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
