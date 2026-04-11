import Link from "next/link";

const Footer = () => {
    return (
        <footer className="border-t border-gray-800/50 bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-md bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-gray-900 font-black text-[10px]">
                            α
                        </div>
                        <span className="text-sm font-semibold text-gray-400">AlphaLens</span>
                        <span className="text-xs text-gray-600 ml-2">© {new Date().getFullYear()}</span>
                    </div>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="/about" className="text-gray-500 hover:text-gray-300 transition-colors">About</Link>
                        <Link href="/api-docs" className="text-gray-500 hover:text-gray-300 transition-colors">API</Link>
                        <Link href="/help" className="text-gray-500 hover:text-gray-300 transition-colors">Help</Link>
                        <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
