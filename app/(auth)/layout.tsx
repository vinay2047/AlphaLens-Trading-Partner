import Link from "next/link";
import React from "react";
import { Star } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const { userId } = await auth();

    if (userId) redirect('/dashboard');

    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo flex items-center gap-3 text-white text-2xl font-semibold">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950 font-bold">α</span>
                    AlphaLens
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">
                    {children}
                </div>
            </section>
            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">
                        "AlphaLens isn't just another stock app. It's about giving people clarity and control in the market, with real portfolio management and seamless trading."
                    </blockquote>
                    <div className="flex items-center justify-between">
                        <div>
                            <cite className="auth-testimonial-author">- AlphaLens Team</cite>
                            <p className="max-md:text-xs text-gray-500">Your Trading Partner</p>
                        </div>
                        <div className="flex items-center gap-0.5 text-emerald-400">
                            {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-4 h-4" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
export default Layout
