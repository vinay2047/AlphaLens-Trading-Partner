'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Github } from 'lucide-react';

const DONATE_POPUP_KEY = 'alphalens-donate-popup-dismissed';
const DONATE_POPUP_DELAY = 5000;
const DONATE_POPUP_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 7 days

const GITHUB_SPONSOR_URL = 'https://github.com/sponsors/ravixalgorithm';

export default function DonatePopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem(DONATE_POPUP_KEY);

        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            if (Date.now() - dismissedTime < DONATE_POPUP_COOLDOWN) return;
        }

        const timer = setTimeout(() => setOpen(true), DONATE_POPUP_DELAY);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleOpenPopup = () => setOpen(true);
        window.addEventListener('open-donate-popup', handleOpenPopup);
        return () => window.removeEventListener('open-donate-popup', handleOpenPopup);
    }, []);

    const handleDismiss = () => {
        setOpen(false);
        localStorage.setItem(DONATE_POPUP_KEY, Date.now().toString());
    };

    const handleDonate = () => {
        window.open(GITHUB_SPONSOR_URL, '_blank', 'noopener,noreferrer');
        handleDismiss();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="!bg-gray-800 !border-gray-600 text-gray-100 max-w-sm">
                <DialogHeader>
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="p-1.5 bg-teal-500/15 rounded-lg">
                            <Heart className="h-4 w-4 text-teal-400 fill-teal-400" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-gray-100">
                            Support AlphaLens
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-400 text-sm leading-relaxed pt-1">
                        AlphaLens is free and open-source. Help us keep it running by sponsoring on GitHub.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-2.5 mt-4">
                    <Button
                        onClick={handleDonate}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-gray-900 font-semibold h-9 text-sm"
                    >
                        <Github className="h-3.5 w-3.5 mr-1.5" />
                        Sponsor
                    </Button>
                    <Button
                        onClick={handleDismiss}
                        variant="outline"
                        className="border-gray-600 text-gray-400 hover:bg-gray-700 h-9 text-sm"
                    >
                        Later
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
