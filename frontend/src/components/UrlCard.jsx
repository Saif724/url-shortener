import {
  FaChartBar,
  FaEllipsisV,
  FaCopy,
  FaQrcode,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UrlCard({ u, onCopy, onDelete, onQR, API_BASE }) {
  const navigate = useNavigate();
  const shortUrl = `${API_BASE}/r/${u.id}`;
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div
      className="
        bg-white/5 border border-white/10 rounded-2xl p-6
        hover:bg-white/10 transition
        flex justify-between items-center gap-6
      "
    >

      {/* LEFT SIDE */}
      <div className="flex flex-col flex-1 space-y-2">

        {/* ORIGINAL URL */}
        <div>
          <p className="text-xs text-gray-400">Original URL</p>
          <a
            href={u.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-200 font-medium break-all hover:text-white"
          >
            {u.url}
          </a>
        </div>

        {/* SHORT URL */}
        <div>
          <p className="text-xs text-gray-400">Short URL</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-400 text-sm break-all hover:text-blue-300"
          >
            {shortUrl}
          </a>
        </div>

        {/* STATS */}
        <p className="text-xs text-gray-400">
          {Number(u.clicks) || 0} clicks
        </p>

      </div>

      {/* RIGHT SIDE (PROPERLY CENTERED) */}
      <div className="flex items-center gap-3 self-center">

        {/* ANALYTICS */}
        <button
          onClick={() => navigate(`/url/${u.id}`)}
          className="
            flex items-center gap-2
            bg-blue-500/20 text-blue-300
            hover:bg-blue-500/30
            px-4 py-2 rounded-xl text-sm
          "
        >
          <FaChartBar />
          Analytics
        </button>

        {/* MENU */}
        <div className="relative">

          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="
              w-10 h-10 flex items-center justify-center
              bg-white/10 hover:bg-white/20
              rounded-xl transition
            "
          >
            <FaEllipsisV />
          </button>

          {openMenu && (
            <div className="
              absolute right-0 mt-2 w-40
              bg-[#111827] border border-white/10
              rounded-xl shadow-lg z-50
              overflow-hidden
            ">

              <button
                onClick={() => {
                  onCopy(shortUrl);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10"
              >
                <FaCopy />
                Copy
              </button>

              <button
                onClick={() => {
                  onQR(shortUrl);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-white/10"
              >
                <FaQrcode />
                QR Code
              </button>

              <button
                onClick={() => {
                  onDelete(u.id);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <FaTrash />
                Delete
              </button>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}