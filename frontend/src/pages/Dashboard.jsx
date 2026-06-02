import { useState, useEffect } from "react";
import {useNavigate} from "react-router-dom";
import {FaCopy, FaSignOutAlt} from "react-icons/fa";
import API_BASE from "../api/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");


  const fetchUrls = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/user/urls`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();

      console.log("GET URLS RESPONSE:", data);
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
  };

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
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            URL Dashboard
          </h1>

          <button
            onClick={logout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-4 rounded"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6 flex gap-2">
          <input 
            className="border p-3 flex-1 rounded"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            onClick={shorten}
            className="bg-blue-500 text-white px-5 rounded"
          >
            Shorten
          </button>
        </div>

        {loading ?(
          <p>Loading</p>
        ) : !Array.isArray(urls) ||  urls.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500">
            No URLs created yet
          </div>
        ) : (
          <div>
            {Array.isArray(urls) &&
              urls.map((u) => {
                const shortUrl = `${API_BASE}/r/${u.id}`;
                
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
                  <div
                    key={u.id}
                    className="bg-white p-4 rounded shadow flex justify-between items-center"
                  >
                    <div className="flex flex-col max-w-[75%]">
                      <span className="text-sm text-gray-500">
                        Original URL
                      </span>

                      <a 
                        href={u.url}
                        target="_blank"
                        className="truncate text-black"
                      >
                        {u.url}
                      </a>

                      <span className="text-sm text-gray-500 mt-2">
                        Short URL
                      </span>

                      <a 
                        href={shortUrl}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {shortUrl}
                      </a>
                    </div>

                    <button
                      onClick={() => copyLink(shortUrl)}
                      className="bg-gray-200 p-3 rounded hover:bg-gray-300"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={() => deleteUrl(u.id)}
                      className="bg-red-200 p-3 rounded hover:bg-red-300"
                    >
                      Delete
                    </button>
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