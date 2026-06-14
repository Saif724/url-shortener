import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({search, setSearch}){
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-3 rounded-2xl transition-all duration-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/20">
            <div className="group flex items-center gap-3">
                <FaSearch className="text-gray-400 group-focus-within:text-blue-400 transition" />
                <input
                    type="text"
                    placeholder="Search links..."
                    value={search}
                    onChange={(e)=> setSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                />
                {search && (
                    <button
                        onClick={()=>setSearch("")}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition"
                    >
                        <FaTimes />
                    </button>
                )}
            </div>
        </div>
    );
}