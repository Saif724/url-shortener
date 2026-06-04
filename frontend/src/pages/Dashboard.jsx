import { useState, useEffect, useCallback } from "react";
import {useNavigate} from "react-router-dom";
import API_BASE from "../api/api";
import toast from "react-hot-toast";
import StatsCards from "../components/dashboard/StatsCards";
import UrlInput from "../components/dashboard/UrlInput";
import Header from "../components/dashboard/Header";
import UrlList from "../components/dashboard/UrlList";

export default function Dashboard() {
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

  const shorten = async (url) => {
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
        toast.success("Shortened!");
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
    <div className="min-h-screen relative overflow-hidden bg-[#0b1220] text-white px-4 py-6">
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-500 opacity-30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500 opacity-30 blur-[120px] rounded-full"></div>
      <div className="max-w-5xl mx-auto space-y-6">
        <Header onLogout={logout} />
        
        <StatsCards urls={urls} />

        <UrlInput onShorten={shorten} />

        <UrlList
          urls={urls}
          loading={loading}
          onCopy={copyLink}
          onDelete={deleteUrl}
          API_BASE={API_BASE}
        />

      </div>
    </div>
  );
}