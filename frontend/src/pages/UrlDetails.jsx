import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCopy, FaLink, FaChartLine } from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function UrlDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [urlData, setUrlData] = useState(null);

  const shortUrl = `${API_BASE}/r/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/urls`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
          ? data.data
          : [];

        const found = list.find((u) => String(u.id) === String(id));
        setUrlData(found);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load analytics");
      }
    };

    fetchData();
  }, [id]);

  const copy = async (text) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  if (!urlData) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition mb-6"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <div className="text-center text-[var(--muted)] mt-20">
            Loading analytics...
          </div>
        </div>
      </div>
    );
  }

  const clicks = Number(urlData.clicks) || 0;

  // REALISTIC STATUS (no fake insights)
  const status =
    clicks === 0
      ? "No activity"
      : clicks < 10
      ? "Starting"
      : clicks < 50
      ? "Growing"
      : "Performing well";

  const statusColor =
    clicks === 0
      ? "text-[var(--muted)]"
      : clicks < 10
      ? "text-yellow-400"
      : clicks < 50
      ? "text-blue-400"
      : "text-green-400";

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="space-y-3">
          <div className="text-xs text-[var(--muted)]">
            Dashboard / URL Details
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--text)] transition"
          >
            <FaArrowLeft />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-[var(--muted)] text-sm">Total Clicks</p>
            <h2 className="text-3xl font-bold mt-2">{clicks}</h2>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-[var(--muted)] text-sm">Status</p>
            <h2 className={`text-lg font-semibold mt-2 ${statusColor}`}>
              {status}
            </h2>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-center">
            <p className="text-[var(--muted)] text-sm">Analytics</p>
            <FaChartLine className="text-2xl mt-3 text-blue-400" />
            <p className="text-xs text-[var(--muted)] mt-2">
              Only total clicks are tracked
            </p>
          </div>

        </div>

        {/* NO FAKE CHART */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center">
          <FaChartLine className="text-3xl mx-auto mb-3 opacity-40" />
          <p className="text-[var(--text)] font-medium">
            Click analytics
          </p>
          <p className="text-sm text-[var(--muted)] mt-2">
            Detailed analytics (time, device, location) are not available yet.
          </p>
        </div>

        {/* URL INFO */}
        <div className="space-y-4">

          {/* ORIGINAL URL */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <p className="text-[var(--muted)] text-sm">Original URL</p>
              <button
                onClick={() => copy(urlData.url)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <FaCopy />
              </button>
            </div>
            <p className="break-words mt-2">{urlData.url}</p>
          </div>

          {/* SHORT URL */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <p className="text-[var(--muted)] text-sm">Short URL</p>
              <button
                onClick={() => copy(shortUrl)}
                className="text-[var(--muted)] hover:text-[var(--text)]"
              >
                <FaCopy />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <FaLink className="text-blue-400" />
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {shortUrl}
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}