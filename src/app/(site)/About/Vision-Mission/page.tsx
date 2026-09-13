"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const tools = [
  {
    title: "Content & Storytelling",
    tagline: "We mic what matters.",
    points: [
      "Podcasts and long-form conversations",
      "Documentaries and campus features",
      "Short-form storytelling",
      "The MUC Talks (TED-Style Campus Talks)",
    ],
    body: [
      "MUI amplifies meaningful student voices, ideas, talents, and conversations through intentional storytelling.",
      "We shape culture—by preserving ideas, elevating substance, and giving voice to perspectives that deserve longevity.",
    ],
  },
  {
    title: "Mentorship & Formation",
    tagline: "We shape people.",
    stage: "Early stage",
    points: ["Character and values", "Clarity of purpose", "Leadership and responsibility"],
    body: [
      "Platforms are only as strong as the people who carry them.",
      "Through a small, selective ambassador and mentorship cohort, MUI is beginning to form individuals capable of carrying vision, values, and responsibility across campuses and beyond.",
    ],
  },
  {
    title: "Insights",
    tagline: "We speak with credibility.",
    points: [
      "Content and storytelling direction",
      "Programs and mentorship frameworks",
      "Public conversations and forums",
    ],
    body: [
      "Influence without understanding is fragile.",
      "By grounding our work in evidence and lived experience, we ensure that our influence is trusted, relevant, and responsibly applied.",
    ],
  },
  {
    title: "Community & Events",
    tagline: "We connect campus to the world.",
    points: [
      "Contributors, not just audiences",
      "Thinkers, not just speakers",
      "Participants in shaping the future",
    ],
    body: [
      "Campus is not separate from society. It is one of its most generative spaces.",
      "Community is how ideas travel. Events are how connection becomes influence.",
    ],
  },
];

export default function VisionMissionPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-24 min-h-screen text-white" style={{backgroundColor: '#0D1F35'}}>

      {/* Page Header */}
      <motion.header
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-20"
      >
         <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
          Vision, Mission &amp; How We Work
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Vision, Mission &amp; How We Work
        </h1>
        <p className="mt-5 text-lg text-white/70 leading-relaxed">
          The philosophical foundation guiding the Mic’d Up Initiative — why we
          exist, what we pursue, and the intentional tools we use to shape
          people and culture rather than chase trends.
        </p>
        <p className="mt-4 text-base italic text-amber-300/90">
          This is the horizon MUI is listening its way toward — not a
          description of the institution as it stands this semester.
        </p>
      </motion.header>

      {/* Vision & Mission Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-12"
      >
        <Card
          title="Our Mission"
          subtitle="Why We Exist"
          body={[
            "To build a sustained movement that amplifies campus voices — spotlighting students, ideas, talents, policies, and conversations shaping campus life and youth culture — through transformative media, intentional mentorship, and purpose-driven experiences.",
            "We exist to raise a generation marked by excellence, integrity, and purposeful living — equipped to influence culture responsibly on campus and beyond.",
          ]}
        />

        <Card
          title="Our Vision"
          subtitle="Our North Star"
          body={[
            "Becoming a transformative movement that shapes the culture of campuses by amplifying voices, ideas, and issues that matter.",
            "We envision a renewed generation of young people formed into holistic excellence — intellectually grounded, creatively bold, morally anchored, and socially responsible — across campuses and into society.",
          ]}
        />
      </motion.div>

      {/* Core Values */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mt-28"
      >
         <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
          Core Values
        </span>
        <header className="max-w-3xl mb-14">
          <h2 className="text-3xl font-semibold text-amber-300">
            Core Values
          </h2>
          <p className="mt-4 text-white/70 leading-relaxed">
            These values shape our culture, inform our decisions,
            and define how we steward influence across campuses.
          </p>
        </header>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <Value title="Excellence" description="We pursue the highest standards academically, creatively, professionally, and personally — setting a benchmark for youth culture." />
          <Value title="Transformation" description="We commit to initiatives that produce measurable, lasting, and positive change in the lives of young people and their communities." />
          <Value title="Integrity" description="We uphold honesty, truthfulness, transparency, and responsibility in our content, relationships, and operations." />
          <Value title="Innovation" description="We embrace bold ideas, creative solutions, and new approaches to engage and empower youth effectively." />
          <Value title="Empowerment" description="We equip young people with the knowledge, skills, and mentorship they need to lead confidently and excel in life." />
        </motion.div>
      </motion.section>

      {/* How We Work — Tools of Influence */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="mt-28"
      >
        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[11px] tracking-widest uppercase text-emerald-400">
          How We Work
        </span>

        <header className="max-w-3xl mb-14">
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-white">
            MUI&rsquo;s Tools of Influence
          </h2>
          <div className="mt-5 space-y-3 text-lg leading-relaxed text-white/75">
            <p>Influence is not accidental. It is built.</p>
            <p>
              We do not rely on trends, virality, or noise. We work through
              intentional tools that shape people, culture, and institutions
              over time — the tools guide how we listen, speak, form, and connect.
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7
                         hover:border-amber-400/30 hover:bg-white/[0.07]
                         hover:shadow-xl hover:shadow-amber-400/10 transition"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-semibold text-amber-200">
                  {tool.title}
                </h3>
                {tool.stage && (
                  <span className="inline-flex items-center rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                    {tool.stage}
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm font-medium text-white/85">
                {tool.tagline}
              </p>

              <div className="mt-4 space-y-3 text-sm leading-relaxed text-white/70">
                {tool.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>

              <ul className="mt-4 space-y-1 text-sm text-white/70 list-disc pl-5">
                {tool.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>

              <div className="mt-5 h-[1px] w-0 bg-amber-400/60 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/[0.03] p-7"
        >
          <h3 className="text-xl font-semibold text-amber-200 mb-3">
            Influence With Intention
          </h3>
          <div className="space-y-3 text-white/75 leading-relaxed">
            <p>These tools do not operate in isolation. They reinforce one another.</p>
            <p>
              Content amplifies insight. Mentorship sustains culture. Research
              grounds credibility. Community extends reach.
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* Closing */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-24 max-w-4xl"
      >
        <p className="text-lg text-white/70 leading-relaxed">
          Mic’d Up Initiative is a living movement —
          cultivating voices, shaping culture, and forming leaders who
          understand that influence carries responsibility. This is how MUI
          builds influence that lasts.
        </p>
      </motion.div>
    </section>
  );
}

/* -----------------------------
   Card Component for Vision & Mission
------------------------------*/
function Card({ title, subtitle, body }: { title: string; subtitle: string; body: string[] }) {
  return (
    <motion.div
      className="p-8 rounded-2xl bg-white/5 border border-white/10 transition-transform hover:scale-105 hover:shadow-xl hover:shadow-amber-400/20"
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xs tracking-widest uppercase text-amber-400">{title}</span>
      <h2 className="mt-4 text-2xl font-semibold">{subtitle}</h2>
      <div className="mt-4 space-y-3 text-white/80 leading-relaxed">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </motion.div>
  );
}

/* -----------------------------
   Core Value Component
------------------------------*/
function Value({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      className="p-6 rounded-xl bg-white/5 border border-white/10 transition-colors hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-400/10 cursor-pointer"
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{
        scale: 1.03,
        borderColor: "rgb(34 197 94)", // green-500
        boxShadow: "0 0 0 1px rgba(34,197,94,0.35)",
      }}
    >
      <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      <p className="mt-3 text-sm text-white/70 leading-relaxed">{description}</p>
    </motion.div>
  );
}
