import {
  FaBolt,
  FaChartLine,
  FaShieldAlt,
  FaQrcode,
  FaFolderOpen,
  FaCode,
} from "react-icons/fa";

const features = [
  {
    icon: FaBolt,
    title: "Fast Redirects",
    description:
      "Lightning-fast redirects powered by Redis caching for improved performance.",
  },
  {
    icon: FaChartLine,
    title: "Link Analytics",
    description:
      "Track every click and monitor the performance of your shortened URLs.",
  },
  {
    icon: FaShieldAlt,
    title: "Secure Authentication",
    description:
      "JWT-based authentication keeps your dashboard and links protected.",
  },
  {
    icon: FaQrcode,
    title: "QR Code Generation",
    description:
      "Generate QR codes instantly for every shortened URL.",
  },
  {
    icon: FaFolderOpen,
    title: "Link Management",
    description:
      "Search, sort, delete and organize links from one clean dashboard.",
  },
  {
    icon: FaCode,
    title: "Modern Tech Stack",
    description:
      "Built with Go, React, PostgreSQL, Redis and Docker using layered architecture.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="max-w-6xl mx-auto px-4 py-24"
    >
      {/* Header */}

      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">
          Everything You Need
        </h2>

        <p className="mt-4 max-w-2xl mx-auto text-[var(--muted)] leading-7">
          Powerful features designed to make URL management simple,
          secure and lightning fast.
        </p>
      </div>

      {/* Cards */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {features.map((feature) => {

          const Icon = feature.icon;

          return (

            <div
              key={feature.title}
              className="
                group
                rounded-2xl
                border
                border-[var(--border)]
                bg-[var(--card)]
                p-7
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-[var(--accent)]
                hover:shadow-xl
              "
            >

              {/* Icon */}

              <div
                className="
                  w-14
                  h-14
                  rounded-xl
                  bg-[var(--accent-soft)]
                  border
                  border-[var(--border)]
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                  group-hover:bg-[var(--accent)]
                  group-hover:border-[var(--accent)]
                "
              >
                <Icon
                  className="
                    text-2xl
                    text-[var(--accent)]
                    transition-colors
                    duration-300
                    group-hover:text-white
                  "
                />
              </div>

              {/* Title */}

              <h3 className="mt-6 text-xl font-semibold">
                {feature.title}
              </h3>

              {/* Description */}

              <p className="mt-3 leading-7 text-[var(--muted)]">
                {feature.description}
              </p>

            </div>

          );

        })}

      </div>

    </section>
  );
}