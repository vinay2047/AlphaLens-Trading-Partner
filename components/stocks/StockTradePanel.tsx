'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from 'lucide-react';
import TradeModal from '@/components/portfolio/TradeModal';
import Link from 'next/link';

type StockTradePanelProps = {
    symbol: string;
    balance: number;
    currentShares: number;
};

const StockTradePanel = ({ symbol, balance, currentShares }: StockTradePanelProps) => {
    const [tradeOpen, setTradeOpen] = useState(false);
    const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
    const [currentPrice, setCurrentPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrice = async () => {
            try {
                const res = await fetch(
                    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.NEXT_PUBLIC_FINNHUB_API_KEY}`
                );
                const data = await res.json();
                setCurrentPrice(data?.c || 0);
            } catch {
                setCurrentPrice(0);
            } finally {
                setLoading(false);
            }
        };
        fetchPrice();
    }, [symbol]);

    const openBuy = () => {
        setTradeType('BUY');
        setTradeOpen(true);
    };

    const openSell = () => {
        setTradeType('SELL');
        setTradeOpen(true);
    };

    return (
        <>
            <div className="rounded-xl border border-gray-600 bg-gradient-to-br from-gray-800 to-gray-800/80 overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-600/50 bg-gradient-to-r from-teal-500/5 to-cyan-500/5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-100 flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-teal-400" />
                            Trade {symbol}
                        </h3>
                        {currentPrice > 0 && (
                            <span className="text-lg font-bold text-gray-100">
                                ${currentPrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    {/* Balance & Holdings info */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/30">
                            <div className="flex items-center gap-2 mb-1">
                                <Wallet className="h-3.5 w-3.5 text-teal-400" />
                                <span className="text-xs text-gray-500">Balance</span>
                            </div>
                            <p className="text-sm font-bold text-gray-200">
                                ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="p-3 rounded-lg bg-gray-700/30 border border-gray-600/30">
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart3 className="h-3.5 w-3.5 text-blue-400" />
                                <span className="text-xs text-gray-500">Your Shares</span>
                            </div>
                            <p className="text-sm font-bold text-gray-200">
                                {currentShares > 0 ? currentShares.toLocaleString() : '0'}
                            </p>
                        </div>
                    </div>

                    {/* Trade buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={openBuy}
                            disabled={loading}
                            className="h-11 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all"
                        >
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Buy
                        </Button>
                        <Button
                            onClick={openSell}
                            disabled={loading || currentShares <= 0}
                            className="h-11 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/20 transition-all disabled:opacity-40"
                        >
                            <TrendingDown className="h-4 w-4 mr-2" />
                            Sell
                        </Button>
                    </div>

                    {/* Portfolio Link */}
                    <Link
                        href="/portfolio"
                        className="block text-center text-sm text-teal-400 hover:text-teal-300 transition-colors py-1"
                    >
                        View Full Portfolio →
                    </Link>
                </div>
            </div>

            {currentPrice > 0 && (
                <TradeModal
                    open={tradeOpen}
                    onClose={() => setTradeOpen(false)}
                    symbol={symbol}
                    company={symbol}
                    currentPrice={currentPrice}
                    balance={balance}
                    currentShares={currentShares}
                    defaultType={tradeType}
                />
            )}
        </>
    );
};

export default StockTradePanel;
