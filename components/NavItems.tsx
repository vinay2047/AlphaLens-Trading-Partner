'use client'

import React from 'react'
import {NAV_ITEMS} from "@/lib/constants";
import Link from "next/link";
import {usePathname} from "next/navigation";
import SearchCommand from "@/components/SearchCommand";

const NavItems = ({initialStocks}: { initialStocks: StockWithWatchlistStatus[]}) => {
    const pathname = usePathname()

    const isActive = (path: string) => {
        if (path ==='/') return pathname === '/'
        return pathname.startsWith(path);
    }

    return (
        <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({href, label}) => {
                if (href === '/search') return (
                    <li key="search-trigger">
                        <SearchCommand
                            renderAs="text"
                            label="Search"
                            initialStocks={initialStocks}
                        />
                    </li>
                )
                return (
                    <li key={href}>
                        <Link
                            href={href}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                isActive(href)
                                    ? 'text-gray-100 bg-gray-700/50'
                                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                            }`}
                        >
                            {label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
export default NavItems
