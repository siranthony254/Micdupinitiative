// src/components/home/WhyWeExist.tsx

export default function WhyWeExist() {
  const reasons = [
    {
      title: "We Listen To Understand Campus",
      body: "Students have experiences, ideas, and perspectives that can easily remain unheard or misunderstood. We create intentional spaces where authentic campus voices can be heard with clarity and depth.",
    },
    {
      title: "We Listen Because Influence Needs Responsibility",
      body: "People are already shaping one another through conversations, content, and culture — often without realising it. We listen so that influence can be exercised consciously, not carelessly.",
    },
    {
      title: "We Listen Because Campus And Society Are Not Separate Worlds",
      body: "What happens in higher education eventually enters workplaces, communities, institutions, and public life. We listen to keep that connection honest.",
    },
    {
      title: "We Listen Because Culture Should Be Understood Before It Is Changed",
      body: "Campus culture shapes the society of tomorrow. Before we can encourage meaningful dialogue or cultivate change, we have to understand what is actually happening — and why.",
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
          Why We Listen
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
