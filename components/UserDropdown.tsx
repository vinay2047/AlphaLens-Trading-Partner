'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Briefcase } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";

const UserDropdown = ({ user }: {user: User}) => {
    const router = useRouter();
    const { signOut } = useClerk();

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2.5 h-auto pr-4 pl-2 py-1.5 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all">
                    <Avatar className="h-8 w-8 ring-1 ring-white/10 shadow-sm">
                        <AvatarImage src={user.imageUrl || ''} />
                        <AvatarFallback className="bg-[#10E55A] text-black text-sm font-bold">
                            {user.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-200 hover:text-white transition-colors">
                            {user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] mt-2 p-2 rounded-2xl border-white/5 bg-gray-950/80 backdrop-blur-xl shadow-2xl">
                <DropdownMenuLabel className="mb-2">
                    <div className="flex items-center gap-3 py-1">
                        <Avatar className="h-10 w-10 ring-1 ring-white/10">
                            <AvatarImage src={user.imageUrl || ''} />
                            <AvatarFallback className="bg-[#10E55A] text-black text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-gray-100 truncate">
                                {user.name}
                            </span>
                            <span className="text-xs text-gray-500 font-medium truncate">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 focus:bg-[#10E55A]/10 focus:text-[#10E55A] cursor-pointer transition-colors mt-1">
                    <Link href="/dashboard" className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 focus:bg-[#10E55A]/10 focus:text-[#10E55A] cursor-pointer transition-colors">
                    <Link href="/portfolio" className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Portfolio
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 focus:bg-[#10E55A]/10 focus:text-[#10E55A] cursor-pointer transition-colors">
                    <Link href="/watchlist" className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Watchlist
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5 my-1" />
                <DropdownMenuItem onClick={handleSignOut} className="rounded-xl px-3 py-2.5 text-sm font-medium text-gray-300 focus:bg-red-500/10 focus:text-red-500 cursor-pointer transition-colors">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown
