"use client";

import React from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

interface NewsGridProps {
    news: any[];
}

export default function NewsGrid({ news }: NewsGridProps) {
    if (!news || news.length === 0) return null;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center">
                <span className="w-2 h-6 bg-[#10E55A] rounded-full mr-3"></span>
                Market Intelligence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, idx) => (
                    <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-gray-950/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl hover:border-[#10E55A]/30 transition-all duration-300 group hover:-translate-y-1"
                    >
                        <div className="p-6 flex flex-col h-full bg-gradient-to-br from-white/[0.02] to-transparent">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider border ${item.related ? "bg-[#10E55A]/10 text-[#10E55A] border-[#10E55A]/20" : "bg-white/5 text-gray-400 border-white/10"
                                    }`}>
                                    {item.related || "MARKET"}
                                </span>
                                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-[#10E55A] transition-colors" />
                            </div>
                            <h3 className="text-base font-bold text-gray-200 mb-3 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                                {item.headline}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-3 mb-5 flex-1 leading-relaxed">
                                {item.summary}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-600 mt-auto font-medium">
                                <span className="text-gray-400">{item.source}</span>
                                <span>
                                    {item.datetime ? formatDistanceToNow(item.datetime * 1000, { addSuffix: true }) : ''}
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
