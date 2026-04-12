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
        const fromSec = Math.floor(Date.now() / 1000) - (86400 * 160); // roughly 160 days to get 110 trading days
        const toSec = Math.floor(Date.now() / 1000);
        const candles = await getStockCandles(symbol, 'D', fromSec, toSec);
        
        const open = candles.o ? candles.o.slice(-110) : [];
        const high = candles.h ? candles.h.slice(-110) : [];
        const low = candles.l ? candles.l.slice(-110) : [];
        const close = candles.c ? candles.c.slice(-110) : [];
        const volume = candles.v ? candles.v.slice(-110) : [];

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
