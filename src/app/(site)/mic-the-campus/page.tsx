import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export default function MicTheCampusPage() {
  return (
    <PageShell
      title="Mic the Campus"
      subtitle="Enable student voices. Fund dialogue. Equip ideas to travel further."
    >
      {/* Intro */}
      <section className="max-w-3xl mb-16">
        <p className="text-white/80 text-lg leading-relaxed">
          Mic’d Up Initiative exists to amplify student voices across African campuses.
          This requires more than ideas — it requires tools, platforms, and sustained support.
        </p>
      </section>

      {/* Contribution Modes */}
      <section className="grid gap-6 md:grid-cols-2 mb-20">
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
      <section className="max-w-3xl mb-20">
        <h2 className="text-2xl font-semibold text-amber-300 mb-4">
          What Your Contribution Enables
        </h2>
        <ul className="space-y-3 text-white/70 pl-4 list-disc">
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
          className="px-6 py-3 rounded-full bg-amber-400 text-black font-medium hover:bg-amber-300 transition"
        >
          Start a Conversation
        </Link>

        <Link
          href="/Get-Involved/Partnerships"
          className="px-6 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
        >
          Explore Partnerships
        </Link>
      </section>
    </PageShell>
  );
}

/* -----------------------------
   Local Component
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
      href="/Get-Involved/Partnerships"
      className="block rounded-2xl border border-white/10 bg-white/5 p-6
                 hover:border-amber-400 hover:bg-white/10 transition"
    >
      <h3 className="text-lg font-semibold text-amber-200 mb-2">{title}</h3>
      <p className="text-white/75 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}
