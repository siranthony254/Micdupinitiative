import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function MicTheCampusPage() {
  return (
    <PageShell
      title="Mic the Campus"
      subtitle="Enable student voices. Fund dialogue. Equip ideas to travel further."
    >
      {/* Intro */}
      <section className="max-w-3xl mb-14">
        <p className="text-lg text-white/80 leading-relaxed">
          Mic’d Up Initiative exists to amplify student voices across African
          campuses. This requires more than ideas — it requires tools,
          platforms, and sustained support.
        </p>
      </section>

      {/* Contribution Modes */}
      <section className="grid gap-6 sm:grid-cols-2 mb-16">
        <ContributionCard
          title="Fund the Voice"
          description="Support student-led conversations, research, and public dialogue through direct financial contributions."
          href="/get-involved/funding"
        />

        <ContributionCard
          title="Equip the Voice"
          description="Contribute cameras, microphones, recording equipment, or production resources."
          href="/get-involved/equipment"
        />

        <ContributionCard
          title="Sponsor the Platform"
          description="Sponsor campus podcasts, stage talks, mentorship tours, or research initiatives."
          href="/get-involved/sponsorships"
        />

        <ContributionCard
          title="Endorse the Vision"
          description="Partner institutionally, endorse the initiative, or align your organization with the mission."
          href="/get-involved/partnerships"
        />
      </section>

      {/* Impact */}
      <section className="max-w-3xl mb-16">
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-5">
          What Your Contribution Enables
        </h2>

        <ul className="space-y-3 text-white/70 text-sm md:text-base list-disc pl-5">
          <li>Campus-based podcasts and talk series</li>
          <li>Student research and policy conversations</li>
          <li>Mentorship and leadership formation tours</li>
          <li>Documentation of campus culture and innovation</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="flex flex-wrap gap-4">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full
                     bg-amber-400 px-7 py-3 text-sm font-semibold text-black
                     hover:bg-amber-300 active:scale-[0.98]
                     transition shadow-lg shadow-amber-400/20"
        >
          Start a Conversation
        </Link>

        <Link
          href="/get-involved/partnerships"
          className="inline-flex items-center justify-center rounded-full
                     border border-white/20 px-7 py-3 text-sm font-semibold text-white
                     hover:bg-white/5 hover:border-white/40
                     active:scale-[0.98]
                     transition"
        >
          Explore Partnerships
        </Link>
      </section>
    </PageShell>
  );
}

/* -----------------------------
   Contribution Card (Premium)
------------------------------*/
function ContributionCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group relative block rounded-2xl border border-white/10
                 bg-gradient-to-br from-white/5 to-white/[0.02]
                 p-7 shadow-sm hover:shadow-xl
                 hover:border-amber-400/50
                 transition-all duration-300"
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-300 transition">
        {title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-white/70">
        {description}
      </p>

      {/* Subtle Arrow */}
      <span className="mt-5 inline-flex text-sm font-medium text-amber-300 opacity-0 group-hover:opacity-100 transition">
        Learn more →
      </span>
    </Link>
  );
}
