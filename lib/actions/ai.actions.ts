'use server';

import { callAIProviderWithFallback } from '@/lib/ai-provider';

export async function getAIStockAnalysis(symbol: string, stockData?: {
    currentPrice?: number;
    changePercent?: number;
    marketCap?: string;
    peRatio?: string;
}): Promise<{ success: boolean; analysis?: string; error?: string }> {
    try {
        const dataContext = stockData
            ? `
Current market data for ${symbol}:
- Current Price: $${stockData.currentPrice?.toFixed(2) || 'N/A'}
- Change: ${stockData.changePercent?.toFixed(2) || 'N/A'}%
- Market Cap: ${stockData.marketCap || 'N/A'}
- P/E Ratio: ${stockData.peRatio || 'N/A'}
`           : '';

        const prompt = `You are an expert financial analyst. Provide a concise but insightful analysis of the stock ${symbol}.

${dataContext}

Structure your response EXACTLY as follows using these section headers (use ** for bold):

**Summary**
A 2-3 sentence overview of the company and its current market position.

**Bull Case**
3 bullet points on why the stock could go up. Start each with "• ".

**Bear Case**
3 bullet points on why the stock could go down. Start each with "• ".

**Technical Outlook**
2-3 sentences on the technical trend and key levels.

**Verdict**
A single sentence overall assessment with a rating: Strong Buy, Buy, Hold, Sell, or Strong Sell.

Keep the total response under 300 words. Be specific and actionable, not generic. Do not use markdown headers (#), use **bold** instead.`;

        const analysis = await callAIProviderWithFallback(prompt);
        return { success: true, analysis };
    } catch (e) {
        console.error('AI analysis error:', e);
        return { success: false, error: 'AI analysis unavailable. Check your API key configuration.' };
    }
}
