export const dynamic = "force-dynamic";

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
        <div className="relative text-white font-sans w-full">
             {/* Subtle ambient lighting */}
             <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Header Section */}
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between relative z-10">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-2">
                        <span className="text-teal-400">Market</span> & <span className="text-white">Insights Center</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md font-medium">
                        Experience the premium edge in trading clarity with real-time analytics.
                    </p>
                </div>
                
                <div className="flex gap-3">
                    <Link
                        href="/portfolio"
                        className="flex items-center gap-2 rounded-xl bg-gray-800 border border-gray-700 px-6 py-3 text-sm font-semibold hover:border-teal-500/50 hover:bg-gray-700 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    >
                        <TrendingUp className="h-4 w-4 text-teal-400" />
                        Portfolio
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-sm font-bold text-black border border-teal-300 hover:bg-teal-300 transition-all shadow-[0_0_20px_rgba(16,229,90,0.2)]"
                    >
                        <BarChart3 className="h-4 w-4" />
                        Leaderboard
                    </Link>
                </div>
            </div>

            {/* Bento Grid Layout - Thematic Pure Black Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
                
                {/* Market Overview - Large Featured Card */}
                <div className="md:col-span-2 xl:col-span-2 bg-[#000000] rounded-[2rem] border border-gray-800 p-2 overflow-hidden hover:border-teal-500/30 transition-all duration-300 shadow-2xl relative group">
                    <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none blur-2xl rounded-full scale-150"></div>
                    <div className="px-5 py-4 flex justify-between items-center relative z-10 border-b border-gray-800/50 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Global Overview</span>
                        <ArrowUpRight className="h-4 w-4 text-gray-500" />
                    </div>
                    <div className="relative z-10">
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}market-overview.js`}
                            config={MARKET_OVERVIEW_WIDGET_CONFIG}
                            className="bg-[#000000]"
                            height={400}
                        />
                    </div>
                </div>

                {/* Heatmap Card  */}
                <div className="md:col-span-2 xl:col-span-2 bg-[#000000] rounded-[2rem] border border-gray-800 p-2 overflow-hidden hover:border-teal-500/30 transition-all duration-300 shadow-2xl relative group">
                   <div className="px-5 py-4 flex justify-between items-center border-b border-gray-800/50 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Stock Heatmap</span>
                        <div className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 font-bold text-[10px] tracking-wider border border-teal-500/20 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span> LIVE
                        </div>
                    </div>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={400}
                    />
                </div>

                {/* Market Quotes - Wide Bottom Card */}
                <div className="md:col-span-2 xl:col-span-3 bg-[#000000] rounded-[2rem] border border-gray-800 p-2 overflow-hidden hover:border-teal-500/30 transition-all duration-300 shadow-2xl">
                    <div className="px-5 py-4 border-b border-gray-800/50 mb-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Quotes & Assets</span>
                    </div>
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={500}
                    />
                </div>

                {/* News Timeline - Vertical Card */}
                <div className="md:col-span-2 xl:col-span-1 bg-[#000000] rounded-[2rem] border border-gray-800 p-2 overflow-hidden hover:border-teal-500/30 transition-all duration-300 shadow-2xl">
                    <div className="px-5 py-4 border-b border-gray-800/50 mb-2">
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