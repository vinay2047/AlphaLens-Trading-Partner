'use client';

import { useState } from 'react';
import { getAIStockAnalysis } from '@/lib/actions/ai.actions';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3 } from 'lucide-react';

const sectionIcons: Record<string, React.ReactNode> = {
    'Summary': <BarChart3 className="h-4 w-4 text-teal-400" />,
    'Bull Case': <TrendingUp className="h-4 w-4 text-teal-400" />,
    'Bear Case': <TrendingDown className="h-4 w-4 text-teal-400" />,
    'Technical Outlook': <Target className="h-4 w-4 text-teal-400" />,
    'Verdict': <AlertTriangle className="h-4 w-4 text-teal-400" />,
};

const sectionColors: Record<string, string> = {
    'Summary': 'border-gray-800 bg-black/20',
    'Bull Case': 'border-gray-800 bg-black/20',
    'Bear Case': 'border-gray-800 bg-black/20',
    'Technical Outlook': 'border-gray-800 bg-black/20',
    'Verdict': 'border-gray-800 bg-black/20',
};

function parseAnalysis(text: string) {
    const sections: { title: string; content: string }[] = [];
    const sectionNames = ['Summary', 'Bull Case', 'Bear Case', 'Technical Outlook', 'Verdict'];

    for (let i = 0; i < sectionNames.length; i++) {
        const name = sectionNames[i];
        const pattern = new RegExp(`\\*\\*${name}\\*\\*`, 'i');
        const nextPattern = i < sectionNames.length - 1
            ? new RegExp(`\\*\\*${sectionNames[i + 1]}\\*\\*`, 'i')
            : null;

        const match = text.match(pattern);
        if (!match) continue;

        const startIdx = (match.index || 0) + match[0].length;
        let endIdx = text.length;
        if (nextPattern) {
            const nextMatch = text.match(nextPattern);
            if (nextMatch && nextMatch.index) endIdx = nextMatch.index;
        }

        const content = text.substring(startIdx, endIdx).trim();
        if (content) sections.push({ title: name, content });
    }

    return sections.length > 0 ? sections : [{ title: 'Analysis', content: text }];
}

const AIStockAnalysis = ({ symbol }: { symbol: string }) => {
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getAIStockAnalysis(symbol);
            if (result.success && result.analysis) {
                setAnalysis(result.analysis);
            } else {
                setError(result.error || 'Analysis failed');
            }
        } catch {
            setError('Failed to get AI analysis');
        } finally {
            setLoading(false);
        }
    };

    const sections = analysis ? parseAnalysis(analysis) : [];

    return (
        <div className="group rounded-2xl border border-gray-800 bg-gray-950/40 backdrop-blur-sm transition-all duration-300 relative shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 bg-[#0a0a0a]/50 rounded-t-2xl border-b border-gray-800 transition-all duration-300 relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg border border-gray-800 bg-black/20">
                            <Sparkles className="h-4 w-4 text-teal-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-100">AI Analysis</h3>
                        </div>
                    </div>
                    <Button
                        onClick={handleAnalyze}
                        disabled={loading}
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-black font-semibold rounded-lg text-xs px-4 border border-transparent shadow-sm"
                    >
                        {loading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <>
                                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                {analysis ? 'Refresh' : 'Analyze'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Content */}
                    <div className="p-5">
                        {!analysis && !loading && !error && (
                            <div className="space-y-6">
                                <div className="text-center py-2">
                                    <p className="text-gray-400 text-sm font-medium">Ready to analyze {symbol}</p>
                                    <p className="text-gray-500 text-xs mt-1">Run AI assessment for specialized market insights</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.entries(sectionIcons).map(([name, icon]) => (
                                        <div key={name} className="flex items-center gap-3 p-3 rounded-xl border border-gray-800/50 bg-black/10 opacity-50">
                                            <div className="p-1.5 rounded-lg bg-gray-900 border border-gray-800">
                                                {icon}
                                            </div>
                                            <span className="text-[11px] font-semibold text-gray-400">{name}</span>
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-800/50 bg-black/10 opacity-50 italic">
                                        <div className="p-1.5 rounded-lg bg-gray-900 border border-gray-800">
                                            <Sparkles className="h-4 w-4 text-teal-500/50" />
                                        </div>
                                        <span className="text-[11px] font-semibold text-gray-500">More...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center gap-3 py-8">
                                <div className="relative">
                                    <Loader2 className="h-8 w-8 text-teal-400 animate-spin" />
                                </div>
                                <p className="text-sm text-gray-400">Analyzing {symbol}...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-center py-4">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {sections.length > 0 && !loading && (
                            <div className="space-y-3">
                                {sections.map((section) => (
                                    <div
                                        key={section.title}
                                        className={`rounded-lg border p-3.5 ${sectionColors[section.title] || 'border-gray-600 bg-gray-700/30'}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            {sectionIcons[section.title] || <BarChart3 className="h-4 w-4 text-gray-400" />}
                                            <h4 className="text-sm font-semibold text-gray-200">{section.title}</h4>
                                        </div>
                                        <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
                                            {section.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
        </div>
    );
};

export default AIStockAnalysis;
