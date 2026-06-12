import { FaCopy,FaQrcode } from "react-icons/fa";

export default function UrlCard({ u, onCopy, onDelete, onQR, API_BASE }) {
  const shortUrl = `${API_BASE}/r/${u.id}`;

  return (
    <div
      className="
        bg-white/5 backdrop-blur-md border border-white/10
        rounded-2xl p-4 sm:p-5
        hover:scale-[1.01] hover:border-white/20 transition
        flex flex-col sm:flex-row justify-between gap-4
      "
    >
      {/* LEFT SIDE CONTENT */}
      <div className="flex flex-col gap-1 flex-1">
        <span className="text-sm text-gray-400">Original URL</span>

        <a
          href={u.url}
          target="_blank"
          rel="noreferrer"
          className="text-gray-200 font-medium break-words hover:text-gray-100"
        >
          {u.url}
        </a>

        <span className="text-sm text-gray-400 mt-2">Short URL</span>

        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:text-blue-300 underline break-all"
        >
          {shortUrl}
        </a>

        {/* Clicks */}
        <div className="text-sm text-gray-300 mt-2">
          <span className="text-gray-400">Clicks:</span>{" "}
          <span className="font-semibold text-white">
            {Number(u.clicks) || 0}
          </span>
        </div>
      </div>

      {/* RIGHT SIDE ACTIONS */}
      <div className="flex gap-2 sm:ml-auto items-start sm:items-center">
        {/* COPY */}
        <button
          onClick={() => onCopy(shortUrl)}
          title="Copy"
          className="
            bg-white/10 hover:bg-white/20
            text-white p-3 rounded-xl transition
          "
        >
          <FaCopy />
        </button>

        <button
          onClick={()=> onQR(shortUrl)}
          title="Generate QR Code"
          className="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition text-white"
        >
          <FaQrcode/>
        </button>

        {/* DELETE */}
        <button
          onClick={() => onDelete(u.id)}
          className="
            bg-red-500/20 text-red-300
            hover:bg-red-500/30
            p-3 rounded-xl transition
          "
        >
          Delete
        </button>
      </div>
    </div>
  );
}