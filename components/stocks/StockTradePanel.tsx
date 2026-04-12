'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import TradeModal, { type TradeSuccessPayload } from '@/components/portfolio/TradeModal';
import Link from 'next/link';
import { getUsMarketStatus } from '@/lib/utils';

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
    const [marketStatus, setMarketStatus] = useState(() => getUsMarketStatus());
    const [localBalance, setLocalBalance] = useState(balance);
    const [localShares, setLocalShares] = useState(currentShares);

    useEffect(() => {
        setLocalBalance(balance);
    }, [balance]);

    useEffect(() => {
        setLocalShares(currentShares);
    }, [currentShares]);

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

    useEffect(() => {
        const syncMarketStatus = () => setMarketStatus(getUsMarketStatus());
        syncMarketStatus();
        const intervalId = window.setInterval(syncMarketStatus, 60_000);
        return () => window.clearInterval(intervalId);
    }, []);

    const openBuy = () => {
        setTradeType('BUY');
        setTradeOpen(true);
    };

    const openSell = () => {
        setTradeType('SELL');
        setTradeOpen(true);
    };

    const handleTradeSuccess = ({ type, shares, totalAmount }: TradeSuccessPayload) => {
        if (type === 'BUY') {
            setLocalBalance((prev) => Math.max(0, prev - totalAmount));
            setLocalShares((prev) => prev + shares);
            return;
        }

        setLocalBalance((prev) => prev + totalAmount);
        setLocalShares((prev) => Math.max(0, prev - shares));
    };

    return (
        <>
            <div className="rounded-2xl border border-gray-800 bg-gray-950/40 backdrop-blur-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Trade {symbol}</span>
                    {currentPrice > 0 && (
                        <span className="text-base font-bold text-gray-100">
                            ${currentPrice.toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="p-5 space-y-4">
                    {/* Balance & Holdings */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl border border-gray-800 bg-black/20">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-1.5">Balance</p>
                            <p className="text-sm font-bold text-gray-200">
                                ${localBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="p-3 rounded-xl border border-gray-800 bg-black/20">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-600 mb-1.5">Shares</p>
                            <p className="text-sm font-bold text-gray-200">
                                {localShares > 0 ? localShares.toLocaleString() : '0'}
                            </p>
                        </div>
                    </div>

                    {/* Trade buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={openBuy}
                            disabled={loading || !marketStatus.isOpen}
                            className="h-9 bg-[#10E55A] hover:bg-[#00CC47] text-black text-xs font-bold rounded-xl transition-all shadow-none disabled:opacity-40"
                        >
                            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                            Buy
                        </Button>
                        <Button
                            onClick={openSell}
                            disabled={loading || localShares <= 0 || !marketStatus.isOpen}
                            className="h-9 bg-transparent hover:bg-[#FF3B30]/10 text-[#FF3B30] border border-[#FF3B30]/30 hover:border-[#FF3B30]/70 text-xs font-bold rounded-xl transition-all disabled:opacity-30"
                        >
                            <TrendingDown className="h-3.5 w-3.5 mr-1.5" />
                            Sell
                        </Button>
                    </div>

                    {/* Market status */}
                    <p className={`text-[10px] text-center font-medium ${
                        marketStatus.isOpen ? 'text-[#10E55A]/70' : 'text-amber-400/60'
                    }`}>
                        {marketStatus.label}
                    </p>

                    {/* Portfolio Link */}
                    <Link
                        href="/portfolio"
                        className="block text-center text-xs text-gray-600 hover:text-gray-400 transition-colors"
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
                    balance={localBalance}
                    currentShares={localShares}
                    defaultType={tradeType}
                    marketOpen={marketStatus.isOpen}
                    onTradeSuccess={handleTradeSuccess}
                />
            )}
        </>
    );
};

export default StockTradePanel;
