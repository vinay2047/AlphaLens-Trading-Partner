import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";
import Link from "next/link";
import { TrendingUp, BarChart3 } from "lucide-react";

const DashboardPage = () => {
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Real-time market overview</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs font-medium text-teal-300 transition hover:bg-teal-500/20"
                    >
                        <TrendingUp className="h-3.5 w-3.5" />
                        Portfolio
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-500/20"
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
};

export default DashboardPage;
