"use client";

import { useState } from "react";

const pillars = [
  {
    badge: "Identity",
    weeks: "Weeks 1-2",
    name: "Understanding self & belief systems",
    goal:
      'Clarity of self - participants articulate: "This is what has shaped how I think."',
    objectiveLabel: "Cohort Objective",
    objectives: [
      "Name the experiences, voices, and systems that formed their current worldview",
      "Distinguish between inherited beliefs and examined convictions",
    ],
    outputLabel: "Output",
    outputs: [
      'Personal reflection: "My thinking has been shaped by..."',
      "Short video or written post on formative influences",
    ],
    badgeStyle: "bg-[#26215c] text-[#afa9ec]",
  },
  {
    badge: "Understanding",
    weeks: "Weeks 3-4",
    name: "Rethinking education & knowledge",
    goal:
      "Clarity of thinking - participants distinguish information, understanding, and wisdom.",
    objectiveLabel: "Cohort Objective",
    objectives: [
      "Challenge the credential-as-education assumption",
      "Define what it means to be truly educated versus merely qualified",
    ],
    outputLabel: "Output",
    outputs: [
      '"What it means to be truly educated" - insight post or short essay',
      "Cohort discussion thread on the purpose of university",
    ],
    badgeStyle: "bg-[#412402] text-[#fac775]",
  },
  {
    badge: "Awareness",
    weeks: "Weeks 5-6",
    name: "Seeing real problems clearly",
    goal:
      "Clarity of environment - participants identify a real, specific problem around them.",
    objectiveLabel: "Cohort Objective",
    objectives: [
      "Move from vague frustrations to named, specific problems",
      "Practise observing with precision - not complaint, but diagnosis",
    ],
    outputLabel: "Output",
    outputs: [
      "Problem breakdown - a named issue with evidence",
      "Observational insight shared in cohort session",
    ],
    badgeStyle: "bg-[#042c53] text-[#85b7eb]",
  },
  {
    badge: "Solution Thinking",
    weeks: "Weeks 7-8",
    name: "Moving from complaints to clarity",
    goal:
      "Clarity of reasoning - participants diagnose problems and propose thoughtful responses.",
    objectiveLabel: "Cohort Objective",
    objectives: [
      "Apply structured thinking to the problem identified in Pillar 3",
      "Distinguish symptoms from root causes",
    ],
    outputLabel: "Output",
    outputs: [
      `"What's really going on here" - case-style breakdown`,
      "Written or recorded problem-solution framing",
    ],
    badgeStyle: "bg-[#4a1b0c] text-[#f0997b]",
  },
  {
    badge: "Voice & Responsibility",
    weeks: "Weeks 9-12",
    name: "Owning ideas and expressing them",
    goal:
      "Clarity of expression - participants clearly express an idea and stand behind it publicly.",
    objectiveLabel: "Cohort Objective",
    objectives: [
      "Articulate a well-reasoned position on a real issue",
      "Understand that voice carries responsibility, not just visibility",
    ],
    outputLabel: "Output (Capstone)",
    outputs: [
      "Recorded talk or presentation - archived on MUI platforms",
      "Shared content - the voice is now on record",
    ],
    badgeStyle: "bg-[#04342c] text-[#5dcaa5]",
  },
] as const;

const outputLevels = [
  {
    level: "Level 1",
    name: "Personal",
    items: ["Reflections", "Formation notes", "Internal clarity work"],
    result: "Transformation inside - the individual changes.",
  },
  {
    level: "Level 2",
    name: "Expression",
    items: ["Short videos", "Written insights", "Cohort discussions"],
    result: "Voice develops - ideas begin to travel.",
  },
  {
    level: "Level 3",
    name: "Public Capstone",
    items: ["Recorded presentations", "Published content", "Documented ideas"],
    result: "Influence + visibility - the voice is on record.",
  },
] as const;

const rhythmCards = [
  {
    freq: "Weekly",
    title: "Personal formation tasks",
    desc: "Not assignments. Structured exercises in honest self-examination - completed independently before each session.",
  },
  {
    freq: "Monthly",
    title: "Closed cohort session",
    desc: "The heartbeat of the programme. Facilitated, intercampus, online. Real thinking - not a webinar.",
  },
  {
    freq: "Ongoing",
    title: "Accountability & tracking",
    desc: "Every participant is accountable to their mentor and to each other. Growth that is not tracked does not compound.",
  },
] as const;

const goalGroups = [
  {
    label: "By end of 12 weeks, each participant will:",
    items: [
      "Understand themselves and the belief systems that shaped them",
      "Think critically about ideas - distinguishing information from wisdom",
      "Identify a real-world problem with precision",
    ],
  },
  {
    label: "And they will be able to:",
    items: [
      "Break down an issue clearly - root cause, not just symptom",
      "Express an idea confidently and stand behind it",
      "Produce public content that is documented and shareable",
    ],
  },
] as const;

const tags = [
  "2 cohorts / year",
  "1 semester (3 months)",
  "15-25 participants per cohort",
  "Fully online",
  "Intercampus",
] as const;

const preparedBy = "Prepared by Sir Anthony --- Founder and President MUI";
const preparedDate = "April 16, 2026";

const pdfW = 595.28;
const pdfH = 841.89;
const margin = 48;

const escapePdf = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

const pdfColor = (r: number, g: number, b: number) =>
  `${(r / 255).toFixed(3)} ${(g / 255).toFixed(3)} ${(b / 255).toFixed(3)}`;

function wrapPdfText(text: string, width: number, size: number) {
  const words = text.trim().split(/\s+/);
  const limit = Math.max(14, Math.floor(width / (size * 0.52)));
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= limit) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildFrameworkPdf() {
  const pages: string[] = [];
  let y = pdfH - margin;
  let page = 0;
  let cmds: string[] = [];

  const newPage = () => {
    page += 1;
    y = pdfH - margin;
    cmds = [
      `1 1 1 rg 0 0 ${pdfW} ${pdfH} re f`,
      `${pdfColor(218, 231, 225)} rg 0 ${pdfH - 18} ${pdfW} 18 re f`,
    ];
  };

  const closePage = () => {
    cmds.push(
      `BT /F1 9 Tf ${pdfColor(124, 132, 126)} rg 1 0 0 1 ${margin} 22 Tm (${escapePdf(preparedBy)}) Tj ET`,
      `BT /F1 9 Tf ${pdfColor(124, 132, 126)} rg 1 0 0 1 ${pdfW - 130} 22 Tm (Page ${page}) Tj ET`
    );
    pages.push(cmds.join("\n"));
  };

  const ensure = (height: number) => {
    if (y - height < margin) {
      closePage();
      newPage();
    }
  };

  const line = (
    text: string,
    x: number,
    py: number,
    size: number,
    font: "F1" | "F2" | "F3",
    color: string
  ) => {
    cmds.push(
      `BT /${font} ${size} Tf ${color} rg 1 0 0 1 ${x} ${py} Tm (${escapePdf(text)}) Tj ET`
    );
  };

  const paragraph = (
    text: string,
    opts: {
      x?: number;
      width?: number;
      size?: number;
      leading?: number;
      font?: "F1" | "F2" | "F3";
      color?: string;
      after?: number;
    } = {}
  ) => {
    const width = opts.width ?? pdfW - margin * 2;
    const size = opts.size ?? 11;
    const leading = opts.leading ?? 15;
    const font = opts.font ?? "F1";
    const color = opts.color ?? pdfColor(60, 68, 63);
    const after = opts.after ?? 8;
    const x = opts.x ?? margin;
    const lines = wrapPdfText(text, width, size);
    ensure(lines.length * leading + after);
    for (const item of lines) {
      line(item, x, y, size, font, color);
      y -= leading;
    }
    y -= after;
  };

  const bullets = (items: readonly string[]) => {
    for (const item of items) {
      const lines = wrapPdfText(item, pdfW - margin * 2 - 12, 10.5);
      ensure(lines.length * 14 + 4);
      line("-", margin, y, 11, "F2", pdfColor(29, 158, 117));
      lines.forEach((txt, i) => line(txt, margin + 12, y - i * 14, 10.5, "F1", pdfColor(62, 70, 65)));
      y -= lines.length * 14 + 2;
    }
    y -= 4;
  };

  const section = (number: string, title: string) => {
    ensure(34);
    cmds.push(
      `${pdfColor(29, 158, 117)} rg ${margin} ${y - 8} 22 22 re f`,
      `${pdfColor(14, 81, 63)} rg ${margin + 28} ${y - 4} ${pdfW - margin * 2 - 28} 14 re f`
    );
    line(number, margin + 7, y - 1, 10, "F2", pdfColor(255, 255, 255));
    line(title, margin + 34, y - 1, 10.5, "F2", pdfColor(255, 255, 255));
    y -= 34;
  };

  const card = (heading: string, body: string[], emphasis = false) => {
    const fill = emphasis ? pdfColor(225, 245, 238) : pdfColor(244, 248, 246);
    const stroke = emphasis ? pdfColor(159, 225, 203) : pdfColor(205, 221, 214);
    const titleColor = emphasis ? pdfColor(26, 58, 46) : pdfColor(15, 110, 86);
    const bodyLines = body.flatMap((item) => wrapPdfText(item, pdfW - margin * 2 - 24, 10.5));
    const height = 20 + bodyLines.length * 14 + 10;
    ensure(height);
    cmds.push(
      `${fill} rg ${margin} ${y - height + 10} ${pdfW - margin * 2} ${height} re f`,
      `${stroke} RG 1 w ${margin} ${y - height + 10} ${pdfW - margin * 2} ${height} re S`
    );
    line(heading, margin + 12, y - 6, 10, "F2", titleColor);
    let innerY = y - 22;
    for (const item of bodyLines) {
      line(item, margin + 12, innerY, 10.5, "F1", pdfColor(62, 70, 65));
      innerY -= 14;
    }
    y -= height + 8;
  };

  newPage();
  cmds.push(`${pdfColor(15, 110, 86)} rg ${margin} ${y - 94} ${pdfW - margin * 2} 94 re f`);
  line("MUI - Internal Framework", margin + 18, y - 22, 11, "F2", pdfColor(225, 245, 238));
  line("The Cohort Framework", margin + 18, y - 50, 24, "F3", pdfColor(255, 255, 255));
  line(`Date: ${preparedDate}`, margin + 18, y - 74, 10, "F1", pdfColor(225, 245, 238));
  y -= 118;

  paragraph(
    "A 12-week, fully online, intercampus formation journey structured across 5 pillars, 3 output levels, and a weekly rhythm designed for depth without institutional friction.",
    { size: 11.5, leading: 16, color: pdfColor(83, 92, 87), after: 14 }
  );

  card(
    "Core Objective - The Why",
    ["Form individuals who can think clearly, identify real problems, and use their voice to influence responsibly."],
    true
  );

  section("2", "The 5 Pillars - 12-Week Structure");
  pillars.forEach((pillar, index) =>
    card(`${index + 1}. ${pillar.badge} | ${pillar.name} | ${pillar.weeks}`, [
      `Goal: ${pillar.goal}`,
      `${pillar.objectiveLabel}: ${pillar.objectives.join("; ")}`,
      `${pillar.outputLabel}: ${pillar.outputs.join("; ")}`,
    ])
  );

  section("3", "The Output System - 3 Levels");
  outputLevels.forEach((item) =>
    card(`${item.level} - ${item.name}`, [
      `Includes: ${item.items.join(", ")}`,
      `Result: ${item.result}`,
    ])
  );

  section("4", "Cohort Rhythm");
  rhythmCards.forEach((item) => card(`${item.freq} - ${item.title}`, [item.desc]));

  section("5", "Cohort Goals");
  card("Primary Goal", ["Develop clear thinkers with responsible voices."], true);
  goalGroups.forEach((group) => {
    ensure(28);
    line(group.label, margin, y, 10.5, "F2", pdfColor(15, 110, 86));
    y -= 18;
    bullets(group.items);
  });

  card("Why Online & Intercampus", [
    "The cohort is fully online and spans multiple campuses simultaneously by design, not default. Campus clubs create institutional friction: approval processes, physical logistics, single-campus access. A student at a TVET in Kisumu and a student at a university in Nairobi walk the same formation journey, at the same time. The result is also richer: cohort members are formed alongside peers from different institutions, disciplines, and realities. That diversity is part of the formation.",
  ]);

  ensure(80);
  line("Framework Notes", margin, y, 10.5, "F2", pdfColor(15, 110, 86));
  y -= 18;
  bullets(tags);
  paragraph(preparedBy, { size: 10.5, font: "F2", color: pdfColor(26, 58, 46), after: 2 });
  paragraph(`Date: ${preparedDate}`, { size: 10, color: pdfColor(83, 92, 87), after: 0 });
  closePage();

  const objects: string[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, i) => `${6 + i * 2} 0 R`).join(" ")}] >>`;
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
  objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>";

  pages.forEach((content, i) => {
    const pageId = 6 + i * 2;
    const streamId = pageId + 1;
    objects[pageId] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfW} ${pdfH}] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${streamId} 0 R >>`;
    objects[streamId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];
  for (let i = 1; i < objects.length; i += 1) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return new Blob([new TextEncoder().encode(pdf)], { type: "application/pdf" });
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-xs font-medium text-white">
        {number}
      </div>
      <p className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/75">
        {title}
      </p>
    </div>
  );
}

export default function CohortFrameworkPage() {
  const [active, setActive] = useState(0);

  const downloadFramework = () => {
    const blob = buildFrameworkPdf();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MUI_Cohort_Framework.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className={`min-h-screen bg-[#080808] px-4 py-10 text-[#f6f3ec] [font-family:Arial,Helvetica,sans-serif] sm:px-6`}>
      <div className="mx-auto max-w-[720px]">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-400">
          MUI - Internal Framework
        </p>
        <h1 className={`mb-2 text-[clamp(2rem,3.8vw,2.8rem)] leading-[1.15] [font-family:Georgia,'Times New Roman',serif]`}>
          The Cohort Framework
        </h1>
        <p className="mb-8 max-w-[480px] text-[13px] leading-6 text-white/75">
          A 12-week, fully online, intercampus formation journey - structured across 5 pillars,
          3 output levels, and a weekly rhythm designed for depth without institutional friction.
        </p>

        <div className="mb-9 rounded-r-[14px] border-l-[3px] border-emerald-500 bg-emerald-50/10 px-5 py-4">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-400">
            Core Objective - The Why
          </p>
          <p className={`text-[17px] leading-[1.45] text-[#9fe1cb] [font-family:Georgia,'Times New Roman',serif]`}>
            Form individuals who can think clearly, identify real problems, and use their voice to
            influence responsibly.
          </p>
        </div>

        <SectionHeader number="2" title="The 5 Pillars - 12-Week Structure" />
        <div className="relative mb-10 pl-5 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:rounded before:bg-gradient-to-b before:from-emerald-500 before:to-emerald-200">
          {pillars.map((pillar, index) => {
            const open = active === index;
            return (
              <div key={pillar.name} className="relative">
                <div className="absolute -left-6 top-4 h-2 w-2 rounded-full border-2 border-[#080808] bg-emerald-500 shadow-[0_0_0_1px_#1d9e75]" />
                <button
                  type="button"
                  onClick={() => setActive((current) => (current === index ? -1 : index))}
                  className={`mb-3 w-full rounded-[18px] border bg-white/[0.03] text-left transition ${
                    open ? "border-emerald-500" : "border-white/10 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`rounded px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] ${pillar.badgeStyle}`}>
                        {pillar.badge}
                      </span>
                      <span className="text-sm font-medium text-white">{pillar.name}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs text-white/55 sm:justify-end">
                      <span>{pillar.weeks}</span>
                      <span className={`transition ${open ? "rotate-180" : ""}`}>v</span>
                    </div>
                  </div>
                  {open && (
                    <div className="border-t border-white/10 bg-black/20 px-4 pb-4 pt-3">
                      <div className="mb-3">
                        <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.1em] text-white/55">
                          Goal
                        </p>
                        <p className="text-[13px] leading-6 text-white/75">{pillar.goal}</p>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div className="rounded-[14px] bg-white/[0.04] p-3">
                          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-white/55">
                            {pillar.objectiveLabel}
                          </p>
                          {pillar.objectives.map((item) => (
                            <div key={item} className="flex gap-2 text-xs leading-6 text-white/75">
                              <span className="text-emerald-300">-</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                        <div className="rounded-[14px] bg-white/[0.04] p-3">
                          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.1em] text-white/55">
                            {pillar.outputLabel}
                          </p>
                          {pillar.outputs.map((item) => (
                            <div key={item} className="flex gap-2 text-xs leading-6 text-white/75">
                              <span className="text-emerald-300">-</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <SectionHeader number="3" title="The Output System - 3 Levels" />
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {outputLevels.map((item, index) => (
            <div key={item.level} className="relative rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
              <div
                className={`absolute inset-x-0 top-0 h-[3px] rounded-t-[18px] ${
                  index === 0 ? "bg-emerald-300" : index === 1 ? "bg-amber-400" : "bg-emerald-800"
                }`}
              />
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-400">
                {item.level}
              </p>
              <p className={`mb-2 text-base [font-family:Georgia,'Times New Roman',serif]`}>{item.name}</p>
              <div className="text-[11px] leading-7 text-white/75">
                {item.items.map((entry) => (
                  <div key={entry}>{entry}</div>
                ))}
              </div>
              <p className="mt-3 border-t border-white/10 pt-3 text-[11px] italic text-white/55">
                {item.result}
              </p>
            </div>
          ))}
        </div>

        <SectionHeader number="4" title="Cohort Rhythm" />
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          {rhythmCards.map((item) => (
            <div key={item.title} className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-400">
                {item.freq}
              </p>
              <p className="mb-1 text-[13px] font-medium text-white">{item.title}</p>
              <p className="text-[11px] leading-6 text-white/75">{item.desc}</p>
            </div>
          ))}
        </div>

        <SectionHeader number="5" title="Cohort Goals" />
        <div className="mb-10 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2 rounded-[14px] border border-emerald-200/30 bg-emerald-50/10 p-4">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-400">
              Primary Goal
            </p>
            <p className={`text-lg leading-[1.3] text-[#9fe1cb] [font-family:Georgia,'Times New Roman',serif]`}>
              Develop clear thinkers with responsible voices.
            </p>
          </div>
          {goalGroups.map((group) => (
            <div key={group.label} className="rounded-[14px] border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/55">
                {group.label}
              </p>
              {group.items.map((item) => (
                <div key={item} className="mb-2 flex gap-2 text-xs leading-6 text-white/75">
                  <span className="mt-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] text-white">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="rounded-[14px] border border-white/10 bg-white/[0.04] p-4">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/55">
            Why Online & Intercampus
          </p>
          <p className="text-[12px] leading-6 text-white/75">
            The cohort is fully online and spans multiple campuses simultaneously - by design, not
            default. Campus clubs create institutional friction: approval processes, physical
            logistics, single-campus access. A student at a TVET in Kisumu and a student at a
            university in Nairobi walk the same formation journey, at the same time. The result is
            also richer: cohort members are formed alongside peers from different institutions,
            disciplines, and realities. That diversity is part of the formation.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-[#04342c] px-3 py-1 text-[11px] font-medium text-emerald-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6">
          <p className="text-sm text-white/55">{preparedBy}</p>
          <p className="mt-1 text-sm text-white/55">Date: {preparedDate}</p>
          <button
            type="button"
            onClick={downloadFramework}
            className="mt-4 rounded-full border border-emerald-300/40 bg-gradient-to-b from-emerald-500/25 to-emerald-800/30 px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-px hover:border-emerald-300"
          >
            Download Framework PDF
          </button>
        </div>
      </div>
    </section>
  );
} 
