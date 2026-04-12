"use client";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { Star, Check, Trash2 } from "lucide-react";

interface WatchlistButtonProps {
    symbol: string;
    company: string;
    isInWatchlist: boolean;
    showTrashIcon?: boolean;
    type?: "button" | "icon";
    userId?: string; // Made optional for backward compat, but required for actions
    onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
    symbol,
    company,
    isInWatchlist,
    showTrashIcon = false,
    type = "button",
    userId,
    onWatchlistChange,
}: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist);
    const [loading, setLoading] = useState(false);

    const label = useMemo(() => {
        if (type === "icon") return added ? "" : "";
        return added ? "Remove from Watchlist" : "Add to Watchlist";
    }, [added, type]);

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation if inside a link

        if (!userId && !onWatchlistChange) {
            console.error("WatchlistButton: userId or onWatchlistChange is required");
            toast.error("Please sign in to modify watchlist");
            return;
        }

        const next = !added;
        setAdded(next); // Optimistic update
        setLoading(true);

        try {
            if (userId) {
                if (next) {
                    const response = await fetch('/api/watchlist', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ symbol, company }),
                    });
                    if (!response.ok) {
                        throw new Error('Failed to add to watchlist');
                    }
                    toast.success(`${symbol} added to watchlist`);
                } else {
                    const response = await fetch(`/api/watchlist?symbol=${encodeURIComponent(symbol)}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                        throw new Error('Failed to remove from watchlist');
                    }
                    toast.success(`${symbol} removed from watchlist`);
                }
            }

            // Call external handler if provided (e.g. for UI refresh)
            onWatchlistChange?.(symbol, next);
        } catch (error) {
            console.error("Watchlist action failed:", error);
            setAdded(!next); // Revert on error
            toast.error("Failed to update watchlist");
        } finally {
            setLoading(false);
        }
    };

    if (type === "icon") {
        return (
            <button
                type="button"
                title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                className={`flex items-center justify-center p-2 rounded-full transition-all ${added ? "text-yellow-400 hover:bg-yellow-400/10" : "text-gray-400 hover:text-white hover:bg-white/10"} ${loading ? "opacity-50 cursor-wait" : ""}`}
                onClick={handleClick}
                disabled={loading}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={added ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-6 h-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            type="button"
            className={`
                relative group flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 overflow-hidden
                ${added 
                    ? "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.15)]" 
                    : "bg-black/40 text-gray-300 border border-gray-800 hover:text-[#10E55A] hover:bg-[#10E55A]/10 hover:border-[#10E55A]/40  shadow-[0_0_20px_rgba(0,0,0,0.5)]"}
                ${loading ? "opacity-50 cursor-wait" : "cursor-pointer"}
            `}
            onClick={handleClick}
            disabled={loading}
        >
            {/* Hover Glow Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#10E55A]/5 to-transparent -translate-x-[150%] skew-x-[-30deg] group-hover:animate-[sweep_1.5s_ease-in-out_infinite]" />

            {added ? (
                showTrashIcon ? <Trash2 className="w-4 h-4 text-green-400" /> : <Check className="w-4 h-4 text-green-400" />
            ) : (
                <Star className={`w-4 h-4 transition-colors ${loading ? "text-gray-500" : "group-hover:text-[#10E55A]"}`} />
            )}
            
            <span className="relative z-10">{loading ? "Updating..." : label}</span>
        </button>
    );
};

export default WatchlistButton;
