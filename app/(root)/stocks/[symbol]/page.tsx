import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import StockSentimentCard from "@/components/stocks/StockSentimentCard";
import StockTradePanel from "@/components/stocks/StockTradePanel";
import AIStockAnalysis from "@/components/stocks/AIStockAnalysis";
import AnomalyBanner from "@/components/stocks/AnomalyBanner";
import NewsSentimentMeter from "@/components/stocks/NewsSentimentMeter";
import PricePredictionCard from "@/components/stocks/PricePredictionCard";
import ShadowPortfolioCard from "@/components/stocks/ShadowPortfolioCard";
import StockDashboardTabs from "@/components/stocks/StockDashboardTabs";
import {
    SYMBOL_INFO_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    BASELINE_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

import { auth } from '@clerk/nextjs/server';
import { isStockInWatchlist } from '@/lib/actions/watchlist.actions';
import { getStockSentimentInsights } from '@/lib/actions/adanos.actions';
import { getNewsSentiment } from '@/lib/actions/sentiment.actions';
import { getUserHoldingForSymbol, getPortfolioBalance } from '@/lib/actions/portfolio.actions';
import { formatSymbolForTradingView } from '@/lib/utils';

export default async function StockDetails({ params }: StockDetailsPageProps) {
    const { symbol } = await params;
    const tvSymbol = formatSymbolForTradingView(symbol);
    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    const { userId } = await auth();

    const [isInWatchlist, sentimentInsights, holding, balance, newsSentiment] = await Promise.all([
        userId ? isStockInWatchlist(userId, symbol) : Promise.resolve(false),
        getStockSentimentInsights(symbol),
        getUserHoldingForSymbol(symbol),
        getPortfolioBalance(),
        getNewsSentiment(symbol),
    ]);

    return (
        <div className="flex min-h-[calc(100vh-3.5rem)] p-4 md:p-6 lg:p-8">
            <StockDashboardTabs
                symbolInfo={
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}symbol-info.js`}
                        config={SYMBOL_INFO_WIDGET_CONFIG(tvSymbol)}
                        height={170}
                    />
                }
                watchlistButton={
                    <WatchlistButton
                        symbol={symbol.toUpperCase()}
                        company={symbol.toUpperCase()}
                        isInWatchlist={isInWatchlist}
                        userId={userId || undefined}
                    />
                }
                candleChart={
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={CANDLE_CHART_WIDGET_CONFIG(tvSymbol)}
                        className="custom-chart"
                        height={600}
                        allowExpand={true}
                    />
                }
                baseline={
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}advanced-chart.js`}
                        config={BASELINE_WIDGET_CONFIG(tvSymbol)}
                        className="custom-chart"
                        height={600}
                        allowExpand={true}
                    />
                }
                tradePanel={
                    <StockTradePanel
                        symbol={symbol.toUpperCase()}
                        balance={balance}
                        currentShares={holding?.shares || 0}
                    />
                }
                anomalyBanner={<AnomalyBanner symbol={symbol.toUpperCase()} />}
                pricePrediction={<PricePredictionCard symbol={symbol.toUpperCase()} />}
                shadowPortfolio={<ShadowPortfolioCard symbol={symbol.toUpperCase()} />}
                aiAnalysis={<AIStockAnalysis symbol={symbol.toUpperCase()} />}
                newsSentiment={<NewsSentimentMeter data={newsSentiment} />}
                insightCard={<StockSentimentCard insight={sentimentInsights} />}
                technicalAnalysis={
                    <div style={{ filter: 'url(#tv-green-filter)' }}>
                        <svg width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }}>
                            <defs>
                                <filter id="tv-green-filter" colorInterpolationFilters="sRGB">
                                    <feColorMatrix type="hueRotate" values="-75" result="hued" />
                                    <feColorMatrix in="hued" type="saturate" values="1.4" />
                                </filter>
                            </defs>
                        </svg>
                        <TradingViewWidget
                            scriptUrl={`${scriptUrl}technical-analysis.js`}
                            config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(tvSymbol)}
                            height={400}
                        />
                    </div>
                }
                companyProfile={
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}company-profile.js`}
                        config={COMPANY_PROFILE_WIDGET_CONFIG(tvSymbol)}
                        height={440}
                    />
                }
                financials={
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}financials.js`}
                        config={COMPANY_FINANCIALS_WIDGET_CONFIG(tvSymbol)}
                        height={800}
                    />
                }
            />
        </div>
    );
}
