import { FaSignOutAlt,FaMoon, FaSun } from "react-icons/fa";

export default function Header({ onLogout, theme, setTheme }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4  p-5">

      {/* LEFT SIDE */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
          URL Dashboard
        </h1>

        <p className="text-sm text-[var(--muted)] mt-1">
          Manage and track your shortened links
        </p>
      </div>

      <div className="flex items-center gap-3">

        {/* THEME TOGGLE */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="
            p-2 rounded-xl
            bg-[var(--card)]
            border border-[var(--border)]
            hover:scale-105 transition
          "
        >
          {theme === "dark" ? (
            <FaMoon className="text-blue-300" />
          ) : (
            <FaSun className="text-yellow-500" />
          )}
        </button>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="
            flex items-center gap-2
            px-4 py-2 rounded-xl
            bg-[var(--card)]
            border border-[var(--border)]
            text-[var(--text)]
            hover:opacity-80 transition
          "
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </div>
  );
}