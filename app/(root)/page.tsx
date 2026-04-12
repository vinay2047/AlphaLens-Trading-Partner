import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import Link from "next/link";
import { TrendingUp, BarChart3} from "lucide-react";

const Home = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Hero Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Real-time market overview</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/portfolio"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-950/40 backdrop-blur-md border border-white/5 text-gray-300 hover:text-[#10E55A] hover:border-[#10E55A]/30 hover:bg-[#10E55A]/5 transition-all"
                    >
                        <TrendingUp className="h-3.5 w-3.5" />
                        Portfolio
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-950/40 backdrop-blur-md border border-white/5 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
                    >
                        <BarChart3 className="h-3.5 w-3.5" />
                        Leaderboard
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-1">
                    <TradingViewWidget
                        title="Market Overview"
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={MARKET_OVERVIEW_WIDGET_CONFIG}
                        className="custom-chart"
                        height={540}
                    />
                </div>
                <div className="xl:col-span-2">
                    <TradingViewWidget
                        title="Stock Heatmap"
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={HEATMAP_WIDGET_CONFIG}
                        height={540}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={540}
                    />
                </div>
                <div className="xl:col-span-1">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        height={540}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home;