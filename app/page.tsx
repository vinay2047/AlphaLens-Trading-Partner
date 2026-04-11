import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, TrendingUp, ShieldCheck, Repeat, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, highlighted = false }: { 
  icon: React.ElementType, 
  title: string, 
  description: string,
  highlighted?: boolean
}) => (
  <div className={`relative group p-8 rounded-[2rem] flex flex-col gap-6 transition-all duration-300 transform hover:-translate-y-1 ${
    highlighted 
      ? 'bg-gray-800 border-2 border-teal-500/50 shadow-[0_0_30px_rgba(16,229,90,0.15)] shadow-teal-500/20' 
      : 'bg-gray-800/80 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600'
  }`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
      highlighted 
        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' 
        : 'bg-gray-900 text-teal-500/80 border border-gray-700 group-hover:text-teal-400 group-hover:border-teal-500/30'
    }`}>
      <Icon size={26} strokeWidth={2} />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-base font-medium">
        {description}
      </p>
    </div>
    {highlighted && (
       <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-20">
         <div className="w-24 h-24 bg-teal-400 blur-3xl rounded-full"></div>
       </div>
    )}
  </div>
);

// Decorative mock component mimicking the right side of the visual theme
const MockUIBoard = () => (
    <div className="relative w-full h-[500px] lg:h-[600px] grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-8 duration-1000">
        <div className="col-span-1 space-y-4">
            {/* Card 1 */}
            <div className="bg-gray-800 border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-semibold text-gray-400">ETH/USD</div>
                    <div className="flex items-center gap-1 text-teal-400 text-xs font-bold bg-teal-500/10 px-2 py-1 rounded-full">
                        <ArrowUpRight size={12} /> 1.73%
                    </div>
                </div>
                <div className="text-3xl font-bold text-white">$3,865.12</div>
            </div>
             {/* Card 2 */}
            <div className="bg-gray-800 border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:border-gray-600 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-semibold text-gray-400">BTC/USD</div>
                    <div className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded-full">
                        <ArrowDownRight size={12} /> 2.19%
                    </div>
                </div>
                <div className="text-3xl font-bold text-white">$97,132.80</div>
            </div>
             {/* Card 3 - Graphical representation */}
             <div className="bg-gray-800 border border-gray-700/50 rounded-3xl p-6 shadow-2xl hover:border-gray-600 transition-colors h-40 relative overflow-hidden">
                <div className="flex justify-between items-end h-full relative z-10">
                    <div>
                        <div className="text-sm font-semibold text-gray-400 mb-1">Portfolio</div>
                        <div className="text-2xl font-bold text-white">12.054 <span className="text-gray-500 text-lg">ETH</span></div>
                    </div>
                </div>
                {/* Abstract Line Graph element */}
                <svg className="absolute bottom-4 right-0 w-full h-16 text-teal-500 opacity-50" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,20 Q10,5 20,20 T40,10 T60,25 T80,5 T100,20" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
        </div>

        <div className="col-span-1 space-y-4 pt-12">
            {/* Spotlight Card */}
            <div className="bg-[#000000] border border-teal-500 rounded-3xl p-6 shadow-[0_0_30px_rgba(16,229,90,0.15)] relative overflow-hidden h-72 flex flex-col justify-between group">
                <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-teal-500/10 blur-[60px] rounded-full group-hover:bg-teal-500/20 transition-all duration-700"></div>
                
                <div className="relative z-10 flex justify-between items-center mb-6">
                    <span className="text-gray-400 text-sm font-bold">Sell</span>
                    <span className="bg-gray-800 text-white rounded-full px-3 py-1 text-xs font-semibold border border-gray-700 flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div> ETH
                    </span>
                </div>
                <div className="relative z-10 font-bold mb-4">
                     <div className="text-gray-400 text-sm mb-1">$46,917.07</div>
                     <div className="text-4xl text-white">12.1952</div>
                </div>
                
                <div className="relative z-10 flex gap-2">
                    <span className="px-3 py-1 rounded-full border border-gray-700 text-gray-400 text-xs font-medium bg-gray-800/50 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer">25%</span>
                    <span className="px-3 py-1 rounded-full border border-gray-700 text-gray-400 text-xs font-medium bg-gray-800/50 hover:bg-gray-700 hover:text-white transition-colors cursor-pointer">50%</span>
                    <span className="px-3 py-1 rounded-full border border-teal-500/50 text-teal-400 text-xs font-medium bg-teal-500/10 cursor-pointer">Max</span>
                </div>
                
                 {/* Center icon for switch */}
                 <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-gray-800 border-2 border-[#000000] rounded-full flex items-center justify-center text-teal-400 z-20 hover:scale-110 transition-transform cursor-pointer">
                    <Repeat size={16} />
                 </div>
            </div>
            
            <div className="bg-[#000000] border border-gray-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden h-40 flex flex-col justify-center">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm font-bold">Buy</span>
                </div>
                 <div className="font-bold">
                     <div className="text-4xl text-white">46,800.00 <span className="text-gray-500 text-lg">USDT</span></div>
                </div>
            </div>
        </div>
    </div>
);

export default function AlphaLensHero() {
  return (
    <main className="min-h-screen bg-gray-900 text-white overflow-hidden relative selection:bg-teal-500/30">
      {/* Background Ambience gradients */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-teal-500/5 blur-[120px] rounded-full point-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/5 blur-[120px] rounded-full point-events-none translate-x-1/3 translate-y-1/3 mix-blend-screen"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28 relative z-10">
        
        {/* Navigation Top elements */}
        <nav className="absolute top-6 right-6 lg:right-10 flex gap-4 animate-in fade-in zoom-in duration-700">
             <Link href="/sign-in" className="flex items-center justify-center text-gray-300 hover:text-white px-6 py-2.5 rounded-xl font-semibold transition-colors">
              Log In
            </Link>
             <Link href="/sign-up" className="flex items-center justify-center bg-teal-500 hover:bg-teal-400 text-[#000000] px-6 py-2.5 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95">
              Get Started
            </Link>
        </nav>

        {/* Hero Section Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center pt-10 mb-32">
            
            <header className="max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-bold text-white mb-6 tracking-tight leading-[1.05]">
                    <span className="text-teal-400 block">Switch &</span> 
                    <span className="block">Transform</span>
                    <span className="block">the Way You</span>
                    <span className="block">Trade</span>
                </h1>

                <p className="text-xl text-gray-400 mb-12 max-w-md leading-relaxed font-medium">
                    Millions of <span className="text-white">Crypto & Stock Assets</span> at Your Fingertips. Experience the premium edge in trading clarity.
                </p>

                <div className="flex flex-wrap gap-4">
                    <Link href="/sign-up" className="inline-flex items-center justify-center bg-teal-400 hover:bg-teal-300 text-[#000000] px-8 py-4 rounded-xl font-extrabold text-lg gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(16,229,90,0.3)]">
                    Start Trading <ArrowRight size={20} className="stroke-[3px]" />
                    </Link>
                    <Link href="/about" className="inline-flex items-center justify-center bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-gray-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all">
                    Explore Platform
                    </Link>
                </div>
            </header>

            <div className="flex justify-center lg:justify-end">
                <MockUIBoard />
            </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-16 border-t border-gray-800/50 pt-20">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold text-white mb-4">Precision tools for modern traders</h2>
                <p className="text-gray-400 font-medium">Everything you need to analyze the market, execute trades, and manage your portfolio natively in one place.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
                icon={Activity}
                title="Real-Time Insights"
                description="Monitor absolute market conditions securely. Leverage data seamlessly directly inside our deep dashboard."
            />
            <FeatureCard 
                icon={TrendingUp}
                title="Smarter Execution"
                description="Say goodbye to delays. Perform split-second market orders directly from your personalized watchlist."
                highlighted={true}
            />
            <FeatureCard 
                icon={ShieldCheck}
                title="Ironclad Security"
                description="Built on powerful protocols to protect your assets. Total peace of mind while your portfolio scales up."
            />
            </div>
        </section>

      </div>
    </main>
  );
}