import Link from "next/link";
import SearchCommand from "@/components/SearchCommand";
import UserDropdown from "@/components/UserDropdown";

const Header = ({ user }: { user: User }) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#000000]/80 backdrop-blur-xl">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/dashboard" className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-teal-400 flex items-center justify-center text-black font-extrabold text-lg shadow-[0_0_15px_rgba(16,229,90,0.3)]">
                        α
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">
                        AlphaLens
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-1 md:gap-3 text-sm font-medium text-gray-400">
                    <Link href="/dashboard" className="rounded-lg px-4 py-2 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                        Dashboard
                    </Link>
                    <Link href="/portfolio" className="rounded-lg px-4 py-2 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                        Portfolio
                    </Link>
                    <Link href="/watchlist" className="rounded-lg px-4 py-2 hover:bg-gray-800 hover:text-white transition-colors duration-200">
                        Watchlist
                    </Link>

                    <div className="h-5 w-px bg-gray-800 mx-2 hidden lg:block"></div>

                    <SearchCommand renderAs="button" label="Search Symbol" initialStocks={[]} />
                </nav>

                <div className="flex items-center gap-4">
                    <UserDropdown user={user} />
                </div>
            </div>
        </header>
    )
}
export default Header
