import React from 'react';
import { ShieldCheck, Lock,  Database } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="max-w-4xl mx-auto py-20 px-6">
            <header className="mb-16 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-[#10E55A]/10 text-[#10E55A] mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Privacy Policy</h1>
                <p className="text-gray-400 font-medium">Last updated: April 2026</p>
            </header>

            <div className="space-y-12 text-gray-300 leading-relaxed font-medium">
                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Database size={20} className="text-[#10E55A]" /> 1. Data Collection
                    </h2>
                    <p>
                        AlphaLens collects information necessary to provide institutional-grade trading insights. This includes:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                        <li><strong className="text-white">Account Information:</strong> Managed via Clerk, including your email and profile details.</li>
                        <li><strong className="text-white">Portfolio Data:</strong> Asset holdings and watchlists stored securely in our MongoDB clusters.</li>
                        <li><strong className="text-white">Usage Analytics:</strong> Tracking interactions to improve our AI sentiment and anomaly detection models.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <Lock size={20} className="text-[#10E55A]" /> 2. Data Security
                    </h2>
                    <p>
                        We employ enterprise-level encryption for data at rest and in transit. Your authentication is handled by Clerk, ensuring that we never see or store your raw passwords. 
                    </p>
                </section>

                <section className="p-8 bg-gray-950/40 border border-white/5 rounded-3xl backdrop-blur-xl">
                    <h2 className="text-xl font-bold text-white mb-2">Third-Party Services</h2>
                    <p className="text-sm text-gray-400">
                        We share data with our infrastructure partners (Vercel, MongoDB, Clerk, and Finnhub) only as required to maintain service functionality. We do not sell your personal data to third-party advertisers.
                    </p>
                </section>
            </div>
        </div>
    );
}