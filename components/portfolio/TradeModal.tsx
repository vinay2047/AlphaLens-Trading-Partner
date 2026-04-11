'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { buyStock, sellStock } from '@/lib/actions/portfolio.actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type TradeModalProps = {
    open: boolean;
    onClose: () => void;
    symbol: string;
    company: string;
    currentPrice: number;
    balance: number;
    currentShares?: number;
    defaultType?: 'BUY' | 'SELL';
    marketOpen?: boolean;
};

const TradeModal = ({
    open,
    onClose,
    symbol,
    company,
    currentPrice,
    balance,
    currentShares = 0,
    defaultType = 'BUY',
    marketOpen = true,
}: TradeModalProps) => {
    const [type, setType] = useState<'BUY' | 'SELL'>(defaultType);
    const [shares, setShares] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const shareCount = parseInt(shares) || 0;
    const estimatedTotal = shareCount * currentPrice;
    const maxBuyShares = currentPrice > 0 ? Math.floor(balance / currentPrice) : 0;

    const handleTrade = async () => {
        if (!marketOpen) {
            toast.error('Market is closed', {
                description: 'Trading is available Monday to Friday, 9:30 AM to 4:00 PM ET.',
            });
            return;
        }

        if (shareCount <= 0) {
            toast.error('Enter a valid number of shares');
            return;
        }

        setLoading(true);
        try {
            if (type === 'BUY') {
                const result = await buyStock(symbol, company, shareCount);
                if (result.success) {
                    toast.success(`Bought ${shareCount} shares of ${symbol}`, {
                        description: `Total cost: $${estimatedTotal.toFixed(2)}`,
                    });
                    onClose();
                    router.refresh();
                } else {
                    toast.error('Buy failed', { description: result.error });
                }
            } else {
                const result = await sellStock(symbol, shareCount);
                if (result.success) {
                    toast.success(`Sold ${shareCount} shares of ${symbol}`, {
                        description: `Total revenue: $${estimatedTotal.toFixed(2)}`,
                    });
                    onClose();
                    router.refresh();
                } else {
                    toast.error('Sell failed', { description: result.error });
                }
            }
        } catch {
            toast.error('Trade failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-gray-600 bg-gray-800 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="relative px-6 pt-6 pb-4 border-b border-gray-600/50">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="mb-4">
                        <h2 className="text-xl font-bold text-gray-100">Trade {symbol}</h2>
                        <p className="text-sm text-gray-400 truncate">{company}</p>
                    </div>

                    {/* Buy/Sell tabs */}
                    <div className="flex bg-gray-700/50 rounded-xl p-1">
                        <button
                            onClick={() => setType('BUY')}
                            disabled={!marketOpen}
                            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 ${
                                type === 'BUY'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'text-gray-400 hover:text-gray-300'
                            } ${!marketOpen ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <TrendingUp className="h-4 w-4" />
                            Buy
                        </button>
                        <button
                            onClick={() => setType('SELL')}
                            disabled={!marketOpen}
                            className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all duration-200 ${
                                type === 'SELL'
                                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    : 'text-gray-400 hover:text-gray-300'
                            } ${!marketOpen ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <TrendingDown className="h-4 w-4" />
                            Sell
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6 pt-4 space-y-4">
                    {/* Current Price */}
                    <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-400">Market Price</span>
                        <span className="text-lg font-bold text-gray-100">${currentPrice.toFixed(2)}</span>
                    </div>

                    {/* Info bar */}
                    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-700/30 border border-gray-600/50">
                        <span className="text-xs text-gray-500">
                            {type === 'BUY' ? 'Available' : 'Your Shares'}
                        </span>
                        <span className="text-sm font-medium text-gray-300">
                            {type === 'BUY'
                                ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} (max ${maxBuyShares} shares)`
                                : `${currentShares} shares`
                            }
                        </span>
                    </div>

                    {!marketOpen && (
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                            Market is closed. Trading is available Monday to Friday, 9:30 AM to 4:00 PM ET.
                        </div>
                    )}

                    {/* Shares input */}
                    <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Number of Shares</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={shares}
                            onChange={(e) => setShares(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-gray-200 placeholder:text-gray-600 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50 text-lg font-semibold"
                            min="1"
                            max={type === 'SELL' ? currentShares : maxBuyShares}
                            disabled={!marketOpen}
                        />
                        {/* Quick fill buttons */}
                        <div className="flex gap-2 mt-2">
                            {type === 'BUY' ? (
                                <>
                                    {[25, 50, 75, 100].map((pct) => {
                                        const s = Math.floor(maxBuyShares * (pct / 100));
                                        return (
                                            <button
                                                key={pct}
                                                onClick={() => setShares(s.toString())}
                                                disabled={!marketOpen}
                                                className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-gray-700/50 border border-gray-600 text-gray-400 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
                                            >
                                                {pct}%
                                            </button>
                                        );
                                    })}
                                </>
                            ) : (
                                <>
                                    {[25, 50, 75, 100].map((pct) => {
                                        const s = Math.floor(currentShares * (pct / 100));
                                        return (
                                            <button
                                                key={pct}
                                                onClick={() => setShares(s.toString())}
                                                disabled={!marketOpen}
                                                className="flex-1 py-1.5 text-xs font-medium rounded-lg bg-gray-700/50 border border-gray-600 text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-colors"
                                            >
                                                {pct}%
                                            </button>
                                        );
                                    })}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Estimated total */}
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-700/30 border border-gray-600/50">
                        <span className="text-sm font-medium text-gray-400">Estimated Total</span>
                        <span className={`text-xl font-bold ${type === 'BUY' ? 'text-amber-400' : 'text-emerald-400'}`}>
                            ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Trade button */}
                    <Button
                        onClick={handleTrade}
                        disabled={loading || shareCount <= 0 || !marketOpen}
                        className={`w-full h-12 font-semibold text-base rounded-xl shadow-lg transition-all duration-200 ${
                            type === 'BUY'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-gray-900'
                                : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white'
                        }`}
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                {type === 'BUY' ? (
                                    <TrendingUp className="h-5 w-5 mr-2" />
                                ) : (
                                    <TrendingDown className="h-5 w-5 mr-2" />
                                )}
                                {type === 'BUY' ? 'Buy' : 'Sell'} {shareCount > 0 ? `${shareCount} Shares` : symbol}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TradeModal;
