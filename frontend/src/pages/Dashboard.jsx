import { useState, useEffect, useCallback } from "react";
import {useNavigate} from "react-router-dom";
import {FaCopy, FaSignOutAlt} from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getToken = useCallback(() => localStorage.getItem("token"),[]);


  const fetchUrls = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/user/urls`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data.data)){
        setUrls(data.data);
      } else if (Array.isArray(data)){
        setUrls(data);
      } else {
        setUrls([]);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load URLs");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const shorten = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.ok) {
        setUrl("");
        await fetchUrls();
      } else {
          toast.error(data.message || "Failed to shorten");
      }
    } catch(err) {
      console.log(err);
      toast.error("Server error");
    }
  };

  const copyLink = async (shortUrl) => {
    await navigator.clipboard.writeText(shortUrl);
    toast.success("Link copied");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchUrls();

    const onFocus = () => fetchUrls();
    window.addEventListener("focus", onFocus);

    return () => window.removeEventListener("focus", onFocus);
  }, [fetchUrls]);

  const deleteUrl = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/user/urls/${id}`,{
        method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

      const data = await res.json();

      
      if (res.ok) {
        toast.success("URL deleted");
        await fetchUrls();
      } else {
        toast.error(data.message || "Delete failed");
      }
    }catch (err) {
      console.log(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 px-3 sm:px-6 py-4 sm:py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white p-4 sm:p-5 rounded-xl shadow-sm">
           <div>
            <h1 className="text-3xl font-bold text-gray-800">
              URL Dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Manage and track your shortened links
            </p>
           </div>

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-gray-500 text-sm">
              Total URLs
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {urls.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-gray-500 text-sm">
              Total Clicks
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {urls.reduce((sum, u) => sum + Number(u.clicks || 0), 0)}
            </h2>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl shadow flex flex-col sm:flex-row gap-3">
          <input 
            className="border rounded-lg p-3 flex-1 outline-none focus:ring-2 focus:ring-blue-400 w-full"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={shorten}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition w-full sm:w-auto"
          >
            Shorten
          </button>
        </div>


        {loading ?(
          <div className="space-y-3">
            {[1,2,3].map((item) => (
              <div
                key={item}
                className="bg-white p-4 rounded-xl shadow-sm"
              >
                <div className="animate-pulse">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                
              </div>
            ))}
          </div>
        ) : !Array.isArray(urls) ||  urls.length === 0 ? (
          <div className="bg-white p-10 rounded-xl shadow text-center">
            <h2 className="text-lg font-semibold text-gray-700">
              No URLs yet
            </h2>

            <p className="text-gray-500 mt-2">
              Create your first link above 🚀
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.isArray(urls) &&
              urls.map((u) => {
                const shortUrl = `${API_BASE}/r/${u.id}`;

                return (
                  <div
                    key={u.id}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                  >
                    <div className="flex flex-col max-w-full sm:max-w-[75%]">
                      <span className="text-sm text-gray-500">
                        Original URL
                      </span>

                      <a 
                        href={u.url}
                        target="_blank"
                        className="break-words text-gray-800 font-medium hover:text-blue-600"
                      >
                        {u.url}
                      </a>

                      <span className="text-sm text-gray-500 mt-2">
                        Short URL
                      </span>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          Clicks:
                        </span>

                        <span className="text-sm font-semibold text-gray-800">
                          {u.clicks || 0}
                        </span>
                      </div>

                      <a 
                        href={shortUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {shortUrl}
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => copyLink(shortUrl)}
                        className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition self-start sm:self-auto"
                      >
                        <FaCopy />
                      </button>
                      <button
                        onClick={() => deleteUrl(u.id)}
                        className="bg-red-100 text-red-600 p-3 rounded-lg hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>

                  </div>
                );
              })
            }
          </div>
        )}
      </div>
    </div>
  );
}