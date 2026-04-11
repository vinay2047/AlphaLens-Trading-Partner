'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, X, Sparkles } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const PRESET_AMOUNTS = [100, 500, 1000, 5000];

const AddFundsModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const [amount, setAmount] = useState<number>(100);
    const [customAmount, setCustomAmount] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddFunds = async () => {
        const finalAmount = isCustom ? parseFloat(customAmount) : amount;
        if (!finalAmount || finalAmount < 1) {
            toast.error('Please enter a valid amount');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: finalAmount }),
            });

            const data = await res.json();

            if (data.url) {
                const stripe = await stripePromise;
                if (stripe) {
                    window.location.href = data.url;
                }
            } else {
                toast.error('Failed to initiate payment');
            }
        } catch {
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-gray-600 bg-gray-800 shadow-2xl overflow-hidden">
                {/* Header gradient */}
                <div className="relative bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 px-6 pt-6 pb-8">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-700/50 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-teal-500/20 border border-teal-500/30">
                            <Sparkles className="h-5 w-5 text-teal-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-100">Add AlphaFunds</h2>
                            <p className="text-sm text-gray-400">Fund your trading portfolio</p>
                        </div>
                    </div>
                </div>

                <div className="px-6 pb-6 pt-4 space-y-5">
                    {/* Preset amounts */}
                    <div>
                        <p className="text-sm font-medium text-gray-400 mb-3">Select amount</p>
                        <div className="grid grid-cols-2 gap-2.5">
                            {PRESET_AMOUNTS.map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => {
                                        setAmount(preset);
                                        setIsCustom(false);
                                    }}
                                    className={`py-3 px-4 rounded-xl text-base font-semibold transition-all duration-200 border ${
                                        !isCustom && amount === preset
                                            ? 'bg-teal-500/20 border-teal-500/50 text-teal-400 shadow-lg shadow-teal-500/10'
                                            : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                                    }`}
                                >
                                    ${preset.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom amount */}
                    <div>
                        <button
                            onClick={() => setIsCustom(true)}
                            className={`text-sm font-medium transition-colors ${isCustom ? 'text-teal-400' : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            Custom amount
                        </button>
                        {isCustom && (
                            <div className="mt-2 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full pl-7 pr-4 py-3 rounded-xl bg-gray-700/50 border border-gray-600 text-gray-200 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500/50 text-base"
                                    min="1"
                                    step="0.01"
                                />
                            </div>
                        )}
                    </div>

                    {/* Pay button */}
                    <Button
                        onClick={handleAddFunds}
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-gray-900 font-semibold text-base rounded-xl shadow-lg hover:shadow-teal-500/20 transition-all duration-200"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                <CreditCard className="h-5 w-5 mr-2" />
                                Pay ${(isCustom ? parseFloat(customAmount) || 0 : amount).toLocaleString()}
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                        Secured by Stripe • 256-bit SSL encryption
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddFundsModal;
