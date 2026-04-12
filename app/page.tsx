import React from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    Repeat,
    ArrowUpRight,

    Layers,
    Globe,
    BrainCircuit,
    ShieldAlert,
    Bot,
    BarChart3
} from 'lucide-react';
import Image from 'next/image';
import { auth, currentUser } from "@clerk/nextjs/server";
import UserDropdown from "@/components/UserDropdown";


interface User {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
}

const FeatureCard = ({ icon: Icon, title, description, highlighted = false }: {
    icon: React.ElementType,
    title: string,
    description: string,
    highlighted?: boolean
}) => (
    <div className={`relative group p-8 rounded-[2rem] flex flex-col gap-6 transition-all duration-500 transform hover:-translate-y-2 ${highlighted
            ? 'bg-gray-950/60 backdrop-blur-xl border border-[#10E55A]/30 shadow-[0_0_40px_rgba(16,229,90,0.15)]'
            : 'bg-gray-950/40 backdrop-blur-xl border border-white/5 hover:border-[#10E55A]/20 hover:bg-gray-900/60'
        }`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-inner ring-1 ${highlighted
                ? 'bg-[#10E55A]/10 text-[#10E55A] ring-[#10E55A]/30 group-hover:ring-[#10E55A]/60'
                : 'bg-black text-gray-400 ring-white/10 group-hover:text-[#10E55A] group-hover:ring-[#10E55A]/30'
            }`}>
            <Icon size={28} strokeWidth={2} />
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#10E55A] transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm font-medium">
                {description}
            </p>
        </div>
        {highlighted && (
            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
                <div className="w-24 h-24 bg-[#10E55A] blur-3xl rounded-full"></div>
            </div>
        )}
    </div>
);

const MockUIBoard = () => (
    <div className="relative w-[110%] ml-[-5%] lg:w-full lg:ml-0 h-[500px] lg:h-[600px] grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-1000 origin-center">
        <div className="col-span-1 space-y-4">
  
            <div className="bg-gray-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl hover:border-[#10E55A]/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-bold text-gray-400">NVDA</div>
                    <div className="flex items-center gap-1 text-[#10E55A] text-xs font-bold bg-[#10E55A]/10 px-2.5 py-1 rounded-md border border-[#10E55A]/20">
                        <ArrowUpRight size={14} strokeWidth={3} /> 4.21%
                    </div>
                </div>
                <div className="text-4xl font-extrabold text-white tracking-tighter">$875.24</div>
            </div>
          
            <div className="bg-gray-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl hover:border-blue-500/30 transition-all group">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">AI Sentiment Score</div>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-[#10E55A] w-[78%]"></div>
                    </div>
                    <span className="text-white font-bold">Bullish</span>
                </div>
            </div>
  
            <div className="bg-gray-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl hover:border-[#10E55A]/10 transition-colors h-40 relative overflow-hidden group">
                <div className="flex justify-between items-end h-full relative z-10">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Total Equity</div>
                        <div className="text-3xl font-extrabold text-white tracking-tighter">$242,091.00</div>
                    </div>
                </div>
                <svg className="absolute bottom-4 right-0 w-full h-20 text-[#10E55A] opacity-20 group-hover:opacity-40 transition-opacity" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 Q15,5 30,20 T60,5 T100,15" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </div>

        <div className="col-span-1 space-y-4 pt-12">
            {/* Trade Execution Card */}
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-72 flex flex-col justify-between group hover:border-[#10E55A]/40 transition-all">
                <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-[#10E55A]/5 blur-[60px] rounded-full"></div>
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Shadow Agent Active</span>
                    <Bot size={18} className="text-[#10E55A]" />
                </div>
                <div className="relative z-10 font-bold mb-4">
                    <div className="text-[#10E55A] text-sm mb-1 uppercase tracking-widest text-[10px]">Optimal Allocation</div>
                    <div className="text-5xl text-white tracking-tighter">14.2% <span className="text-gray-600 text-xl">BTC</span></div>
                </div>
                <div className="relative z-10 flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg border border-[#10E55A]/30 text-[#10E55A] text-xs font-bold bg-[#10E55A]/10">Reinforcement Learning</span>
                </div>
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-[#10E55A] shadow-[0_0_20px_rgba(16,229,90,0.4)] rounded-full flex items-center justify-center text-black z-20">
                    <Repeat size={18} strokeWidth={3} />
                </div>
            </div>

            <div className="bg-black/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl relative overflow-hidden h-40 flex flex-col items-center justify-center p-6 text-center">
                <ShieldAlert size={32} className="text-red-500 mb-2 animate-pulse" />
                <span className="text-xs font-bold text-gray-400 uppercase">Anomaly Detection</span>
                <span className="text-white text-sm font-medium">Unusual Volume Spike: TSLA</span>
            </div>
        </div>
    </div>
);

const AnalyticsPromo = () => (
    <section className="py-24 border-t border-white/5 relative overflow-hidden mt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#10E55A]/5 blur-[120px] rounded-[100%] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-sm font-bold text-[#10E55A] tracking-widest uppercase mb-4">The Alpha Engine</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                        Bridging the gap between <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">raw data</span> and intelligence.
                    </h3>
                    <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-8">
                        AlphaLens uses DistilRoBERTa for sentiment analysis and reinforcement learning to simulate allocation strategies—giving you the edge of a hedge fund.
                    </p>
                    <ul className="space-y-4 mb-8">
                        {[
                            'Real-time news sentiment processing',
                            'Shadow Portfolio RL-based simulators',
                            'Automated anomaly & manipulation tracking'
                        ].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                                <span className="w-5 h-5 rounded-full bg-[#10E55A]/20 flex items-center justify-center flex-shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-[#10E55A]"></span>
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link href="/about" className="inline-flex items-center text-[#10E55A] font-bold hover:gap-3 transition-all gap-2 group">
                        View Technical Architecture <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative rounded-[2.5rem] bg-gray-950 border border-white/5 p-4 overflow-hidden shadow-2xl group">
                    <Image
                        src="/images/hero.png"
                        alt="Neural Network Visualization"
                        width={200}
                        height ={200}
                        className="w-full h-auto rounded-[2rem] opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>

                    <div className="absolute top-6 right-6 px-4 py-2 bg-[#10E55A]/10 border border-[#10E55A]/20 rounded-full backdrop-blur-md">
                        <span className="text-[#10E55A] text-[10px] font-bold tracking-widest uppercase">Live Analytics Engine</span>
                    </div>

                    <div className="absolute bottom-10 left-10 text-white">
                        <div className="text-2xl font-black tracking-tighter uppercase italic">AlphaLens Intelligence</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default async function AlphaLensHero() {
    const { userId, sessionClaims } = await auth();

    let user: User | null = null;
    if (userId) {
        const clerkUser = await currentUser();
        // Using simple fallback logic as per your snippet
        const fallbackName = typeof sessionClaims?.fullName === 'string' ? sessionClaims.fullName : 'Trader';
        const fallbackEmail = typeof sessionClaims?.email === 'string' ? sessionClaims.email : '';

        user = {
            id: userId,
            name: clerkUser?.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}` : fallbackName,
            email: clerkUser?.emailAddresses[0]?.emailAddress || fallbackEmail,
            imageUrl: clerkUser?.imageUrl,
        };
    }

    return (
        <main className="min-h-screen bg-[#000000] text-white overflow-hidden relative selection:bg-[#10E55A]/20">
            {/* Dynamic Background */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#10E55A]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 hidden md:block"></div>

            <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24 relative z-10">

                {/* Nav */}
                <nav className="absolute top-6 left-6 flex items-center gap-3 z-50">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                        <Image src="/images/alphalens-flat.png" alt="Logo" width={28} height={28} />
                    </div>
                    <span className="font-black text-xl tracking-tighter hidden md:block">AlphaLens</span>
                </nav>

                <nav className="absolute top-6 right-6 lg:right-10 flex gap-4 z-50 items-center">
                    {userId && user ? (
                        <UserDropdown user={user} />
                    ) : (
                        <>
                            <Link href="/sign-in" className="text-gray-400 hover:text-white px-5 py-2 font-bold transition-colors">Log In</Link>
                            <Link href="/sign-up" className="bg-[#10E55A] hover:bg-[#00CC47] text-black px-6 py-2.5 rounded-xl font-black transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,229,90,0.2)]">
                                Trade Now
                            </Link>
                        </>
                    )}
                </nav>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center pt-16 mb-24">
                    <header className="max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-gray-300 mb-8 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-[#10E55A] animate-pulse"></span>
                            Institutional Intelligence Active
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white mb-6 tracking-tighter leading-[0.95]">
                            <span className="text-[#10E55A] block">High Fidelity</span>
                            <span className="block text-gray-200">Market</span>
                            <span className="block text-gray-500">Intelligence.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-md leading-relaxed font-medium">
                            The premium trading companion providing AI-powered sentiment, real-time anomalies, and RL-based allocation simulations.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Link href="/dashboard" className="inline-flex items-center justify-center bg-white hover:bg-[#10E55A] text-black px-8 py-4 rounded-2xl font-black text-lg gap-2 transition-all group">
                                Open Terminal <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/about" className="inline-flex items-center justify-center bg-transparent border border-white/10 hover:border-[#10E55A]/40 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all">
                                Specs
                            </Link>
                        </div>
                    </header>

                    <div className="flex justify-center lg:justify-end">
                        <MockUIBoard />
                    </div>
                </div>

                {/* Feature Grid - Reflecting the actual AI capabilities */}
                <section className="relative z-10 pt-10">
                    <div className="mb-12 max-w-2xl px-2">
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">Proprietary Tech Stack</h2>
                        <p className="text-gray-500 font-medium">Advanced tools built for the modern retail power-user.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={BrainCircuit}
                            title="Sentiment Analysis"
                            description="Leverage DistilRoBERTa models to process global news feeds and extract precise bullish or bearish consensus scores."
                        />
                        <FeatureCard
                            icon={Bot}
                            title="Shadow Agent"
                            description="A reinforcement learning-based simulator that tests allocation strategies against real market movements."
                            highlighted={true}
                        />
                        <FeatureCard
                            icon={ShieldAlert}
                            title="Anomaly Detection"
                            description="Sophisticated algorithms tracking unusual volume and price action to flag potential breakouts before they happen."
                        />
                        <FeatureCard
                            icon={BarChart3}
                            title="High-Fidelity Charts"
                            description="Seamless TradingView integration with technical analysis gauges and custom baseline comparisons."
                        />
                        <FeatureCard
                            icon={Layers}
                            title="Inngest Workflows"
                            description="Background job orchestration ensuring your data is synchronized across MongoDB with zero latency."
                        />
                        <FeatureCard
                            icon={Globe}
                            title="Unified Portfolio"
                            description="One secure dashboard for all your assets, synced via Clerk and managed with a premium glassmorphic UI."
                        />
                    </div>
                </section>

                <AnalyticsPromo />

                {/* Footer */}
                <footer className="mt-32 pt-16 pb-8 border-t border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <Image src="/images/alphalens-flat.png" alt="Logo" width={32} height={32} />
                                <span className="font-black text-xl tracking-tighter text-white uppercase">AlphaLens</span>
                            </div>
                            <p className="text-gray-500 font-medium max-w-sm leading-relaxed mb-6">
                                Engineered by Synaptic Surge. Built with Next.js 15, Tailwind 4.0, and MongoDB for the next generation of retail traders.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 tracking-tight">Ecosystem</h4>
                            <ul className="space-y-3 text-sm text-gray-500 font-medium">
                                <li><Link href="/dashboard" className="hover:text-[#10E55A] transition-colors">Terminal</Link></li>
                                <li><Link href="/portfolio" className="hover:text-[#10E55A] transition-colors">AI Insights</Link></li>
                                <li><Link href="/watchlist" className="hover:text-[#10E55A] transition-colors">Watchlist</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-4 tracking-tight">Security</h4>
                            <ul className="space-y-3 text-sm text-gray-500 font-medium">
                                <li><Link href="/privacy" className="hover:text-[#10E55A] transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-[#10E55A] transition-colors">Terms</Link></li>
                                <li><div className="flex items-center gap-2 text-[#10E55A]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#10E55A] animate-pulse"></div>
                                    Operational
                                </div></li>
                            </ul>
                        </div>
                    </div>
                    <p className="text-gray-600 text-[10px] font-bold tracking-widest uppercase text-center md:text-left">
                        © {new Date().getFullYear()} Synaptic Surge. AlphaLens is an AI companion and does not constitute financial advice.
                    </p>
                </footer>
            </div>
        </main>
    );
}