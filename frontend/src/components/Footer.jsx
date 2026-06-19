export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* LEFT */}
        <div className="text-center sm:text-left">
          <h2 className="text-sm font-semibold text-[var(--text)]">
            URL Shortener
          </h2>
          <p className="text-xs text-[var(--muted)] mt-1">
            Simple, fast link management with click tracking.
          </p>
        </div>

        {/* CENTER */}
        <div className="text-xs text-[var(--muted)]">
          Built for learning & production use
        </div>

        {/* RIGHT */}
        <div className="text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} All rights reserved
        </div>

      </div>
    </footer>
  );
}