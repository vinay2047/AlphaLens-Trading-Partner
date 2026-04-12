'use server';


const SHADOW_PORTFOLIO_SERVICE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://alpha-lens-3464.onrender.com';

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

    } catch (error) {
        console.error(`[Shadow Portfolio Service Error] Inference failed for ${ticker}:`, error);
        return null;
    }
}
