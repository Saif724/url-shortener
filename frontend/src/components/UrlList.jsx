import UrlCard from "./UrlCard";
import SkeletonList from "./SkeletonList";
import { FaSearchMinus, FaLink } from "react-icons/fa";

export default function UrlList({
  urls,
  filteredUrls,
  loading,
  onCopy,
  onDelete,
  onQR,
  API_BASE,
}) {
  if (loading) return <SkeletonList />;

  if (!urls.length) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center">
        <FaLink className="mx-auto text-5xl text-blue-400 mb-4" />
        <h2 className="text-2xl font-bold text-white">
          No URLs yet
        </h2>
        <p className="text-gray-400 mt-2">
          Create your first shortened link
        </p>
      </div>
    );
  }

  if(urls.length>0 && filteredUrls.length===0){
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center">
        <FaSearchMinus className="mx-auto text-5xl text-gray-500 mb-4" />

        <h2 className="text-2xl font-bold text-white">
          No matching URLs
        </h2>

        <p className="text-gray-400 mt-2">
          Try searching with another keyword
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredUrls.map((u) => (
        <UrlCard
          key={u.id}
          u={u}
          onCopy={onCopy}
          onDelete={onDelete}
          onQR={onQR}
          API_BASE={API_BASE}
        />
      ))}
    </div>
  );
}