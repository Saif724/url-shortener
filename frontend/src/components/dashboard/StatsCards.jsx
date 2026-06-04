export default function StatsCards({urls}) {
    const totalClicks = urls.reduce(
        (sum, u) => sum + (Number(u.clicks) || 0),
        0
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Total URLs</p>
                <h2 className="text-4xl font-bold mt-2 text-white">{urls.length}</h2>
            </div>

             <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
                <p className="text-gray-400 text-sm">Total Clicks</p>
                <h2 className="text-4xl font-bold mt-2 text-white">{totalClicks}</h2>
            </div>
        </div>
    );
}