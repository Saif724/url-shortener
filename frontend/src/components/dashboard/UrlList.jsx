import UrlCard from "./UrlCard";
import SkeletonList from "./SkeletonList";

export default function UrlList({
  urls,
  loading,
  onCopy,
  onDelete,
  onQR,
  API_BASE,
}) {
  if (loading) return <SkeletonList />;

  if (!urls.length) {
    return (
      <div className="bg-white p-10 rounded-xl shadow text-center">
        <h2 className="text-lg font-semibold text-gray-700">
          No URLs yet
        </h2>
        <p className="text-gray-500 mt-2">
          Create your first link above 🚀
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {urls.map((u) => (
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