import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import Link from "next/link";
import { TrendingUp, BarChart3, ArrowUpRight } from "lucide-react";

const DashboardPage = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="min-h-screen bg-[#020d08] p-4 md:p-8 text-white font-sans">
            {/* Header Section: Inspired by the "Switch & Transform" Hero */}
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                        <span className="text-[#22c55e]">Market</span> & <br /> 
                        <span className="text-white">Insights Center</span>
                    </h1>
                    <p className="mt-4 text-gray-400 text-lg max-w-md">
                        Experience the premium edge in trading clarity with real-time analytics.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Link
                        href="/portfolio"
                        className="flex items-center gap-2 rounded-xl bg-[#141414] border border-gray-800 px-5 py-3 text-sm font-semibold hover:border-[#22c55e] transition-all"
                    >
                        <TrendingUp className="h-4 w-4 text-[#22c55e]" />
                        Portfolio
                    </Link>
                    <Link
                        href="/trade"
                        className="flex items-center gap-2 rounded-xl bg-[#22c55e] px-6 py-3 text-sm font-bold text-black hover:bg-[#1da850] transition-all"
                    >
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                
                {/* Market Overview - Large Featured Card */}
                <div className="md:col-span-2 xl:col-span-2 bg-[#0a0a0a] rounded-3xl border border-gray-900 p-1 overflow-hidden transition-hover hover:border-gray-700">
                    <div className="p-4 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Global Overview</span>
                        <ArrowUpRight className="h-4 w-4 text-gray-500" />
                    </div>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        height={400}
                    />
                </div>

                {/* Heatmap Card */}
                <div className="md:col-span-2 xl:col-span-2 bg-[#0a0a0a] rounded-3xl border border-gray-900 p-1 overflow-hidden transition-hover hover:border-gray-700">
                   <div className="p-4 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Stock Heatmap</span>
                        <div className="px-2 py-1 rounded bg-[#22c55e]/10 text-[#22c55e] text-[10px]">LIVE</div>
                    </div>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={400}
                    />
                </div>

                {/* Market Quotes - Wide Bottom Card */}
                <div className="md:col-span-2 xl:col-span-3 bg-[#0a0a0a] rounded-3xl border border-gray-900 p-1 overflow-hidden transition-hover hover:border-gray-700">
                    <div className="p-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Quotes & Assets</span>
                    </div>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={500}
                    />
                </div>

                {/* News Timeline - Vertical Card */}
                <div className="md:col-span-2 xl:col-span-1 bg-[#0a0a0a] rounded-3xl border border-gray-900 p-1 overflow-hidden transition-hover hover:border-gray-700">
                    <div className="p-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Market News</span>
                    </div>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        height={500}
                    />
                </div>

            </div>
        </div>
    );
};

export default DashboardPage;