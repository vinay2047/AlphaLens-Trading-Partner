import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from "@/components/ui/sonner";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AlphaLens Trading Partner",
  description: "AlphaLens is your intelligent trading partner. Track real-time prices, manage your portfolio, trade stocks with AlphaFunds, and explore detailed company insights.",
  icons: {
    icon: "/images/alphalens-flat.png",
  },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: '#10E55A',
                    colorBackground: '#060606',
                    colorInputBackground: '#0d0d0d',
                    colorInputText: '#e5e5e5',
                    colorText: '#d4d4d4',
                    colorTextSecondary: '#737373',
                    colorTextOnPrimaryBackground: '#000000',
                    colorDanger: '#ef4444',
                    colorSuccess: '#10E55A',
                    colorNeutral: '#a3a3a3',
                },
                elements: {
                    card: 'bg-transparent shadow-none',
                    cardBox: 'shadow-none',
                    socialButtonsBlockButton: 'bg-white/[0.06] border-white/[0.12] text-gray-200 hover:bg-white/[0.1]',
                    formFieldInput: 'bg-white/[0.04] border-white/[0.1] text-white rounded-xl',
                    footerAction: 'text-gray-400',
                    footerActionLink: 'text-[#10E55A] hover:text-[#12f060] font-semibold',
                },
            }}
        >
            <html lang="en" className="dark">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    {children}
                    <Toaster/>
                    <Analytics />
                </body>
            </html>
        </ClerkProvider>
    );
}
