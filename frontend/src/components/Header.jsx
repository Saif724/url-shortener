import { FaSignOutAlt } from "react-icons/fa";

export default function Header({ onLogout }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          URL Dashboard
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Manage and track your shortened links
        </p>
      </div>

      {/* RIGHT SIDE */}
      <button
        onClick={onLogout}
        className="
          flex items-center justify-center gap-2 px-4 py-2
          rounded-xl
          bg-white/5 border border-white/10
          text-gray-300
          hover:bg-white/10 hover:text-white
          transition
          self-start sm:self-auto
        "
      >
        <FaSignOutAlt />
        Logout
      </button>

    </div>
  );
}