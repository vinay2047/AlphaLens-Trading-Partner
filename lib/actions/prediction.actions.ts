'use server';

import { getStockCandles } from './finnhub.actions';

const ML_API_BASE = process.env.ML_API_BASE_URL || "https://dead-or-alpha-future-company-price-predictor.hf.space";
const PREDICTION_SERVICE_URL = process.env.PREDICTION_SERVICE_URL || 'http://localhost:8000';

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
        console.warn(`[ML Service Offline] Falling back to Gemini mock prediction for ${symbol}:`, error);
        return generateGeminiPrediction(symbol, days);
    }
}

async function generateGeminiPrediction(symbol: string, days: number): Promise<PredictionResponse> {
    const { callAIProviderWithFallback } = await import('../ai-provider');
    
    let currentPrice = 150.0; // Default dummy
    try {
         const fromSec = Math.floor(Date.now() / 1000) - (86400 * 5); // 5 days ago
         const toSec = Math.floor(Date.now() / 1000);
         const candles = await getStockCandles(symbol, 'D', fromSec, toSec);
         if (candles.c && candles.c.length > 0) {
             currentPrice = candles.c[candles.c.length - 1];
         }
    } catch {
         // Silently fail to keep mock fast
    }

    const prompt = `You are a financial AI. Generate a dummy stock price prediction for the ticker ${symbol.toUpperCase()} over the next ${days} days.
The current price is roughly $${currentPrice}. Generate a realistic trajectory.
Please respond ONLY with valid JSON matching this schema:
{
  "symbol": "${symbol.toUpperCase()}",
  "current_price": ${currentPrice},
  "predicted_price": number,
  "price_change": number,
  "price_change_pct": number,
  "direction": "BULLISH" or "BEARISH",
  "confidence": number,
  "forecast": [
    { "date": "YYYY-MM-DD", "price": number, "day": number }
  ],
  "models_used": ["Gemini (Fallback)"]
}
Do NOT include markdown formatting or backticks around the JSON.`;

    try {
        const text = await callAIProviderWithFallback(prompt);
        const cleanText = text.trim().replace(/^```(?:json)?/, '').replace(/```$/, '').trim();
        const data = JSON.parse(cleanText);
        return {
            ...data,
            is_mock: true,
        } as PredictionResponse;
    } catch (err) {
        console.error("Failed to parse Gemini Prediction fallback", err);
        throw new Error("Unable to parse Gemini output for prediction");
    }
}
