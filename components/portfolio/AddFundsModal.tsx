'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, X, Sparkles, ShieldCheck } from 'lucide-react';
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

        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
            toast.error('Stripe is not configured', {
                description: 'Add your Stripe publishable key to enable deposits.',
            });
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
                await stripePromise;
                window.location.href = data.url;
            } else {
                toast.error(data.error || 'Failed to initiate payment');
            }
        } catch {
            toast.error('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Darker Backdrop with more blur */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            {/* Modal - Darker theme with emerald accents */}
            <div className="relative z-10 w-full max-w-md rounded-[2rem] border border-gray-800 bg-[#0a0a0a] shadow-[0_0_50px_-12px_rgba(34,197,94,0.2)] overflow-hidden">
                
                {/* Header: Clean Dark Background with subtle green glow */}
                <div className="relative px-8 pt-8 pb-4">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="p-3 rounded-2xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                            <Sparkles className="h-6 w-6 text-[#22c55e]" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Add AlphaFunds</h2>
                            <p className="text-sm text-gray-500 mt-1">Instant deposit to your trading balance</p>
                        </div>
                    </div>
                </div>

                <div className="px-8 pb-8 pt-4 space-y-6">
                    {/* Preset amounts */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Quick Select</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {PRESET_AMOUNTS.map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => {
                                        setAmount(preset);
                                        setIsCustom(false);
                                    }}
                                    className={`py-4 px-4 rounded-2xl text-base font-bold transition-all duration-200 border-2 ${
                                        !isCustom && amount === preset
                                            ? 'bg-[#22c55e] border-[#22c55e] text-black shadow-[0_0_20px_-5px_rgba(34,197,94,0.4)]'
                                            : 'bg-[#141414] border-gray-900 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                                    }`}
                                >
                                    ${preset.toLocaleString()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom amount toggle */}
                    <div className="space-y-3">
                        <button
                            onClick={() => setIsCustom(!isCustom)}
                            className={`text-xs font-bold uppercase tracking-widest transition-colors ${isCustom ? 'text-[#22c55e]' : 'text-gray-500 hover:text-gray-400'}`}
                        >
                            {isCustom ? '← Use Preset' : '+ Custom amount'}
                        </button>
                        
                        {isCustom && (
                            <div className="relative animate-in slide-in-from-top-2 duration-200">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#22c55e] font-bold text-lg">$</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    className="w-full pl-10 pr-4 py-4 rounded-2xl bg-[#141414] border-2 border-gray-900 text-white placeholder:text-gray-700 focus:border-[#22c55e] focus:outline-none transition-all text-lg font-bold"
                                    min="1"
                                    step="0.01"
                                    autoFocus
                                />
                            </div>
                        )}
                    </div>

                    {/* Pay button */}
                    <Button
                        onClick={handleAddFunds}
                        disabled={loading}
                        className="w-full h-14 bg-[#22c55e] hover:bg-[#1da850] text-black font-bold text-lg rounded-2xl shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                    >
                        {loading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                <span>Deposit ${(isCustom ? parseFloat(customAmount) || 0 : amount).toLocaleString()}</span>
                            </div>
                        )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Secured by Stripe • AES-256 Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddFundsModal;