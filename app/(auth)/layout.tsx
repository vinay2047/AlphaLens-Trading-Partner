import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Star, TrendingUp, BarChart3, Shield } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();

    if (userId) redirect('/dashboard');

    return (
        <main className="auth-layout !bg-[#000000]">
            <section className="auth-left-section scrollbar-hide-default z-10 bg-[#030303] relative">
                {/* Subtle background glow left */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#10E55A]/[0.04] blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#10E55A]/[0.03] blur-[100px] rounded-full pointer-events-none translate-x-1/2 translate-y-1/2"></div>

                <Link href="/" className="auth-logo flex items-center gap-3 text-white text-2xl font-extrabold tracking-tight relative z-10 w-fit">
                    <Image 
                        src="/images/alphalens-flat.png" 
                        alt="AlphaLens Logo" 
                        width={44} 
                        height={44} 
                        className="rounded-xl ring-1 ring-white/10 shadow-lg"
                    />
                    AlphaLens
                </Link>

                <div className="pb-6 lg:pb-8 flex-1 relative z-10 justify-center flex flex-col h-full">
                    {children}
                </div>
            </section>
            
            <section className="auth-right-section !bg-[#000000] border-l border-white/[0.06] relative overflow-hidden flex flex-col justify-center items-center">
                {/* Layered ambient glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#10E55A]/[0.06] blur-[150px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#10E55A]/[0.04] blur-[120px] rounded-full pointer-events-none translate-x-1/3 translate-y-1/3"></div>
                
                {/* Decorative grid lines */}
                <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

                <div className="z-10 relative max-w-lg w-full px-2">
                    {/* Stats cards row */}
                    <div className="grid grid-cols-3 gap-3 mb-10">
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-sm">
                            <TrendingUp className="w-5 h-5 text-[#10E55A] mx-auto mb-2" />
                            <div className="text-xl font-extrabold text-white tracking-tight">50K+</div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Active Traders</div>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-sm">
                            <BarChart3 className="w-5 h-5 text-[#10E55A] mx-auto mb-2" />
                            <div className="text-xl font-extrabold text-white tracking-tight">$2.1B</div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Volume Tracked</div>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 text-center backdrop-blur-sm">
                            <Shield className="w-5 h-5 text-[#10E55A] mx-auto mb-2" />
                            <div className="text-xl font-extrabold text-white tracking-tight">99.9%</div>
                            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mt-1">Uptime SLA</div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="relative">
                        <div className="absolute -top-3 -left-2 text-[#10E55A]/20 text-6xl font-serif leading-none select-none">&ldquo;</div>
                        <blockquote className="text-xl md:text-2xl lg:text-[1.7rem] font-semibold text-white mb-8 leading-snug pl-4">
                            AlphaLens isn&apos;t just another stock app. It&apos;s about giving people clarity and control in the market, with real portfolio management.
                        </blockquote>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/[0.08] pt-6">
                        <div>
                            <cite className="text-sm font-bold text-[#10E55A] not-italic block mb-0.5">AlphaLens Team</cite>
                            <p className="text-xs text-gray-500 font-medium">Your Trading Partner</p>
                        </div>
                        <div className="flex items-center gap-0.5 text-[#10E55A] bg-[#10E55A]/10 px-3 py-1.5 rounded-full border border-[#10E55A]/20">
                            {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-3.5 h-3.5 fill-current" />
                            ))}
                        </div>
                    </div>

                    {/* Feature pills */}
                    <div className="flex flex-wrap gap-2 mt-8">
                        {['Real-time Data', 'AI Predictions', 'Portfolio Tracking', 'Global Markets'].map((feature) => (
                            <span key={feature} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-gray-400 tracking-wide">
                                {feature}
                            </span>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Layout
