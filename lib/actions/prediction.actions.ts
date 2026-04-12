'use server';

import { getStockCandles } from './finnhub.actions';

const PREDICTION_SERVICE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://alpha-lens-3464.onrender.com';

export type PredictionForecastDay = {
    date: string;
    price: number;
    day: number;
};

export type PredictionResponse = {
    symbol: string;
    current_price: number;
    predicted_price: number;
    price_change: number;
    price_change_pct: number;
    direction: 'BULLISH' | 'BEARISH';
    confidence: number;
    forecast: PredictionForecastDay[];
    models_used: string[];
    is_mock?: boolean;
};

/**
 * Fetches the 7-day ML prediction from the FastAPI service.
 * If the service is offline (or the environment is misconfigured), it falls back
 * to a simulated prediction using real Finnhub quotes so the UI remains functional.
 */
export async function getMLPricePrediction(symbol: string, days: number = 7): Promise<PredictionResponse> {
    try {
        // Fetch historical data for the payload
        const candles = await getStockCandles(symbol, 160);
        
        const open = candles.length > 0 ? candles.map(c => c.o).slice(-110) : [];
        const high = candles.length > 0 ? candles.map(c => c.h).slice(-110) : [];
        const low = candles.length > 0 ? candles.map(c => c.l).slice(-110) : [];
        const close = candles.length > 0 ? candles.map(c => c.c).slice(-110) : [];
        const volume = candles.length > 0 ? candles.map(c => c.v).slice(-110) : [];

        // The unified backend exposes /api/predict 
        const response = await fetch(`${PREDICTION_SERVICE_URL}/api/predict`, {
            method: 'POST',
            next: { revalidate: 300 }, // Cache for 5 minutes
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ticker: symbol.toUpperCase(),
                open,
                high,
                low,
                close,
                volume,
                days
            })
        });

        if (!response.ok) {
            throw new Error(`Prediction API returned ${response.status}`);
        }

        const data = await response.json();
        return data as PredictionResponse;
    } catch (error) {
        console.error(`[Prediction Service Error] Failed to fetch prediction for ${symbol}:`, error);
        throw error;
    }
}
