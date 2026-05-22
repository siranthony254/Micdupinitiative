// src/components/home/WhyWeExist.tsx

export default function WhyWeExist() {
  const reasons = [
    {
      title: "To Amplify Meaningful Campus Voices",
      body: "Many students have ideas, experiences, and perspectives that remain unheard or misrepresented. MUI exists to create intentional platforms where authentic campus voices can be heard with clarity and depth.",
    },
    {
      title: "To Form Responsible Influence",
      body: "In an age of viral content and digital noise, MUI exists to help young people understand that influence carries responsibility - shaping thinkers, creators, and leaders who impact culture consciously.",
    },
    {
      title: "To Bridge Campus and Society",
      body: "MUI exists to connect students with mentors, professionals, institutions, and opportunities beyond the classroom - ensuring campuses do not remain isolated from the real world.",
    },
    {
      title: "To Challenge and Transform Campus Culture",
      body: "Campus culture shapes future society. MUI exists to confront unhealthy cultural patterns, encourage meaningful dialogue, and cultivate a generation marked by purpose, integrity, and intellectual depth.",
    },
  ];

  return (
    <section
      className="border-b border-white/10 text-white"
      style={{ backgroundColor: "#0D1F35" }}
    >
      <div className="mx-auto max-w-7xl px-6 py-7 text-center">
        <span className="text-xs font-semibold tracking-widest text-emerald-400 uppercase">
          Our Purpose
        </span>

        <h2 className="mt-4 text-3xl lg:text-4xl font-semibold max-w-3xl text-white mx-auto">
          Why Mic&apos;d Up Initiative Exists
        </h2>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div key={reason.title} className="text-left">
              <h3 className="text-base font-bold text-amber-500">
                {reason.title}
              </h3>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                {reason.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-base font-medium text-emerald-400">
          How campuses express themselves today shapes the society of tomorrow!
        </p>
      </div>
    </section>
  );
}
