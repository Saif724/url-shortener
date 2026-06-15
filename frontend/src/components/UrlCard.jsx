import {
  FaChartBar,
  FaCopy,
  FaQrcode,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UrlCard({ u, onCopy, onDelete, onQR, API_BASE, copied }) {
  const navigate = useNavigate();
  const shortUrl = `${API_BASE}/r/${u.id}`;




  return (
    <div
      className="
        bg-[var(--card)] border border-[var(--border)]
        rounded-2xl p-4 sm:p-5
        hover:bg-[var(--hover)] hover:scale-[1.01]
        transition-all duration-200
        flex flex-col gap-4
      "
    >

      {/* URLs */}
      <div className="space-y-2">
        <div>
          <p className="text-xs text-[var(--muted)]">Original</p>
          <a
            href={u.url}
            target="_blank"
            rel="noreferrer"
            title={u.url}
            className="
              text-sm text-[var(--text)] hover:opacity-80
              break-words line-clamp-2
            "
          >
            {u.url}
          </a>
        </div>

        <div>
          <p className="text-xs text-[var(--muted)]">Short</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            title={shortUrl}
            className="block truncate text-[var(--accent)] hover:text-blue-300 text-sm"
          >
            {shortUrl}
          </a>
        </div>
      </div>


      {/* stats + analytics (IMPORTANT ACTION) */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--muted)]">
          {Number(u.clicks) || 0} clicks
        </span>

        <button
          onClick={() => navigate(`/url/${u.id}`)}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-[var(--card)] border border-[var(--border)]
            text-[var(--accent)]
            hover:bg-blue-500/10
            font-medium text-sm
            transition
          "
        >
          <FaChartBar />
          Analytics
        </button>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-2">

        <button
          onClick={() => onCopy(shortUrl, u.id)}
          className={`
            px-3 py-2 rounded-lg text-sm
            flex items-center gap-2
            transition

            ${copied
              ? "bg-green-500/20 text-[var(--text)]"
              : "bg-[var(--bg)] hover:bg-[var(--hover)]"}
          `}
        >
          <FaCopy />
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          onClick={() => onQR(shortUrl)}
          className="
            px-3 py-2 rounded-lg text-sm
            bg-[var(--bg)] hover:bg-[var(--hover)]
            transition flex items-center gap-2
          "
        >
          <FaQrcode />
          QR
        </button>

        <button
          onClick={() => onDelete(u.id)}
          className="
            px-3 py-2 rounded-lg text-sm
            bg-red-500/10 text-red-400
            hover:bg-red-500/20
            transition flex items-center gap-2
          "
        >
          <FaTrash />
          Delete
        </button>

      </div>
    </div>
  );
}