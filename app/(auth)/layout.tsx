import Link from "next/link";
import Image from "next/image";
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

                <Link href="/" className="auth-logo flex items-center gap-3 text-white text-3xl font-bold tracking-tight relative z-10 w-fit">
                    <Image 
                        src="/images/alphalens-flat.png" 
                        alt="AlphaLens Logo" 
                        width={48} 
                        height={48} 
                        className="rounded-xl ring-1 ring-white/10"
                    />
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
                            <cite className="text-sm md:text-base font-bold text-[#10E55A] not-italic block mb-1">AlphaLens Team</cite>
                            <p className="max-md:text-xs text-gray-500 font-medium">Your Trading Partner</p>
                        </div>
                        <div className="flex items-center gap-1 text-[#10E55A] bg-[#10E55A]/10 px-3 py-1.5 rounded-full border border-[#10E55A]/20">
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
