'use client';

import { SignUp } from '@clerk/nextjs';
import React from 'react';

const SignUpPage = () => {
    return (
        <div className="w-full max-w-md mx-auto p-8 rounded-3xl bg-gray-950/60 backdrop-blur-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
            {/* Subtle glow effect behind form container on hover */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#10E55A]/30 to-transparent"></div>

            <div className="mb-10 mt-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                <p className="text-sm text-gray-500 font-medium">Join AlphaLens to unlock advanced trading.</p>
            </div>
            
            <div className="flex justify-center w-full">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: 'w-full',
                            cardBox: 'w-full shadow-none',
                            card: 'w-full bg-transparent shadow-none p-0',
                            headerTitle: 'hidden',
                            headerSubtitle: 'hidden',
                            socialButtonsBlockButton:
                                'h-12 bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-[#10E55A]/30 transition-all rounded-xl relative overflow-hidden',
                            socialButtonsBlockButtonText: 'text-sm font-bold tracking-wide',
                            dividerLine: 'bg-white/10',
                            dividerText: 'text-gray-500 text-xs font-semibold uppercase tracking-widest bg-transparent px-3',
                            formFieldLabel: 'text-xs uppercase tracking-widest font-semibold text-gray-400 mb-2',
                            formFieldInput: 'h-12 bg-black/40 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-[#10E55A]/50 focus:border-[#10E55A] transition-all px-4',
                            formButtonPrimary:
                                'w-full h-12 text-sm font-bold bg-[#10E55A] hover:bg-[#0fd654] text-black rounded-xl transition-all shadow-[0_0_20px_rgba(16,229,90,0.1)] hover:shadow-[0_0_30px_rgba(16,229,90,0.3)] mt-4',
                            footerActionLink: 'text-[#10E55A] hover:text-[#0fd654] font-semibold',
                            footer: 'hidden',
                            formFieldAction: 'text-[#10E55A] hover:text-[#0fd654]',
                            identityPreviewEditButton: 'text-[#10E55A] hover:text-[#0fd654]',
                            alert: 'bg-gray-900 border border-white/10 text-gray-300 rounded-xl',
                        },
                    }}
                    routing="path"
                    path="/sign-up"
                    signInUrl="/sign-in"
                    forceRedirectUrl="/dashboard"
                />
            </div>
        </div>
    );
};
export default SignUpPage;
