// src/components/home/GetInvolved.tsx
import Link from "next/link";

const paths = [
  {
    title: "Ambassadors",
    description:
      "Represent Mic’d Up Initiative within your campus, listen the campus and help surface voices that deserve to be heard.",
    href: "/Get-Involved/Ambassadors",
    cta: "Become an Ambassador",
  },
  {
    title: "Mentors & Advisors",
    description:
      "Support the youth, mentor and shape emerging leaders through guidance, expertise, and ethical leadership—shaping the next generation.",
    href: "/Get-Involved/Mentors",
    cta: "Join as a Mentor",
  },
  {
    title: "Partners & Institutions",
    description:
      "Collaborate with us to support campus dialogue, research, and youth-led initiatives at scale.",
    href: "/Get-Involved/Partnerships",
    cta: "Partner with Us",
  },
];

export default function GetInvolved() {
  return (
    <section className="bg-neutral-950 border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-20">

        {/* Intro */}
        <div className="mb-14 max-w-3xl">
          <h2 className="text-3xl font-bold text-white">
            Get Involved
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Mic’d Up Initiative thrives through collaboration. Whether you’re
            a student, professional, or institution, there’s a meaningful way
            to contribute to shaping campus culture, youth leadership and influence.
          </p>
        </div>

        {/* Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {paths.map((path) => (
            <Link
              key={path.title}
              href={path.href}
              className="
                group rounded-2xl
                border border-white/10
                bg-neutral-900
                p-8 flex flex-col justify-between
                transition
                hover:border-emerald-500 hover:bg-neutral-900/80
              "
            >
              <div>
                <h3 className="text-xl font-semibold text-white group-hover:text-emerald-400 transition">
                  {path.title}
                </h3>

                <p className="mt-3 text-white/70 leading-relaxed">
                  {path.description}
                </p>
              </div>

              <span className="mt-8 inline-block text-sm font-medium text-amber-500 underline underline-offset-4">
                {path.cta}
              </span>
            </Link>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="mt-16 text-sm text-white/60">
          Not sure where you fit?{" "}
          <Link href="/contact" className="text-amber-500 underline underline-offset-4">
            Talk to us
          </Link>
        </div>

      </div>
    </section>
  );
}
