import Link from "next/link";
import Image from "next/image";

const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-gray-950/60 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-950/40">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Brand */}
                    <Link href="/dashboard" className="flex items-center gap-2 group cursor-pointer">
                        <Image 
                            src="/images/alphalens-flat.png" 
                            alt="AlphaLens Logo" 
                            width={24} 
                            height={24} 
                            className="rounded-md ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-300"
                        />
                        <span className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">AlphaLens</span>
                        <span className="text-xs text-gray-600 ml-2 group-hover:text-gray-500 transition-colors">© {new Date().getFullYear()}</span>
                    </Link>

                    {/* Links */}
                    <div className="flex items-center gap-6 text-sm">
                        <Link href="/about" className="text-gray-500 hover:text-gray-300 transition-colors">About</Link>
                        <Link href="/help" className="text-gray-500 hover:text-gray-300 transition-colors">Help</Link>
                        <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
