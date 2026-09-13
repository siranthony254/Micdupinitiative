// src/components/home/GetInvolved.tsx
import Link from "next/link";

const paths = [
  {
    title: "Ambassadors",
    description:
      "Help us listen to campus. Surface conversations, people, and questions that deserve attention.",
    href: "/Get-Involved/Ambassadors",
    cta: "Become an Ambassador",
  },
  {
    title: "Mentors & Advisors",
    description:
      "Bring perspective to the conversation. Help us examine ideas with experience, expertise, and wisdom.",
    href: "/Get-Involved/Mentors",
    cta: "Join as a Mentor",
  },
  {
    title: "Partners & Institutions",
    description:
      "Open the conversation. Help connect campus perspectives with wider society, research, and youth-led initiatives.",
    href: "/Get-Involved/Partnerships",
    cta: "Partner with Us",
  },
];

export default function GetInvolved() {
  return (
    <section className="border-b border-white/10" style={{backgroundColor: '#0D1F35'}}>
      <div className="mx-auto max-w-7xl px-6 py-12">

        {/* Intro */}
        <div className="mb-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white">
            Help Us Listen Better
          </h2>
          <p className="mt-4 text-lg text-white/70">
            MUI&rsquo;s listening only goes as far as the people who help carry it.
            Whether you&rsquo;re a student, professional, or institution, there&rsquo;s
            a way to help us hear more, and hear it well.
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
                p-8 flex flex-col justify-between
                transition
                hover:border-emerald-500 text-center
              "
              style={{backgroundColor: '#1A3A5C'}}
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
        <div className="mt-10 text-sm text-white/60 text-center">
          Not sure where you fit?{" "}
          <Link href="/contact" className="text-amber-500 underline underline-offset-4">
            Talk to us
          </Link>
        </div>

      </div>
    </section>
  );
}
