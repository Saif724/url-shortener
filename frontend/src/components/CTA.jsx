import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-24">

      <div
        className="
          rounded-3xl
          border border-[var(--border)]
          bg-[var(--card)]
          p-10 md:p-16
          text-center
        "
      >
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to simplify your links?
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-[var(--muted)] leading-7">
          Join Shorty to create short URLs, organize your links,
          monitor clicks, and manage everything from a single dashboard.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            to="/register"
            className="
              inline-flex items-center gap-2
              px-6 py-3
              rounded-xl
              bg-[var(--accent)]
              text-white
              font-medium
              hover:opacity-90
              transition
            "
          >
            Get Started
            <FaArrowRight />
          </Link>

          <Link
            to="/login"
            className="
              inline-flex items-center
              px-6 py-3
              rounded-xl
              border border-[var(--border)]
              hover:bg-[var(--hover)]
              transition
            "
          >
            Login
          </Link>

        </div>

      </div>

    </section>
  );
}