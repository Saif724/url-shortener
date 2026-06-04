import { useState } from "react";

export default function UrlInput( {onShorten }){
    const [url, setUrl] = useState("");

    const handleSubmit = async () => {
        await onShorten(url);
        setUrl("");
    };

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10
        p-4 rounded-2xl flex flex-col sm:flex-row gap-3">
            <input
                className="flex-1 bg-transparent border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-gray-400 focus:border-blue-400"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-xl font-medium
                bg-gradient-to-r from-blue-500 to-purple-500
                hover:opacity-90 transition shadow-lg text-white"
            >
                Shorten
            </button>
        </div>
    );
}