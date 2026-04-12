'use client';

import React, { useState } from 'react';
import { Activity, Cpu, FileText, LineChart } from 'lucide-react';

interface Props {
    symbolInfo: React.ReactNode;
    candleChart: React.ReactNode;
    baseline: React.ReactNode;
    tradePanel: React.ReactNode;
    anomalyBanner: React.ReactNode;
    pricePrediction: React.ReactNode;
    shadowPortfolio: React.ReactNode;
    aiAnalysis: React.ReactNode;
    newsSentiment: React.ReactNode;
    insightCard: React.ReactNode;
    technicalAnalysis: React.ReactNode;
    companyProfile: React.ReactNode;
    financials: React.ReactNode;
    watchlistButton: React.ReactNode;
}

export default function StockDashboardTabs({
    symbolInfo,
    candleChart,
    baseline,
    tradePanel,
    anomalyBanner,
    pricePrediction,
    shadowPortfolio,
    aiAnalysis,
    newsSentiment,
    insightCard,
    technicalAnalysis,
    companyProfile,
    financials,
    watchlistButton
}: Props) {
    const [activeTab, setActiveTab] = useState<'chart' | 'ai' | 'fundamentals'>('chart');

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Header / Global Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
                <div className="w-full md:w-[58%]">
                    {symbolInfo}
                </div>
                <div className="flex-shrink-0">
                    {watchlistButton}
                </div>
            </div>

            {/* Premium Glassmorphic Tab Navigation */}
            <div className="flex space-x-1 bg-white/[0.02] border border-white/5 p-1 rounded-xl w-full">
                <button
                    onClick={() => setActiveTab('chart')}
                    className={`flex items-center gap-2 flex-1 justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === 'chart' 
                        ? 'bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/30' 
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                >
                    <LineChart className="w-4 h-4" />
                    Trading & Charts
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`flex items-center gap-2 flex-1 justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === 'ai' 
                        ? 'bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/30' 
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Cpu className="w-4 h-4" />
                    AlphaLens AI
                </button>
                <button
                    onClick={() => setActiveTab('fundamentals')}
                    className={`flex items-center gap-2 flex-1 justify-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === 'fundamentals' 
                        ? 'bg-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-500/30' 
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                >
                    <FileText className="w-4 h-4" />
                    Fundamentals
                </button>
            </div>

            {/* Tab Content Areas */}
            
            {/* 1. TRADING & CHARTS TAB */}
            <div className={`transition-all duration-500 ${activeTab === 'chart' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        {candleChart}
                        {technicalAnalysis}
                    </div>
                    <div className="flex flex-col gap-6 h-full lg:col-span-5">
                        {tradePanel}
                        {anomalyBanner}
                        <div className="flex-1 min-h-[400px]">
                            {baseline}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. ALPHALENS AI TAB */}
            <div className={`transition-all duration-500 ${activeTab === 'ai' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="flex flex-col gap-6 lg:col-span-5">
                        {pricePrediction}
                        {shadowPortfolio}
                    </div>
                    <div className="flex flex-col gap-6 lg:col-span-7">
                        {newsSentiment}
                        {insightCard}
                        {aiAnalysis}
                    </div>
                </div>
            </div>

            {/* 3. FUNDAMENTALS TAB */}
            <div className={`transition-all duration-500 ${activeTab === 'fundamentals' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <div className="grid grid-cols-1 gap-6">
                    {companyProfile}
                    {financials}
                </div>
            </div>

        </div>
    );
}
