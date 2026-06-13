import { FaSearch } from "react-icons/fa";

export default function SearchBar({search, setSearch}){
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl">
            <div className="flex items-center gap-3">
                <FaSearch className="text-gray-400 text-lg" />
                <input
                    type="text"
                    placeholder="Search your URLs..."
                    value={search}
                    onChange={(e)=> setSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-white placeholder-gray-500"
                />
            </div>
        </div>
    );
}