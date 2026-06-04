import { FaSignOutAlt } from "react-icons/fa";

export default function Header({ onLogout }) {
  return (
    <div
      className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between
        gap-4 p-5 rounded-2xl

        bg-white/5 backdrop-blur-md border border-white/10
      "
    >
      {/* LEFT: TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          URL Dashboard
        </h1>

        <p className="text-sm text-gray-400">
          Manage and track your shortened links
        </p>
      </div>

      {/* RIGHT: BUTTON */}
      <button
        onClick={onLogout}
        className="
          flex items-center justify-center gap-2

          px-4 py-2 rounded-xl

          bg-red-500/20 border border-red-400/30
          text-red-300

          hover:bg-red-500/30 transition
          sm:ml-auto
        "
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}