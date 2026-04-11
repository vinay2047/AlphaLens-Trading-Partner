import React from 'react';
import Link from 'next/link';
import { Sparkles, DollarSign, Shield, ArrowRight } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }: { 
  icon: React.ElementType, 
  title: string, 
  description: string 
}) => (
  <div className="bg-[#0f172a]/40 border border-slate-800 p-8 rounded-[2rem] flex flex-col gap-6 transition-all hover:border-slate-700">
    <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center text-emerald-400 border border-slate-700 shadow-inner">
      <Icon size={22} />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  </div>
);

export default function AlphaLensHero() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-200 selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        
        {/* Hero Section */}
        <header className="max-w-4xl mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/30 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-10 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Built for simple stock ideas and fast market access
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.1]">
            AlphaLens makes trading simple, <span className="text-slate-500">smart, and secure.</span>
          </h1>

          <p className="text-lg lg:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
            See your watchlist, portfolios and alerts in one clean app. Get started with a minimal UI designed for clarity and speed.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link href="/sign-up" className="inline-flex items-center justify-center bg-[#10b981] hover:bg-[#059669] text-black px-8 py-4 rounded-xl font-bold gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-500/10">
              Create account <ArrowRight size={18} />
            </Link>
            <Link href="/sign-in" className="inline-flex items-center justify-center bg-[#1e293b]/50 border border-slate-700 hover:bg-[#1e293b] text-white px-8 py-4 rounded-xl font-semibold transition-all">
              Sign in
            </Link>
          </div>
        </header>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={Sparkles}
            title="Clear market insights"
            description="Focus on the data that matters with simplified dashboards and real-time signals."
          />
          <FeatureCard 
            icon={DollarSign}
            title="Trade with confidence"
            description="Manage positions, monitor alerts, and keep your portfolio under control without noise."
          />
          <FeatureCard 
            icon={Shield}
            title="Secure access"
            description="Sign in instantly with Clerk-powered authentication made for modern apps."
          />
        </section>

      </div>
    </main>
  );
}