export default function SkeletonList() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className="bg-white p-4 rounded-xl shadow-sm animate-pulse"
                >
                    <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            ))}
        </div>
    );
}