import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    ShieldAlert,
    BrainCircuit,
    Github,
    Twitter,
    Linkedin,
    ArrowRight,
    Bot,
    Terminal
} from 'lucide-react';

export const metadata = {
    title: 'About | AlphaLens',
    description: 'Learn about AlphaLens and our vision for AI-powered institutional-grade trading tools.',
};

export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto pb-20 px-4">
            {/* Hero Section */}
            <section className="text-center space-y-8 pt-16 mb-20">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-3xl border border-[#10E55A]/20 bg-gray-950/40 backdrop-blur-xl shadow-[0_0_30px_rgba(16,229,90,0.1)]">
                        <Image src="/images/alphalens-flat.png" alt="AlphaLens Logo" width={80} height={80} className="rounded-2xl" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 tracking-tighter pb-2">
                    Institutional Intelligence <br /> for the Rest of Us.
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
                    AlphaLens is a premium, AI-powered trading companion designed to bridge the gap between raw market data and actionable intelligence.
                </p>
            </section>

            {/* AI Capability Grid */}
            <section className="grid md:grid-cols-3 gap-6 mb-24">
                <FeatureCard
                    icon={<BrainCircuit className="text-[#10E55A]" />}
                    title="NLP Sentiment"
                    desc="We utilize DistilRoBERTa models to parse global news and social sentiment, providing a real-time 'Bull/Bear' pulse for every ticker."
                />
                <FeatureCard
                    icon={<Bot className="text-[#10E55A]" />}
                    title="Shadow Agent"
                    desc="Our Reinforcement Learning simulators track model performance against traditional strategies, helping you optimize your allocation."
                />
                <FeatureCard
                    icon={<ShieldAlert className="text-[#10E55A]" />}
                    title="Anomaly Detection"
                    desc="Sophisticated algorithms monitor for unusual volume spikes and price manipulation, alerting you before the breakout happens."
                />
            </section>

            {/* Vision Section */}
            <section className="grid md:grid-cols-2 gap-12 items-center mb-24 bg-gray-950/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <Terminal size={200} className="text-[#10E55A]" />
                </div>
                
                <div className="space-y-6 relative z-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">The AlphaLens Vision</h2>
                    <p className="text-gray-400 leading-relaxed text-lg font-medium">
                        AlphaLens was born from a simple realization: retail traders have better hardware than ever, but still rely on delayed, noisy data. 
                    </p>
                    <p className="text-gray-400 leading-relaxed text-lg font-medium">
                        Our mission is to provide a "Terminal-first" experience—clean, glassmorphic, and high-performance—built on a modern stack of Next.js 15, Inngest, and MongoDB.
                    </p>
                    <div className="pt-4 flex flex-wrap gap-4">
                        <Link href="/dashboard" className="inline-flex items-center gap-2 bg-[#10E55A] text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">
                            Try the Terminal <ArrowRight size={18} strokeWidth={3} />
                        </Link>
                    </div>
                </div>

                <div className="relative aspect-square w-full bg-black/60 rounded-[2rem] overflow-hidden border border-white/10 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-[#10E55A]/5 group-hover:bg-[#10E55A]/10 transition-colors" />
                    <Image
                        src="/images/alphalens-flat.png"
                        alt="AlphaLens Platform"
                        width={200}
                        height={200}
                        className="object-contain opacity-80 group-hover:scale-110 transition-transform duration-700"
                    />
                </div>
            </section>

            {/* Built By Section */}
            <section className="text-center space-y-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Built with ❤️ by Synaptic Surge
                </div>
                
                {/* <div className="flex flex-wrap justify-center gap-4">
                    <SocialButton 
                        href="https://github.com/vinay2047/AlphaLens-Trading-Partner" 
                        icon={<Github size={20} />} 
                        label="View Source" 
                    />
                    <SocialButton 
                        href="https://twitter.com/your-handle" 
                        icon={<Twitter size={20} />} 
                        label="Follow Updates" 
                    />
                    <SocialButton 
                        href="https://linkedin.com/company/synaptic-surge" 
                        icon={<Linkedin size={20} />} 
                        label="LinkedIn" 
                    />
                </div> */}
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-gray-950/60 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:border-[#10E55A]/40 group shadow-lg">
            <div className="mb-6 p-4 bg-[#10E55A]/5 w-fit rounded-2xl border border-[#10E55A]/10 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#10E55A] transition-colors">{title}</h3>
            <p className="text-gray-400 leading-relaxed font-medium text-sm">{desc}</p>
        </div>
    );
}

function SocialButton({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-gray-950/40 backdrop-blur-md hover:bg-white/5 text-white rounded-2xl transition-all duration-300 border border-white/5 hover:border-[#10E55A]/40 font-bold group shadow-xl"
        >
            <span className="text-gray-400 group-hover:text-[#10E55A] transition-colors">{icon}</span>
            <span>{label}</span>
        </a>
    );
}