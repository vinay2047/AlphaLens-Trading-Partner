"use client";

import React from "react";
import { Trash2, TrendingUp, Bell } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface AlertsPanelProps {
    alerts: any[];
    onRefresh?: () => void;
}

export default function AlertsPanel({ alerts, onRefresh }: AlertsPanelProps) {
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this alert?")) {
            const response = await fetch(`/api/alerts?id=${encodeURIComponent(id)}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onRefresh?.();
            }
        }
    };

    return (
        <div className="bg-[#000000] rounded-2xl border border-white/5 p-6 h-full shadow-xl transition-all duration-300 hover:border-[#10E55A]/10 flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <h2 className="text-xl font-bold text-gray-200 flex items-center tracking-wide">
                    <Bell className="w-5 h-5 mr-3 text-[#10E55A]" />
                    Alerts
                </h2>
            </div>

            <div className="space-y-4 flex-1">
                {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center bg-[#000000] rounded-xl border border-dashed border-white/10 p-6">
                        <Bell className="w-8 h-8 text-gray-700 mb-3" />
                        <span className="text-sm font-medium text-gray-500">No active alerts.</span>
                        <span className="text-xs text-gray-600 mt-1">Add one from the watchlist to get pinged on price targets.</span>
                    </div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert._id} className="bg-black/40 rounded-xl p-4 border border-white/5 relative group transition-all hover:border-[#10E55A]/20 hover:bg-black/60 shadow-md">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-900 border border-white/10 flex items-center justify-center font-bold text-sm text-gray-300 shadow-inner group-hover:border-[#10E55A]/30 transition-all">
                                            {alert.symbol[0]}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-200 text-base flex items-center gap-2">
                                                {alert.symbol}
                                                <span className="text-xs bg-white/5 px-2 py-0.5 rounded border border-white/10 font-normal text-gray-400">Target: {formatCurrency(alert.targetPrice)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 text-sm text-[#10E55A] font-medium bg-[#10E55A]/5 inline-block px-2.5 py-1 rounded-md border border-[#10E55A]/10">
                                        Trigger when {alert.condition.toLowerCase()} {formatCurrency(alert.targetPrice)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-3 flex items-center font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#10E55A] mr-2 animate-pulse"></div>
                                        Tracking until {new Date(new Date(alert.createdAt).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="pl-3">
                                    <button
                                        onClick={() => handleDelete(alert._id)}
                                        className="text-gray-600 hover:text-white hover:bg-red-500/20 bg-white/5 border border-white/5 p-2 rounded-lg transition-all"
                                        title="Delete Alert"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
