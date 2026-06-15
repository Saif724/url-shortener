import { useState, useEffect, useCallback } from "react";
import {useNavigate} from "react-router-dom";
import API_BASE from "../api/api";
import toast from "react-hot-toast";
import StatsCards from "../components/StatsCards";
import UrlInput from "../components/UrlInput";
import Header from "../components/Header";
import UrlList from "../components/UrlList";
import DeleteModal from "../components/DeleteModal";
import QRModal from "../components/QRModal";
import SearchBar from "../components/SearchBar";

export default function Dashboard({theme, setTheme}) {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [copiedId, setCopiedId] = useState(null);

  const navigate = useNavigate();

  const getToken = useCallback(() => localStorage.getItem("token"),[]);

  const openQR = (shortUrl) => {
    setQrValue(shortUrl);
    setShowQR(true);
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  }

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
      toast.error("Please enter a URL", {
        id: "empty-url"
      });
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
          toast.error(data.error || "Failed to shorten", {
            id: data.error || "failed-to-shorten", 
          });
      }
    } catch(err) {
      console.log(err);
      toast.error("Server error", {
        id: "server-error",
      });
    }
  };

  const copyLink = async (shortUrl, id) => {
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);

    setTimeout(() => setCopiedId(null), 1200);
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
        toast.error(data.error || "Delete failed",{
          id: data.error || "delete-failed",
        });
      }
    }catch (err) {
      console.log(err);
      toast.error("Server error", {
        id: "server-error",
      });
    }
  };

    
  const confirmDelete = async () => {
    if (!selectedId) return;

    await deleteUrl(selectedId);

    setSelectedId(null);
    setShowDeleteModal(false);
  };

  const filteredUrls = urls.filter((u)=>
    u.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] text-[var(--text)] px-4 py-8">
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-500 opacity-30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-blue-500 opacity-30 blur-[120px] rounded-full"></div>
      <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
        <Header onLogout={logout} theme={theme} setTheme={setTheme} />

        <div className="h-px bg-white/10 my-4"/>
        
        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider">
            Overview
          </p>
          <StatsCards urls={urls} />
        </div>

        <div className="space-y-4">
          <p className="text-xs text-[var(--muted)] uppercase tracking-wider">
            Create & Search
          </p>
          <UrlInput onShorten={shorten} />

          <SearchBar
            search={search}
            setSearch={setSearch}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">

            <p className="text-xs text-[var(--muted)] uppercase tracking-wider">
              Your Links
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`
                  px-3 py-1.5 rounded-lg text-xs border transition font-medium

                  ${
                    viewMode === "list"
                      ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                      : "bg-[var(--card)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--hover)]"
                  }
                `}
              >
                List
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`
                  px-3 py-1.5 rounded-lg text-xs border transition font-medium

                  ${
                    viewMode === "grid"
                      ? "bg-blue-500/20 text-blue-300 border-blue-400/30"
                      : "bg-[var(--card)] text-[var(--muted)] border-[var(--border)] hover:text-[var(--text)] hover:bg-[var(--hover)]"
                  }
                `}
              >
                Grid
              </button>
            </div>

          </div>
          <UrlList
            urls={urls}
            filteredUrls={filteredUrls}
            loading={loading}
            onCopy={copyLink}
            copiedId={copiedId}
            onDelete={openDeleteModal}
            onQR={openQR}
            API_BASE={API_BASE}
            viewMode={viewMode}
          />
        </div>

        <DeleteModal
          show={showDeleteModal}
          onClose={()=>{
            setShowDeleteModal(false);
            setSelectedId(null);
          }}
          onConfirm={confirmDelete}
        />

        <QRModal
          show={showQR}
          value={qrValue}
          onClose={()=>setShowQR(false)}
        />

      </div>
    </div>
  );
}