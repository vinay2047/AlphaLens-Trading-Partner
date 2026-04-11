import Link from "next/link";
import NavItems from "@/components/NavItems";
import UserDropdown from "@/components/UserDropdown";
import NotificationBell from "@/components/NotificationBell";
import {searchStocks} from "@/lib/actions/finnhub.actions";

const Header = async ({ user }: { user: User }) => {
    const initialStocks = await searchStocks();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-xl">
            <div className="container flex h-14 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-gray-900 font-black text-sm">
                        α
                    </div>
                    <span className="text-base font-bold text-gray-100 tracking-tight hidden sm:inline">
                        AlphaLens
                    </span>
                </Link>

                {/* Nav */}
                <nav className="hidden md:block">
                    <NavItems initialStocks={initialStocks}/>
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-1.5">
                    <NotificationBell />
                    <UserDropdown user={user} initialStocks={initialStocks} />
                </div>
            </div>
        </header>
    )
}
export default Header