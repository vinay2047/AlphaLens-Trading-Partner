'use client';

import { useState, useEffect } from 'react';
import { getUserDCAPlans, createDCAPlan, toggleDCAPlan, deleteDCAPlan, type DCAPlanData, type DCAFormData } from '@/lib/actions/dca.actions';
import { Button } from '@/components/ui/button';
import { Plus, Repeat, Pause, Play, Trash2, Loader2, X, Calendar, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const FREQUENCY_OPTIONS = [
    { value: 'DAILY', label: 'Daily', desc: 'Every day' },
    { value: 'WEEKLY', label: 'Weekly', desc: 'Every 7 days' },
    { value: 'BIWEEKLY', label: 'Bi-weekly', desc: 'Every 14 days' },
    { value: 'MONTHLY', label: 'Monthly', desc: 'Every 30 days' },
];

const DCAManager = () => {
    const [plans, setPlans] = useState<DCAPlanData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<DCAFormData>({ symbol: '', company: '', amount: 100, frequency: 'WEEKLY' });
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const loadPlans = async () => {
        try {
            const result = await getUserDCAPlans();
            if (result.success && result.data) setPlans(result.data);
        } catch {
            toast.error('Failed to load DCA plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadPlans(); }, []);

    const handleCreate = async () => {
        if (!formData.symbol.trim()) { toast.error('Enter a stock symbol'); return; }
        if (formData.amount < 1) { toast.error('Minimum amount is $1'); return; }

        setSubmitting(true);
        try {
            const result = await createDCAPlan({
                ...formData,
                symbol: formData.symbol.toUpperCase(),
                company: formData.company || formData.symbol.toUpperCase(),
            });
            if (result.success) {
                toast.success(`DCA plan created for ${formData.symbol.toUpperCase()}`);
                setShowForm(false);
                setFormData({ symbol: '', company: '', amount: 100, frequency: 'WEEKLY' });
                loadPlans();
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to create plan');
            }
        } catch {
            toast.error('Failed to create plan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggle = async (planId: string) => {
        const result = await toggleDCAPlan(planId);
        if (result.success) {
            loadPlans();
            toast.success('Plan updated');
        } else {
            toast.error(result.error || 'Failed');
        }
    };

    const handleDelete = async (planId: string, symbol: string) => {
        const result = await deleteDCAPlan(planId);
        if (result.success) {
            setPlans(prev => prev.filter(p => p.id !== planId));
            toast.success(`DCA plan for ${symbol} deleted`);
        } else {
            toast.error(result.error || 'Failed');
        }
    };

    return (
        <div className="rounded-[2rem] border border-gray-900 bg-[#0a0a0a] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-900 flex items-center justify-between bg-gradient-to-b from-white/[0.02] to-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20">
                        <Repeat className="h-5 w-5 text-[#22c55e]" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Auto-Invest (DCA)</h3>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Smart Wealth Building</p>
                    </div>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    size="sm"
                    className={`rounded-full transition-all px-4 ${
                        showForm 
                        ? 'bg-white/10 text-white hover:bg-white/20' 
                        : 'bg-[#22c55e] text-black font-bold hover:bg-[#1da850]'
                    }`}
                >
                    {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4 mr-1.5" />}
                    {showForm ? 'Cancel' : 'New Plan'}
                </Button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="px-6 py-6 border-b border-gray-900 bg-white/[0.01] space-y-5 animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Asset Symbol</label>
                            <input
                                type="text"
                                placeholder="BTC, AAPL..."
                                value={formData.symbol}
                                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-gray-800 text-white font-bold placeholder:text-gray-700 focus:border-[#22c55e] focus:outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Buy Amount ($)</label>
                            <input
                                type="number"
                                placeholder="100"
                                value={formData.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-4 py-3 rounded-xl bg-[#141414] border border-gray-800 text-white font-bold focus:border-[#22c55e] focus:outline-none transition-all"
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Frequency</label>
                        <div className="grid grid-cols-4 gap-2">
                            {FREQUENCY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFormData(prev => ({ ...prev, frequency: opt.value as DCAFormData['frequency'] }))}
                                    className={`py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                                        formData.frequency === opt.value
                                            ? 'bg-[#22c55e] border-[#22c55e] text-black shadow-lg shadow-[#22c55e]/10'
                                            : 'bg-[#141414] border-gray-800 text-gray-500 hover:border-gray-600'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Button
                        onClick={handleCreate}
                        disabled={submitting}
                        className="w-full h-12 bg-[#22c55e] hover:bg-[#1da850] text-black font-bold rounded-xl text-sm transition-all active:scale-[0.98]"
                    >
                        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Confirm Strategy'}
                    </Button>
                </div>
            )}

            {/* Plans list */}
            <div className="divide-y divide-gray-900">
                {loading ? (
                    <div className="py-12 text-center">
                        <Loader2 className="h-8 w-8 text-[#22c55e] animate-spin mx-auto" />
                    </div>
                ) : plans.length === 0 ? (
                    <div className="py-16 text-center">
                        <Activity className="h-10 w-10 text-gray-800 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-400">No active strategies found</p>
                        <p className="text-xs text-gray-600 mt-2 max-w-[200px] mx-auto leading-relaxed">
                            Create a plan to automate your wealth building journey.
                        </p>
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div key={plan.id} className="px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-white">{plan.symbol}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${plan.active ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'bg-gray-800 text-gray-500'}`}>
                                            {plan.active ? 'Running' : 'Paused'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                                        <span className="text-white">${plan.amount}</span> / {plan.frequency.toLowerCase()}
                                        <span className="mx-1 text-gray-800">•</span>
                                        {plan.totalExecuted} executed
                                        <span className="mx-1 text-gray-800">•</span>
                                        <span className="text-[#22c55e] font-bold">${plan.totalInvested.toLocaleString()} Total</span>
                                    </p>
                                    {plan.active && (
                                        <p className="text-[10px] font-bold text-gray-600 flex items-center gap-1.5 pt-1 uppercase tracking-tighter">
                                            <Calendar className="h-3 w-3" />
                                            Next Cycle: {new Date(plan.nextExecutionAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggle(plan.id)}
                                        className="p-2.5 rounded-xl bg-[#141414] border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-all"
                                        title={plan.active ? 'Pause Strategy' : 'Resume Strategy'}
                                    >
                                        {plan.active ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan.id, plan.symbol)}
                                        className="p-2.5 rounded-xl bg-[#141414] border border-gray-800 text-gray-400 hover:text-red-500 hover:border-red-900/50 transition-all"
                                        title="Delete Strategy"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DCAManager;