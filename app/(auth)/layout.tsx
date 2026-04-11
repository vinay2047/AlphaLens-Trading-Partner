import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();

    if (userId) redirect('/dashboard');

    return (
        <main className="auth-layout !bg-[#000000]">
            <section className="auth-left-section scrollbar-hide-default z-10 bg-gray-900 relative">
                {/* Subtle background glow left */}
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"></div>

                <Link href="/" className="auth-logo flex items-center gap-3 text-white text-3xl font-bold tracking-tight relative z-10">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400 text-black font-extrabold shadow-[0_0_20px_rgba(16,229,90,0.4)]">α</span>
                    AlphaLens
                </Link>

                <div className="pb-6 lg:pb-8 flex-1 relative z-10 justify-center flex flex-col h-full">
                    {children}
                </div>
            </section>
            
            <section className="auth-right-section bg-[#000000] border-l border-gray-800/50 relative overflow-hidden flex justify-center">
                 {/* Heavy ambient background right */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

                <div className="z-10 relative lg:mt-4 lg:mb-16 max-w-lg mt-auto">
                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-semibold text-white mb-6 lg:mb-10 leading-tight">
                        "AlphaLens isn't just another stock app. It's about giving people clarity and control in the market, with real portfolio management."
                    </blockquote>
                    <div className="flex items-center justify-between border-t border-gray-800 pt-6">
                        <div>
                            <cite className="text-sm md:text-base font-bold text-teal-400 not-italic block mb-1">AlphaLens Team</cite>
                            <p className="max-md:text-xs text-gray-500 font-medium">Your Trading Partner</p>
                        </div>
                        <div className="flex items-center gap-1 text-teal-400 bg-teal-500/10 px-3 py-1.5 rounded-full border border-teal-500/20">
                            {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-4 h-4 fill-current" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Layout
