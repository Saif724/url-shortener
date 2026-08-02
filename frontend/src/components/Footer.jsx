import { Link } from "react-router-dom";
import { FaCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-24">

      <div className="max-w-6xl mx-auto px-4 py-14">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}

          <div>

            <div className="flex items-center gap-3">

              <img
                src="/logo.png"
                alt="Shorty"
                className="w-9 h-9"
              />

              <h3 className="text-2xl font-bold">
                Shorty
              </h3>

            </div>

            <p className="mt-4 text-[var(--muted)] leading-7">
              A modern URL shortener built with Go, React,
              PostgreSQL and Redis.
            </p>

          </div>

          {/* Navigation */}

          <div>

            <h4 className="font-semibold mb-4">
              Navigation
            </h4>

            <div className="space-y-3">

              <a href="#home" className="block hover:text-[var(--accent)] transition">
                Home
              </a>

              <a href="#features" className="block hover:text-[var(--accent)] transition">
                Features
              </a>

              <a href="#how-it-works" className="block hover:text-[var(--accent)] transition">
                How it Works
              </a>

            </div>

          </div>

          {/* Account */}

          <div>

            <h4 className="font-semibold mb-4">
              Account
            </h4>

            <div className="space-y-3">

              <Link
                to="/login"
                className="block hover:text-[var(--accent)] transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="block hover:text-[var(--accent)] transition"
              >
                Create Account
              </Link>

            </div>

          </div>

          {/* Resources */}

          <div>

            <h4 className="font-semibold mb-4">
              Resources
            </h4>

            <div className="space-y-3">

              <a
                href="https://shorty-offu.onrender.com/docs"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-[var(--accent)] transition"
              >
                API Documentation
              </a>

              <a
                href="https://github.com/Saif724/url-shortener"
                target="_blank"
                rel="noreferrer"
                className="block hover:text-[var(--accent)] transition"
              >
                GitHub Repository
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div
          className="
            mt-12
            pt-8
            border-t
            border-[var(--border)]
            flex
            flex-col
            items-center
            gap-3
            text-center
          "
        >
          <p className="text-sm text-[var(--muted)]">
            Built with Go, React, PostgreSQL, Redis and Docker.
          </p>

          <p className="flex items-center justify-center gap-2 text-sm text-[var(--muted)]">
            <FaCopyright className="text-xs" />
            <span>2026 Shorty. Designed & Developed by Ahsan Ahmed Saif.</span>
          </p>

        </div>

      </div>

    </footer>
  );
}