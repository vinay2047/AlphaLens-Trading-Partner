import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, TrendingUp, ShieldCheck, Repeat, ArrowUpRight, ArrowDownRight, Zap, Layers, Globe } from 'lucide-react';
import Image from 'next/image';

const FeatureCard = ({ icon: Icon, title, description, highlighted = false }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  highlighted?: boolean
}) => (
  <div className={`relative group p-8 rounded-[2rem] flex flex-col gap-6 transition-all duration-300 transform hover:-translate-y-1 ${
    highlighted 
      ? 'bg-gray-950/60 backdrop-blur-xl border border-[#10E55A]/30 shadow-[0_0_30px_rgba(16,229,90,0.1)]' 
      : 'bg-gray-950/40 backdrop-blur-xl border border-white/5 hover:border-white/10 hover:bg-gray-900/60'
  }`}>
    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors shadow-inner ring-1 ${
        highlighted 
          ? 'bg-[#10E55A]/10 text-[#10E55A] ring-[#10E55A]/30 group-hover:ring-[#10E55A]/50' 
          : 'bg-black text-gray-400 ring-white/10 group-hover:text-[#10E55A] group-hover:ring-[#10E55A]/30'
      }`}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{title}</h3>
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

// Decorative mock component mimicking the right side of the visual theme
const MockUIBoard = () => (
    <div className="relative w-[110%] ml-[-5%] lg:w-full lg:ml-0 h-[500px] lg:h-[600px] grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-1000 origin-center">
        <div className="col-span-1 space-y-4">
            {/* Card 1 */}
            <div className="bg-gray-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl hover:border-[#10E55A]/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-bold text-gray-400 group-hover:text-gray-300">AAPL</div>
                    <div className="flex items-center gap-1 text-[#10E55A] text-xs font-bold bg-[#10E55A]/10 px-2.5 py-1 rounded-md border border-[#10E55A]/20">
                        <ArrowUpRight size={14} strokeWidth={3} /> 1.73%
                    </div>
                </div>
                <div className="text-4xl font-extrabold text-white tracking-tighter">$192.12</div>
            </div>
             {/* Card 2 */}
            <div className="bg-gray-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl hover:border-red-500/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-bold text-gray-400 group-hover:text-gray-300">TSLA</div>
                    <div className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-500/10 px-2.5 py-1 rounded-md border border-red-500/20">
                        <ArrowDownRight size={14} strokeWidth={3} /> 2.19%
                    </div>
                </div>
                <div className="text-4xl font-extrabold text-white tracking-tighter">$182.80</div>
            </div>
             {/* Card 3 - Graphical representation */}
             <div className="bg-gray-950/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl hover:border-[#10E55A]/10 transition-colors h-40 relative overflow-hidden group">
                <div className="flex justify-between items-end h-full relative z-10">
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 group-hover:text-gray-400">Net Worth</div>
                        <div className="text-3xl font-extrabold text-white tracking-tighter">$128,054.00</div>
                    </div>
                </div>
                {/* Abstract Line Graph element */}
                <svg className="absolute bottom-4 right-0 w-full h-20 text-[#10E55A] opacity-20 group-hover:opacity-40 transition-opacity" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,20 Q10,5 20,20 T40,10 T60,25 T80,5 T100,20" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </div>

        <div className="col-span-1 space-y-4 pt-12">
            {/* Spotlight Card */}
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-72 flex flex-col justify-between group hover:border-[#10E55A]/40 transition-all">
                <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-[#10E55A]/5 blur-[60px] rounded-full group-hover:bg-[#10E55A]/10 transition-all duration-700"></div>
                
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">Execute Trade</span>
                </div>
                <div className="relative z-10 font-bold mb-4">
                     <div className="text-[#10E55A] text-sm mb-1 uppercase tracking-widest text-[10px]">Buy Market</div>
                     <div className="text-5xl text-white tracking-tighter">500 <span className="text-gray-600 text-xl">NVDA</span></div>
                </div>
                
                <div className="relative z-10 flex gap-2">
                    <span className="px-3 py-1.5 rounded-lg border border-white/5 text-gray-400 text-xs font-bold bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">25%</span>
                    <span className="px-3 py-1.5 rounded-lg border border-white/5 text-gray-400 text-xs font-bold bg-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">50%</span>
                    <span className="px-3 py-1.5 rounded-lg border border-[#10E55A]/30 text-[#10E55A] text-xs font-bold bg-[#10E55A]/10 shadow-[0_0_10px_rgba(16,229,90,0.1)] cursor-pointer">Max Flow</span>
                </div>
                
                 {/* Center icon for switch */}
                 <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 bg-[#10E55A] shadow-[0_0_20px_rgba(16,229,90,0.4)] rounded-full flex items-center justify-center text-black z-20 hover:scale-110 transition-transform cursor-pointer">
                    <Repeat size={18} strokeWidth={3} />
                 </div>
            </div>
            
            <div className="bg-black/80 backdrop-blur-xl border border-white/5 rounded-3xl object-cover shadow-2xl relative overflow-hidden h-40 flex items-center justify-center p-0">
                 <Image src="/images/alphalens-flat.png" alt="Logo" width={90} height={90} className="opacity-20" />
            </div>
        </div>
    </div>
);

// Advanced analytics promo block
const AnalyticsPromo = () => (
    <section className="py-24 border-t border-white/5 relative overflow-hidden mt-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-[#10E55A]/5 blur-[120px] rounded-[100%] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="text-sm font-bold text-[#10E55A] tracking-widest uppercase mb-4">Enterprise Grade Engine</h2>
                    <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                        Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-600">intelligently</span>, not blindly.
                    </h3>
                    <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-8">
                        AlphaLens provides unfiltered, institutional-quality data aggregation directly to your screen. No bloatware, no delayed quotes. 
                    </p>
                    <ul className="space-y-4 mb-8">
                        {['Real-time execution across multiple brokers', 'Integrated global market sentiment analysis', 'Predictive machine-learning price bounds'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300 font-medium">
                                <span className="w-5 h-5 rounded-full bg-[#10E55A]/20 flex items-center justify-center flex-shrink-0">
                                    <span className="w-2 h-2 rounded-full bg-[#10E55A]"></span>
                                </span>
                                {item}
                            </li>
                        ))}
                    </ul>
                    <Link href="/about" className="inline-flex items-center text-[#10E55A] font-bold hover:gap-2 transition-all gap-1">
                        Read the technical whitepaper <ArrowRight size={18} />
                    </Link>
                </div>
                <div className="relative rounded-[2.5rem] bg-gray-900 border border-white/5 p-2 overflow-hidden shadow-2xl">
                    <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop" alt="Trading Screen" className="w-full h-auto rounded-[2rem] opacity-70 mix-blend-luminosity grayscale hover:grayscale-0 transition-all duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-10 left-10 text-white font-bold text-2xl drop-shadow-md">Built for Terminal Users.</div>
                </div>
            </div>
        </div>
    </section>
);

export default function AlphaLensHero() {
  return (
    <main className="min-h-screen bg-[#000000] text-white overflow-hidden relative selection:bg-[#10E55A]/20">
      {/* Background Ambience gradients */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#10E55A]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen hidden md:block"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3 mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24 relative z-10">
        
        {/* Navigation Top elements */}
        <nav className="absolute top-6 left-6 flex items-center gap-3 z-50">
            <Image src="/images/alphalens-flat.png" alt="Logo" width={40} height={40} className="rounded-xl border border-white/10" />
            <span className="font-extrabold text-xl tracking-tight hidden md:block">AlphaLens</span>
        </nav>

        <nav className="absolute top-6 right-6 lg:right-10 flex gap-4 z-50">
             <Link href="/sign-in" className="flex items-center justify-center text-gray-400 hover:text-white px-5 py-2 rounded-xl font-bold transition-colors">
              Log In
            </Link>
             <Link href="/sign-up" className="flex items-center justify-center bg-[#10E55A] hover:bg-[#00CC47] text-black px-6 py-2 rounded-xl font-extrabold transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,229,90,0.1)]">
              Trade Now
            </Link>
        </nav>

        {/* Hero Section Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center pt-16 mb-24">
            
            <header className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-gray-300 mb-8 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#10E55A] animate-pulse"></span>
                    Terminal v2.0 Live
                </div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-[6rem] font-black text-white mb-6 tracking-tighter leading-[1.0]">
                    <span className="text-[#10E55A] block drop-shadow-[0_0_30px_rgba(16,229,90,0.2)]">Execute </span> 
                    <span className="block text-gray-200">With Total</span>
                    <span className="block text-gray-400">Dominance.</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-md leading-relaxed font-medium">
                    The ultra-fast, premium trading interface built specifically for power users. No distractions, just pure market execution.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/sign-up" className="inline-flex items-center justify-center bg-gray-100 hover:bg-white text-black px-8 py-4 rounded-xl font-extrabold text-lg gap-2 transition-all active:scale-95">
                        Open Dashboard <ArrowRight size={20} strokeWidth={3} />
                    </Link>
                    <Link href="/about" className="inline-flex items-center justify-center bg-transparent border border-white/20 hover:bg-white/5 hover:border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all">
                        Technical Specs
                    </Link>
                </div>
            </header>

            <div className="flex justify-center lg:justify-end mt-10 lg:mt-0">
                <MockUIBoard />
            </div>
        </div>

        {/* Feature Grid */}
        <section className="relative z-10 pt-10">
            <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Ecosystem Architecture</h2>
                    <p className="text-gray-500 font-medium">Built on top of robust frameworks to guarantee reliability.</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
                icon={Zap}
                title="Lightning Fast"
                description="Our custom WebSockets stream market data directly to the client with sub-millisecond latencies."
            />
            <FeatureCard 
                icon={Layers}
                title="Unified Portfolios"
                description="Cross-analyze your multi-asset holdings in a single dashboard with advanced aggregation metrics."
                highlighted={true}
            />
            <FeatureCard 
                icon={Globe}
                title="Global Access"
                description="Connects to over 20 external global market exchanges seamlessly through our unified proxy."
            />
            </div>
        </section>

        {/* New Analytics Promo Section appended to length the page */}
        <AnalyticsPromo />
        
        {/* Simple Footer for Landing Page */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm font-medium">
            <div className="flex items-center gap-2">
                 <Image src="/images/alphalens-flat.png" alt="Logo" width={24} height={24} className="opacity-50 grayscale hover:grayscale-0 transition-all" />
                 <span>© 2026 Synaptic Surge / AlphaLens. All rights reserved.</span>
            </div>
            <div className="flex gap-6">
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/contact" className="hover:text-white transition-colors">API Docs</Link>
            </div>
        </footer>

      </div>
    </main>
  );
}