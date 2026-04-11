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
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative z-10 w-full max-w-md mx-4 rounded-[2xl] border border-gray-800 bg-[#000000] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Header */}
                <div className="relative px-8 pt-8 pb-5 border-b border-gray-800">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-1.5 rounded-xl hover:bg-gray-900 border border-transparent hover:border-gray-800 text-gray-500 hover:text-white transition-all shadow-sm"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="mb-5">
                        <h2 className="text-2xl font-bold tracking-tight text-white">Trade {symbol}</h2>
                        <p className="text-sm font-medium text-gray-500 truncate">{company}</p>
                    </div>

                    {/* Buy/Sell tabs */}
                    <div className="flex bg-gray-900 rounded-[14px] p-1.5 border border-gray-800 shadow-inner">
                        <button
                            onClick={() => setType('BUY')}
                            disabled={!marketOpen}
                            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-200 ${
                                type === 'BUY'
                                    ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/30'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                            } ${!marketOpen ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <TrendingUp className="h-4 w-4" />
                            BUY
                        </button>
                        <button
                            onClick={() => setType('SELL')}
                            disabled={!marketOpen}
                            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-200 ${
                                type === 'SELL'
                                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                            } ${!marketOpen ? 'cursor-not-allowed opacity-50' : ''}`}
                        >
                            <TrendingDown className="h-4 w-4" />
                            SELL
                        </button>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-5 space-y-5">
                    {/* Current Price */}
                    <div className="flex items-center justify-between py-1">
                        <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Market Price</span>
                        <span className="text-xl font-bold tracking-tight text-white">${currentPrice.toFixed(2)}</span>
                    </div>

                    {/* Info bar */}
                    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-900 border border-gray-800 shadow-inner">
                        <span className="text-xs uppercase tracking-widest font-bold text-gray-500">
                            {type === 'BUY' ? 'Available Funds' : 'Your Shares'}
                        </span>
                        <span className="text-sm font-extrabold text-white">
                            {type === 'BUY'
                                ? `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })} (max ${maxBuyShares})`
                                : `${currentShares} shares`
                            }
                        </span>
                    </div>

                    {!marketOpen && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-500">
                            Market is closed. Trading is available Monday to Friday, 9:30 AM to 4:00 PM ET.
                        </div>
                    )}

                    {/* Shares input */}
                    <div>
                        <label className="text-xs uppercase tracking-widest font-bold text-gray-500 mb-2 block ml-1">Order Quantity</label>
                        <input
                            type="number"
                            placeholder="0"
                            value={shares}
                            onChange={(e) => setShares(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl bg-gray-900 border border-gray-800 text-white placeholder:text-gray-800 focus:border-[#22c55e] focus:outline-none focus:bg-[#000000] text-xl font-black shadow-inner transition-colors"
                            min="1"
                            max={type === 'SELL' ? currentShares : maxBuyShares}
                            disabled={!marketOpen}
                        />
                        {/* Quick fill buttons */}
                        <div className="flex gap-2 mt-3">
                            {type === 'BUY' ? (
                                <>
                                    {[25, 50, 75, 100].map((pct) => {
                                        const s = Math.floor(maxBuyShares * (pct / 100));
                                        return (
                                            <button
                                                key={pct}
                                                onClick={() => setShares(s.toString())}
                                                disabled={!marketOpen}
                                                className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-gray-900 border border-gray-800 text-gray-500 hover:text-[#22c55e] hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 transition-all outline-none"
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
                                                className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-gray-900 border border-gray-800 text-gray-500 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all outline-none"
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
                    <div className="flex items-center justify-between py-5 px-5 rounded-2xl bg-[#000000] border-2 border-gray-900">
                        <span className="text-xs uppercase tracking-widest font-bold text-gray-500">Estimated Total</span>
                        <span className={`text-2xl font-black tracking-tight ${type === 'BUY' ? 'text-[#22c55e]' : 'text-white'}`}>
                            ${estimatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Trade button */}
                    <Button
                        onClick={handleTrade}
                        disabled={loading || shareCount <= 0 || !marketOpen}
                        className={`w-full h-14 font-black tracking-tight text-lg rounded-2xl shadow-xl transition-all duration-300 mt-2 ${
                            type === 'BUY'
                                ? 'bg-[#22c55e] hover:bg-[#1da850] text-[#000000] shadow-[#22c55e]/20 hover:shadow-[#22c55e]/40 hover:-translate-y-0.5'
                                : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5'
                        }`}
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                {type === 'BUY' ? 'EXECUTE BUY' : 'EXECUTE SELL'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TradeModal;
