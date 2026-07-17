export default function DashboardPreview() {
  return (
    <section className="max-w-6xl mx-auto px-4 pb-24">

      <div
        className="
          rounded-3xl
          border border-[var(--border)]
          bg-[var(--card)]
          overflow-hidden
          shadow-2xl
        "
      >

        {/* Browser Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--border)]">

          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />

          <div className="ml-4 text-xs text-[var(--muted)]">
            shorty-lyart.vercel.app/dashboard
          </div>

        </div>

        {/* Preview */}
        <div className="aspect-video flex items-center justify-center">

          {/* Replace this later with an image */}
          <div className="text-center">

            <h3 className="text-2xl font-semibold">
              Dashboard Preview
            </h3>

            <p className="mt-3 text-[var(--muted)]">
              Replace this area with a screenshot of your dashboard.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}