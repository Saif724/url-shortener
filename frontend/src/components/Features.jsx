import {
  FaLink,
  FaChartLine,
  FaQrcode,
  FaShieldAlt,
} from "react-icons/fa";

const features = [
  {
    icon: FaLink,
    title: "Instant Short Links",
    description:
      "Create short, shareable URLs in seconds with a clean and intuitive interface.",
  },
  {
    icon: FaChartLine,
    title: "Click Analytics",
    description:
      "Track total clicks and monitor the performance of every shortened link.",
  },
  {
    icon: FaQrcode,
    title: "QR Code Support",
    description:
      "Generate QR codes instantly for quick sharing across devices and platforms.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Dashboard",
    description:
      "Manage your links securely with authentication and an organized dashboard.",
  },
];

export default function Features() {
  return (
    <section id="features" className="max-w-6xl mx-auto px-4 pb-24">

      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold">
          Everything you need
        </h2>

        <p className="mt-4 text-[var(--muted)] max-w-2xl mx-auto">
          A modern URL shortener with analytics, QR generation,
          and a beautiful dashboard for managing your links.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="
                rounded-2xl
                border border-[var(--border)]
                bg-[var(--card)]
                p-6
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[var(--accent)]
                hover:shadow-xl
              "
            >
              <div
                className="
                  w-12 h-12
                  rounded-xl
                  bg-[var(--hover)]
                  flex items-center justify-center
                  text-[var(--accent)]
                  text-xl
                "
              >
                <Icon />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {feature.description}
              </p>
            </div>
          );
        })}

      </div>

    </section>
  );
}