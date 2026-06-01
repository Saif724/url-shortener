import { useState, useEffect } from "react";
import API_BASE from "../api/api";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);

  const token = localStorage.getItem("token");

  const fetchUrls = async () => {
    const res = await fetch(`${API_BASE}/user/urls`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log(data);
    setUrls(data.data ?? data ?? []);
  };

  const shorten = async () => {
    const res = await fetch(`${API_BASE}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (res.ok) {
      setUrl("");
      await fetchUrls();
    } else {
        alert(data.message || "Failed to shorten");
    }
  };

  useEffect(() => {
  fetchUrls();
}, [token]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={shorten}
          className="bg-blue-500 text-white px-4"
        >
          Shorten
        </button>
      </div>

      <div className="space-y-2">
        {urls.map((u) => (
          <div
            key={u.id}
            className="bg-white p-3 rounded shadow flex justify-between"
          >
            <div className="flex flex-col">
                <span>
                    Original: {u.url}
                </span>

                <a 
                    href={`${API_BASE}/r/${u.id}`}
                    target="_blank"
                    className="text-blue-600 underline"
                >
                    Short: {API_BASE}/r/{u.id}
                </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}