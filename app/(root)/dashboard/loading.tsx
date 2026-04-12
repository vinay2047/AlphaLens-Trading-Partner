import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-800 bg-black/60 p-8 shadow-lg backdrop-blur-md">
                <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
                <p className="text-sm font-medium text-gray-400">Loading dashboard...</p>
            </div>
        </div>
    );
}
