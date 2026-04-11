'use client';

import { SignIn } from '@clerk/nextjs';
import React from 'react';

const SignInPage = () => {
    return (
        <>
            <h1 className="form-title">Welcome back</h1>
            <div className="flex justify-center">
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: 'w-full',
                            cardBox: 'w-full shadow-none',
                            card: 'w-full bg-transparent shadow-none p-0',
                            headerTitle: 'hidden',
                            headerSubtitle: 'hidden',
                            socialButtonsBlockButton:
                                'h-12 bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:text-teal-400 transition-colors rounded-lg',
                            socialButtonsBlockButtonText: 'text-base font-medium',
                            dividerLine: 'bg-gray-600',
                            dividerText: 'text-gray-500',
                            formFieldLabel: 'form-label',
                            formFieldInput: 'form-input bg-transparent',
                            formButtonPrimary:
                                'yellow-btn w-full h-12 text-base font-medium',
                            footerActionLink: 'text-teal-400 hover:text-teal-500',
                            footer: 'hidden',
                            formFieldAction: 'text-teal-400 hover:text-teal-500',
                            identityPreviewEditButton: 'text-teal-400 hover:text-teal-500',
                            alert: 'bg-gray-800 border-gray-600 text-gray-400',
                        },
                    }}
                    routing="path"
                    path="/sign-in"
                    signUpUrl="/sign-up"
                    forceRedirectUrl="/"
                />
            </div>
        </>
    );
};
export default SignInPage;
