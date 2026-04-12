'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SearchCommand from "@/components/SearchCommand";
import UserDropdown from "@/components/UserDropdown";

const Header = ({ user }: { user: User }) => {
    const pathname = usePathname() || '';

    const isActive = (path: string) => {
        if (path === '/dashboard' && pathname === '/dashboard') return true;
        if (path !== '/dashboard' && pathname.startsWith(path)) return true;
        return false;
    };

    const linkBaseClass = "px-4 py-2 rounded-full transition-all duration-300";
    const activeClass = "bg-[#10E55A]/15 text-[#10E55A] font-medium";
    const inactiveClass = "text-gray-400 hover:text-white hover:bg-white/10";

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-gray-950/60 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-950/40">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <Image 
                        src="/images/alphalens-flat.png" 
                        alt="AlphaLens Logo" 
                        width={40} 
                        height={40} 
                        className="rounded-xl ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="text-xl font-bold text-white tracking-tight">
                        AlphaLens
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
                    <Link href="/dashboard" className={`${linkBaseClass} ${isActive('/dashboard') ? activeClass : inactiveClass}`}>
                        Dashboard
                    </Link>
                    <Link href="/portfolio" className={`${linkBaseClass} ${isActive('/portfolio') ? activeClass : inactiveClass}`}>
                        Portfolio
                    </Link>
                    <Link href="/watchlist" className={`${linkBaseClass} ${isActive('/watchlist') ? activeClass : inactiveClass}`}>
                        Watchlist
                    </Link>

                    <div className="h-4 w-px bg-white/10 mx-3 hidden lg:block"></div>

                    <div className="opacity-90 hover:opacity-100 transition-opacity">
                        <SearchCommand renderAs="button" label="Search Symbols" initialStocks={[]} />
                    </div>
                </nav>

                <div className="flex items-center gap-4">
                    <UserDropdown user={user} />
                </div>
            </div>
        </header>
    )
}
export default Header
