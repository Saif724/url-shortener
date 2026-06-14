import { FaLink, FaChartLine } from "react-icons/fa";

export default function StatsCards({urls}) {
    const totalClicks = urls.reduce(
        (sum, u) => sum + (Number(u.clicks) || 0),
        0
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
                <div className="flex justify-between items-start">

                    <div>
                        <p className="text-sm text-gray-400">
                            Total URLs
                        </p>

                        <h2 className="text-4xl font-bold text-white mt-3">
                            {urls.length}
                        </h2>

                        <p className="text-xs text-gray-500 mt-2">
                            Your created links
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <FaLink className="text-blue-400 text-xl" />
                    </div>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition">
                <div className="flex justify-between items-start">

                    <div>
                        <p className="text-sm text-gray-400">
                            Total Clicks
                        </p>

                        <h2 className="text-4xl font-bold text-white mt-3">
                            {totalClicks}
                        </h2>

                        <p className="text-xs text-gray-500 mt-2">
                            Across all links
                        </p>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                        <FaChartLine className="text-purple-400 text-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}