'use client';

import { SignIn } from '@clerk/nextjs';
import React from 'react';
import { TrendingUp, Shield } from 'lucide-react';

const SignInPage = () => {
    return (
        <div className="w-full max-w-md mx-auto relative group">
            {/* Ambient background glow */}
            <div className="absolute -inset-1 bg-gradient-to-br from-[#10E55A]/15 via-transparent to-[#10E55A]/5 rounded-[2.5rem] blur-xl opacity-50 transition duration-1000 group-hover:opacity-75"></div>

            {/* Main Form Container */}
            <div className="relative p-8 sm:p-10 rounded-[2rem] bg-[#060606]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden">
                
                {/* Top highlight line */}
                <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#10E55A]/40 to-transparent"></div>

                {/* Mini status badges */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10E55A]/10 border border-[#10E55A]/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10E55A] animate-pulse"></div>
                        <span className="text-[10px] font-bold text-[#10E55A] uppercase tracking-widest">Live</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                        <Shield className="w-3 h-3 text-gray-400" />
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">256-bit SSL</span>
                    </div>
                </div>

                {/* Custom Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Welcome Back</h1>
                    <p className="text-sm text-gray-400 font-medium">Log in to resume tracking your portfolio.</p>
                </div>
                
                {/* Clerk SignIn Component */}
                <div className="flex justify-center w-full">
                    <SignIn
                        appearance={{
                            elements: {
                                rootBox: 'w-full',
                                cardBox: 'w-full shadow-none',
                                card: 'w-full bg-transparent shadow-none p-0',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',

                                // Social Buttons
                                socialButtonsBlockButton:
                                    'h-12 bg-white/[0.06] border border-white/[0.12] text-white hover:bg-white/[0.1] hover:border-[#10E55A]/30 transition-all duration-200 rounded-xl',
                                socialButtonsBlockButtonText: 'text-sm font-semibold tracking-wide text-gray-200',
                                socialButtonsBlockButtonArrow: 'text-gray-400',

                                // Dividers
                                dividerLine: 'bg-white/[0.08]',
                                dividerText: 'text-gray-500 text-[11px] font-semibold uppercase tracking-widest px-4',

                                // Input Fields
                                formFieldLabel: 'text-xs uppercase tracking-widest font-semibold text-gray-400 mb-1.5',
                                formFieldInput:
                                    'h-12 bg-white/[0.04] border border-white/[0.1] rounded-xl text-white placeholder:text-gray-600 focus:bg-white/[0.08] focus:ring-2 focus:ring-[#10E55A]/25 focus:border-[#10E55A]/60 transition-all px-4',
                                
                                // Primary Button
                                formButtonPrimary:
                                    'w-full h-12 text-sm font-bold bg-[#10E55A] hover:bg-[#0fd654] text-black rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,229,90,0.15)] hover:shadow-[0_0_30px_rgba(16,229,90,0.35)] mt-2',

                                // Links
                                footerActionLink: 'text-[#10E55A] hover:text-[#12f060] font-semibold transition-colors',
                                footerActionText: 'text-gray-400',
                                footer: 'hidden',
                                formFieldAction: 'text-[#10E55A] hover:text-[#12f060] text-xs font-medium transition-colors',
                                identityPreviewEditButton: 'text-[#10E55A] hover:text-[#12f060] transition-colors',
                                identityPreviewText: 'text-gray-300',

                                // Alerts
                                alert: 'bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl',
                                alertText: 'text-red-400',

                                // Other element overrides for dark theme
                                formFieldSuccessText: 'text-[#10E55A]',
                                otpCodeFieldInput: 'bg-white/[0.04] border-white/[0.1] text-white',
                            },
                        }}
                        routing="path"
                        path="/sign-in"
                        signUpUrl="/sign-up"
                        forceRedirectUrl="/dashboard"
                    />
                </div>

                {/* Bottom helper link */}
                <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
                    <p className="text-sm text-gray-500">
                        Don&apos;t have an account?{' '}
                        <a href="/sign-up" className="text-[#10E55A] hover:text-[#12f060] font-semibold transition-colors">
                            Create one
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
export default SignInPage;
