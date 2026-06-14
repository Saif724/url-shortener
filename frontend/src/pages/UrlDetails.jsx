import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCopy, FaLink, FaChartLine } from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

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
      <div className="min-h-screen bg-[#0b1220] text-white p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-6"
          >
            <FaArrowLeft />
            <span>Back</span>
          </button>

          <div className="text-center text-gray-400 mt-20">
            Loading / Not found
          </div>
        </div>
      </div>
    );
  }

  const clicks = Number(urlData.clicks) || 0;

  const chartData = Array.from({ length: Math.min(clicks, 10) }, (_, i) => ({
    name: `T${i + 1}`,
    clicks: i + 1,
    }));

  const status =
    clicks === 0
      ? "No activity"
      : clicks < 10
      ? "Early traction"
      : clicks < 50
      ? "Growing"
      : "Viral";

  const statusColor =
    clicks === 0
      ? "text-gray-400"
      : clicks < 10
      ? "text-yellow-400"
      : clicks < 50
      ? "text-blue-400"
      : "text-green-400";

  return (
    <div className="min-h-screen bg-[#0b1220] text-white px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="space-y-3">
          <div className="text-xs text-gray-500">
            Dashboard / URL Details
          </div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm">Back</span>
          </button>
        </div>

        {/* ANALYTICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Clicks</p>
            <h2 className="text-3xl font-bold mt-2">{clicks}</h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Status</p>
            <h2 className={`text-lg font-semibold mt-2 ${statusColor}`}>
              {status}
            </h2>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm">Analytics</p>
            <FaChartLine className="text-2xl mt-3 text-blue-400" />
          </div>

        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-gray-400 text-sm mb-4">Click Trend</p>

            {clicks === 0 ? (
                <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
                <div className="w-full h-[260px] min-h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke="#60A5FA"
                        strokeWidth={2}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            )}
        </div>

        {/* URL INFO */}
        <div className="space-y-4">

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Original URL</p>
              <button
                onClick={() => copy(urlData.url)}
                className="text-gray-400 hover:text-white"
              >
                <FaCopy />
              </button>
            </div>
            <p className="break-words mt-2">{urlData.url}</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-sm">Short URL</p>
              <button
                onClick={() => copy(shortUrl)}
                className="text-gray-400 hover:text-white"
              >
                <FaCopy />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <FaLink className="text-blue-400" />
              <a
                href={shortUrl}
                target="_blank"
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