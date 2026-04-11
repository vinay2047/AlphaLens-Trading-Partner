import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ClerkProvider } from "@clerk/nextjs";
import {Toaster} from "@/components/ui/sonner";
import "./globals.css";

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
                    colorPrimary: '#0FEDBE',
                    colorBackground: '#141414',
                    colorInputBackground: '#212328',
                    colorInputText: '#CCDADC',
                    colorText: '#CCDADC',
                    colorTextSecondary: '#9095A1',
                },
                elements: {
                    card: 'bg-gray-900 border-gray-600',
                    socialButtonsBlockButton: 'bg-gray-800 border-gray-600 text-gray-400',
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
