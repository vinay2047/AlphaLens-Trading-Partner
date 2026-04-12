
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Users,
    Globe,
    Heart,
    Code,
    Github,
    Twitter,
    Linkedin,
    ArrowRight
} from 'lucide-react';

export const metadata = {
    title: 'About | AlphaLens',
    description: 'The story behind AlphaLens and the team at Synaptic Surge.',
};

export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto pb-20 px-4">
            {/* Hero Section */}
            <section className="text-center space-y-8 pt-16 mb-20">
                <div className="flex justify-center mb-6">
                    <div className="p-4 rounded-3xl border border-white/5 bg-gray-950/40 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                        <Image src="/images/alphalens-flat.png" alt="AlphaLens Logo" width={80} height={80} className="rounded-2xl" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                    Tools for Everyone.
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                    We believe financial intelligence shouldn't be locked behind paywalls.
                    AlphaLens is built by the community, for the community.
                </p>
            </section>

            {/* Mission Grid */}
            <section className="grid md:grid-cols-3 gap-6 mb-24">
                <FeatureCard
                    icon={<Globe className="text-[#10E55A]" />}
                    title="Open Access"
                    desc="No premium tiers for core features. Real-time data and insights available to all, forever."
                />
                <FeatureCard
                    icon={<Code className="text-[#10E55A]" />}
                    title="Open Source"
                    desc="Fully transparent codebase. Audit our algorithms, contribute features, and build with us."
                />
                <FeatureCard
                    icon={<Heart className="text-[#10E55A]" />}
                    title="Community Driven"
                    desc="Powered by donations and volunteers. We answer to our users, not shareholders."
                />
            </section>

            {/* Story Section */}
            <section className="grid md:grid-cols-2 gap-12 items-center mb-24 bg-gray-950/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white">Synaptic Surge</h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        AlphaLens was born from a simple frustration: why are powerful financial tools so expensive?
                    </p>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        We are a collective of developers, designers, and financial enthusiasts working under the <span className="text-[#10E55A] font-semibold">Synaptic Surge</span> banner. Our mission is to democratize software by building high-quality, open-source alternatives to proprietary platforms.
                    </p>
                    <div className="pt-4">
                        <Link href="https://github.com/Open-Dev-Society" target="_blank" className="inline-flex items-center gap-2 text-[#10E55A] hover:text-white font-medium transition-colors group">
                            Visit our GitHub <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
                <div className="relative h-[400px] w-full bg-gradient-to-br from-black to-gray-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl group flex items-center justify-center">
                    <Image
                        src="/images/alphalens-flat.png"
                        alt="AlphaLens / Synaptic Surge"
                        width={250}
                        height={250}
                        className="object-contain opacity-60 group-hover:scale-105 transition-transform duration-700"
                    />
                </div>
            </section>

        </div>
    );
}

function FeatureCard({ icon, title, desc }: any) {
    return (
        <div className="bg-gray-950/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:border-[#10E55A]/30">
            <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl border border-white/10">{icon}</div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
        </div>
    );
}

function SocialButton({ href, icon, label }: any) {
    return (
        <a
            href={href}
            target="_blank"
            className="flex items-center gap-3 px-6 py-3 bg-gray-950/40 backdrop-blur-md hover:bg-white/10 text-white rounded-xl transition-all duration-200 border border-white/5 hover:border-[#10E55A]/40 font-medium group"
        >
            {icon}
            <span>{label}</span>
        </a>
    );
}
