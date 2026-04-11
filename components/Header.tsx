import Link from "next/link";
import UserDropdown from "@/components/UserDropdown";

const Header = ({ user }: { user: User }) => {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-semibold text-base">
                        α
                    </div>
                    <span className="text-base font-semibold text-slate-100 tracking-tight">
                        AlphaLens
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-3 text-sm text-slate-300">
                    <Link href="/" className="rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white">
                        Dashboard
                    </Link>
                    <Link href="/portfolio" className="rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white">
                        Portfolio
                    </Link>
                    <Link href="/watchlist" className="rounded-md px-3 py-2 hover:bg-slate-800 hover:text-white">
                        Watchlist
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <UserDropdown user={user} />
                </div>
            </div>
        </header>
    )
}
export default Header