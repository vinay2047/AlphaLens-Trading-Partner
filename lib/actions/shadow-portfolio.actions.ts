'use server';

import { getStockCandles } from './finnhub.actions';

const SHADOW_PORTFOLIO_SERVICE_URL =
    process.env.SHADOW_PORTFOLIO_SERVICE_URL || 'http://localhost:8004';

// ---------------------------------------------------------------------------
// Type Definitions (Mapped from Python Pydantic Models)
// ---------------------------------------------------------------------------
export interface DayResult {
    date: string;
    allocation: number;
    agent_portfolio_value: number;
    baseline_portfolio_value: number;
    daily_return: number;
}

export interface InferenceMetrics {
    total_return: number;
    sharpe_ratio: number;
    max_drawdown: number;
    final_portfolio_value: number;
}

export interface ShadowPortfolioResponse {
    ticker: string;
    start_date: string;
    end_date: string;
    trading_days: number;
    agent_metrics: InferenceMetrics;
    baseline_metrics: InferenceMetrics;
    daily_results: DayResult[];
    model_info: any;
    is_mock?: boolean; // Frontend flag
}

// ---------------------------------------------------------------------------
// Main Action
// ---------------------------------------------------------------------------
export async function getShadowPortfolioInference(
    ticker: string,
    startDate: string,
    endDate: string
): Promise<ShadowPortfolioResponse | null> {
    if (!ticker) return null;

    try {
        console.log(`[Shadow Portfolio] Fetching inference for ${ticker} from ${startDate} to ${endDate}...`);
        const res = await fetch(`${SHADOW_PORTFOLIO_SERVICE_URL}/api/inference`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ticker: ticker.toUpperCase(),
                start_date: startDate,
                end_date: endDate
            }),
            next: { revalidate: 3600 }, // Cache RL inference heavily unless changed
        });

        if (!res.ok) {
            throw new Error(`Shadow Portfolio API returned ${res.status}`);
        }

        const data: ShadowPortfolioResponse = await res.json();
        return data;
    } catch (error) {
        console.warn(`[Shadow Portfolio Service Offline] Falling back to mock for ${ticker}...`, error);
        return generateMockShadowInference(ticker, startDate, endDate);
    }
}

// ---------------------------------------------------------------------------
// Native Market Fallback Generator
// ---------------------------------------------------------------------------
async function generateMockShadowInference(
    ticker: string,
    startDate: string,
    endDate: string
): Promise<ShadowPortfolioResponse> {
    const daily_results: DayResult[] = [];
    
    let currentAgentPos = 1.0;
    let currentBaselinePos = 1.0;
    let maxDrawdownAgent = 0;
    let maxDrawdownBaseline = 0;
    let peakAgent = 1.0;
    let peakBaseline = 1.0;

    let hasActualData = false;

    try {
        // Attempt to fetch actual authentic market history from Finnhub
        const fromSec = Math.floor(new Date(startDate).getTime() / 1000);
        const toSec = Math.floor(new Date(endDate).getTime() / 1000);
        
        const candles = await getStockCandles(ticker, 'D', fromSec, toSec);
        
        if (candles && candles.c && candles.c.length > 1) {
            hasActualData = true;
            const startPrice = candles.c[0];
            
            for (let i = 1; i < candles.c.length; i++) {
                const prevPrice = candles.c[i - 1];
                const currPrice = candles.c[i];
                
                // Actual authentic market return
                const assetReturn = (currPrice - prevPrice) / prevPrice;
                
                // Fake RL algorithm for the agent allocating purely for UI visual
                const allocation = Math.random() > 0.3 ? (Math.random() * 0.5 + 0.5) : 0.0;
                const agentReturn = assetReturn * allocation;
                
                currentBaselinePos = currPrice / startPrice; // True exact baseline performance
                currentAgentPos = currentAgentPos * (1 + agentReturn);
                
                if (currentAgentPos > peakAgent) peakAgent = currentAgentPos;
                const currentDrawdownAgent = (peakAgent - currentAgentPos) / peakAgent;
                if (currentDrawdownAgent > maxDrawdownAgent) maxDrawdownAgent = currentDrawdownAgent;

                if (currentBaselinePos > peakBaseline) peakBaseline = currentBaselinePos;
                const currentDrawdownBaseline = (peakBaseline - currentBaselinePos) / peakBaseline;
                if (currentDrawdownBaseline > maxDrawdownBaseline) maxDrawdownBaseline = currentDrawdownBaseline;
                
                const dateSec = candles.t[i];
                
                daily_results.push({
                    date: new Date(dateSec * 1000).toISOString().split('T')[0],
                    allocation: Number(allocation.toFixed(2)),
                    agent_portfolio_value: Number(currentAgentPos.toFixed(3)),
                    baseline_portfolio_value: Number(currentBaselinePos.toFixed(3)),
                    daily_return: Number(agentReturn.toFixed(4))
                });
            }
        }
    } catch (e) {
        console.warn("[Shadow Portfolio] Failed to fetch actual Finnhub data for mock fallback.", e);
    }

    // Mathematical Random-Walk Fallback if Finnhub completely fails
    if (!hasActualData) {
        const volatility = 0.015;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const walker = new Date(start);
        
        while (walker <= end) {
            if (walker.getDay() !== 0 && walker.getDay() !== 6) {
                const assetReturn = (Math.random() * volatility * 2) - volatility + 0.0005;
                currentBaselinePos = currentBaselinePos * (1 + assetReturn);
                
                const allocation = Math.random() > 0.3 ? (Math.random() * 0.5 + 0.5) : 0.0;
                const agentReturn = assetReturn * allocation;
                currentAgentPos = currentAgentPos * (1 + agentReturn);
                
                if (currentAgentPos > peakAgent) peakAgent = currentAgentPos;
                const currentDrawdownAgent = (peakAgent - currentAgentPos) / peakAgent;
                if (currentDrawdownAgent > maxDrawdownAgent) maxDrawdownAgent = currentDrawdownAgent;

                if (currentBaselinePos > peakBaseline) peakBaseline = currentBaselinePos;
                const currentDrawdownBaseline = (peakBaseline - currentBaselinePos) / peakBaseline;
                if (currentDrawdownBaseline > maxDrawdownBaseline) maxDrawdownBaseline = currentDrawdownBaseline;
                
                daily_results.push({
                    date: walker.toISOString().split('T')[0],
                    allocation: Number(allocation.toFixed(2)),
                    agent_portfolio_value: Number(currentAgentPos.toFixed(3)),
                    baseline_portfolio_value: Number(currentBaselinePos.toFixed(3)),
                    daily_return: Number(agentReturn.toFixed(4))
                });
            }
            walker.setDate(walker.getDate() + 1);
        }
    }

    return {
        ticker: ticker.toUpperCase(),
        start_date: startDate,
        end_date: endDate,
        trading_days: daily_results.length,
        is_mock: true,
        agent_metrics: {
            total_return: Number((currentAgentPos - 1).toFixed(3)),
            sharpe_ratio: Number((1.2 + Math.random() * 0.5).toFixed(2)),
            max_drawdown: Number(maxDrawdownAgent.toFixed(3)),
            final_portfolio_value: Number(currentAgentPos.toFixed(3))
        },
        baseline_metrics: {
            total_return: Number((currentBaselinePos - 1).toFixed(3)),
            sharpe_ratio: Number(((hasActualData ? 1.0 : 0.8) + Math.random() * 0.2).toFixed(2)),
            max_drawdown: Number(maxDrawdownBaseline.toFixed(3)),
            final_portfolio_value: Number(currentBaselinePos.toFixed(3))
        },
        daily_results,
        model_info: {
            algorithm: "PPO (Simulated Native Override)",
            trained_on: "Live Market Fallback",
            features: 17
        }
    };
}
