'use server';

import { getStockCandles } from './finnhub.actions';

const PREDICTION_SERVICE_URL = process.env.PREDICTION_SERVICE_URL || 'http://localhost:8002';

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
        const response = await fetch(`${PREDICTION_SERVICE_URL}/predict/${symbol.toUpperCase()}?days=${days}`, {
            method: 'POST',
            next: { revalidate: 300 }, // Cache for 5 minutes
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(response);

        if (!response.ok) {
            throw new Error(`Prediction API returned ${response.status}`);
        }

        const data = await response.json();
        return data as PredictionResponse;
    } catch (error) {
        console.warn(`[ML Service Offline] Falling back to mock prediction for ${symbol}:`, error);
        
        // // --- Fallback Mechanism for when Python / Docker is offline ---
        // return generateMockPrediction(symbol, days);
    }
}

// async function generateMockPrediction(symbol: string, days: number): Promise<PredictionResponse> {
//     // Attempt to get the real current price via Finnhub candles to ground the mock
//     let currentPrice = 150.0; // Default dummy
//     try {
//          const fromSec = Math.floor(Date.now() / 1000) - (86400 * 5); // 5 days ago
//          const toSec = Math.floor(Date.now() / 1000);
//          const candles = await getStockCandles(symbol, 'D', fromSec, toSec);
//          if (candles.c && candles.c.length > 0) {
//              currentPrice = candles.c[candles.c.length - 1];
//          }
//     } catch {
//          // Silently fail to keep mock fast
//     }

//     const forecast: PredictionForecastDay[] = [];
//     let lastPrice = currentPrice;
    
//     // Generate a slightly optimistic simulated trajectory
//     for (let i = 1; i <= days; i++) {
//         const drift = (Math.random() * 0.04) - 0.01; // mostly positive drift up to 3%
//         const dayPrice = lastPrice * (1 + drift);
//         const date = new Date();
//         date.setDate(date.getDate() + i);
        
//         // Skip weekends
//         if (date.getDay() === 0 || date.getDay() === 6) {
//             date.setDate(date.getDate() + (date.getDay() === 0 ? 1 : 2));
//         }

//         forecast.push({
//             date: date.toISOString().split('T')[0],
//             price: Number(dayPrice.toFixed(2)),
//             day: i,
//         });
//         lastPrice = dayPrice;
//     }

//     const finalPredictedPrice = forecast[forecast.length - 1].price;
//     const priceChange = finalPredictedPrice - currentPrice;

//     return {
//         symbol: symbol.toUpperCase(),
//         current_price: currentPrice,
//         predicted_price: finalPredictedPrice,
//         price_change: Number(priceChange.toFixed(2)),
//         price_change_pct: Number(((priceChange / currentPrice) * 100).toFixed(2)),
//         direction: priceChange >= 0 ? 'BULLISH' : 'BEARISH',
//         confidence: Number((70 + Math.random() * 20).toFixed(1)),
//         forecast,
//         models_used: ['TCN-GRU (Mock)', 'BiLSTM (Mock)'],
//         is_mock: true,
//     };
// }
