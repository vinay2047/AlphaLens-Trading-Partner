'use client';

import { useState, useEffect } from 'react';
import { getUserDCAPlans, createDCAPlan, toggleDCAPlan, deleteDCAPlan, type DCAPlanData, type DCAFormData } from '@/lib/actions/dca.actions';
import { Button } from '@/components/ui/button';
import { Plus, Repeat, Pause, Play, Trash2, Loader2, X, Calendar } from 'lucide-react';
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
        <div className="rounded-xl border border-gray-600 bg-gray-800 overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-600/50 flex items-center justify-between bg-gradient-to-r from-cyan-500/5 to-teal-500/5">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                        <Repeat className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-100">Auto-Invest (DCA)</h3>
                        <p className="text-xs text-gray-500">Automated dollar-cost averaging</p>
                    </div>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    size="sm"
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs"
                >
                    {showForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 mr-1" />}
                    {showForm ? '' : 'New Plan'}
                </Button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="px-5 py-4 border-b border-gray-600/50 bg-gray-700/20 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Symbol</label>
                            <input
                                type="text"
                                placeholder="AAPL"
                                value={formData.symbol}
                                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                                className="w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-200 text-sm placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-400 mb-1 block">Amount ($)</label>
                            <input
                                type="number"
                                placeholder="100"
                                value={formData.amount}
                                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-200 text-sm placeholder:text-gray-600 focus:border-cyan-500 focus:outline-none"
                                min="1"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-400 mb-1 block">Frequency</label>
                        <div className="grid grid-cols-4 gap-2">
                            {FREQUENCY_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => setFormData(prev => ({ ...prev, frequency: opt.value as DCAFormData['frequency'] }))}
                                    className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                                        formData.frequency === opt.value
                                            ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                                            : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:border-gray-500'
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
                        className="w-full h-9 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-gray-900 font-semibold rounded-lg text-sm"
                    >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Auto-Invest Plan'}
                    </Button>
                </div>
            )}

            {/* Plans list */}
            <div className="divide-y divide-gray-600/30">
                {loading ? (
                    <div className="py-8 text-center">
                        <Loader2 className="h-6 w-6 text-cyan-400 animate-spin mx-auto" />
                    </div>
                ) : plans.length === 0 ? (
                    <div className="py-8 text-center">
                        <Repeat className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No auto-invest plans</p>
                        <p className="text-xs text-gray-600 mt-1">Create a plan to automatically buy stocks on a schedule</p>
                    </div>
                ) : (
                    plans.map((plan) => (
                        <div key={plan.id} className="px-5 py-3.5 hover:bg-gray-700/20 transition-colors">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-gray-100">{plan.symbol}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${plan.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-600/50 text-gray-500'}`}>
                                            {plan.active ? 'Active' : 'Paused'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        ${plan.amount}/{plan.frequency.toLowerCase()} · {plan.totalExecuted} buys · ${plan.totalInvested.toFixed(0)} invested
                                    </p>
                                    {plan.active && (
                                        <p className="text-[10px] text-gray-600 mt-0.5 flex items-center gap-1">
                                            <Calendar className="h-2.5 w-2.5" />
                                            Next: {new Date(plan.nextExecutionAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleToggle(plan.id)}
                                        className="p-1.5 rounded-lg hover:bg-gray-600/50 text-gray-400 hover:text-gray-200 transition-colors"
                                        title={plan.active ? 'Pause' : 'Resume'}
                                    >
                                        {plan.active ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(plan.id, plan.symbol)}
                                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
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
