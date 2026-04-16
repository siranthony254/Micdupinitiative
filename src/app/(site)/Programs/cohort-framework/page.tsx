"use client";

import { useState } from "react";
import { DM_Sans, DM_Serif_Display } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
});

const pillars = [
  {
    badgeClass: "badgePurple",
    badge: "Identity",
    name: "Understanding self & belief systems",
    weeks: "Weeks 1-2",
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
  },
  {
    badgeClass: "badgeAmber",
    badge: "Understanding",
    name: "Rethinking education & knowledge",
    weeks: "Weeks 3-4",
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
  },
  {
    badgeClass: "badgeBlue",
    badge: "Awareness",
    name: "Seeing real problems clearly",
    weeks: "Weeks 5-6",
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
  },
  {
    badgeClass: "badgeCoral",
    badge: "Solution Thinking",
    name: "Moving from complaints to clarity",
    weeks: "Weeks 7-8",
    goal:
      "Clarity of reasoning - participants diagnose problems and propose thoughtful responses.",
    objectiveLabel: "Cohort Objective",
    objectives: [
      "Apply structured thinking to the problem identified in Pillar 3",
      "Distinguish symptoms from root causes",
    ],
    outputLabel: "Output",
    outputs: [
      '"What\'s really going on here" - case-style breakdown',
      "Written or recorded problem-solution framing",
    ],
  },
  {
    badgeClass: "badgeTeal",
    badge: "Voice & Responsibility",
    name: "Owning ideas and expressing them",
    weeks: "Weeks 9-12",
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
  },
] as const;

const outputLevels = [
  {
    levelClass: "levelOne",
    level: "Level 1",
    name: "Personal",
    items: ["Reflections", "Formation notes", "Internal clarity work"],
    result: "Transformation inside - the individual changes.",
  },
   {
    levelClass: "levelTwo",
    level: "Level 2",
    name: "Expression",
    items: ["Short videos", "Written insights", "Cohort discussions"],
    result: "Voice develops - ideas begin to travel.",
  },
  {
    levelClass: "levelThree",
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

function SectionHeader({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="sectionHeader">
      <div className="sectionNumber">{number}</div>
      <p className="sectionTitle">{title}</p>
    </div>
  );
}

export default function CohortFrameworkPage() {
  const [activePillar, setActivePillar] = useState(0);

  const togglePillar = (index: number) => {
    setActivePillar((current) => (current === index ? -1 : index));
  };

  const downloadFramework = () => {
    const frameworkText = [
      "The Cohort Framework",
      "",
      "MUI - Internal Framework",
      "",
      "A 12-week, fully online, intercampus formation journey - structured across 5 pillars, 3 output levels, and a weekly rhythm designed for depth without institutional friction.",
      "",
      "Core Objective - The Why",
      "Form individuals who can think clearly, identify real problems, and use their voice to influence responsibly.",
      "",
      "The 5 Pillars - 12-Week Structure",
      "",
      ...pillars.flatMap((pillar) => [
        `${pillar.badge} | ${pillar.name} | ${pillar.weeks}`,
        `Goal: ${pillar.goal}`,
        `${pillar.objectiveLabel}:`,
        ...pillar.objectives.map((item) => `- ${item}`),
        `${pillar.outputLabel}:`,
        ...pillar.outputs.map((item) => `- ${item}`),
        "",
      ]),
      "The Output System - 3 Levels",
      "",
      ...outputLevels.flatMap((output) => [
        `${output.level}: ${output.name}`,
        ...output.items.map((item) => `- ${item}`),
        `Result: ${output.result}`,
        "",
      ]),
      "Cohort Rhythm",
      "",
      ...rhythmCards.flatMap((card) => [
        `${card.freq}: ${card.title}`,
        card.desc,
        "",
      ]),
      "Cohort Goals",
      "",
      "Primary Goal:",
      "Develop clear thinkers with responsible voices.",
      "",
      ...goalGroups.flatMap((group) => [
        group.label,
        ...group.items.map((item) => `- ${item}`),
        "",
      ]),
      "Why Online & Intercampus",
      "The cohort is fully online and spans multiple campuses simultaneously - by design, not default. Campus clubs create institutional friction: approval processes, physical logistics, single-campus access. A student at a TVET in Kisumu and a student at a university in Nairobi walk the same formation journey, at the same time. The result is also richer: cohort members are formed alongside peers from different institutions, disciplines, and realities. That diversity is part of the formation.",
      "",
      "Framework Notes:",
      ...tags.map((tag) => `- ${tag}`),
      "",
      preparedBy,
      `Date: ${preparedDate}`,
    ].join("\n");

    const blob = new Blob([frameworkText], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "MUI_Cohort_Framework.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className={`frameworkPage ${dmSans.className}`}>
      <div className="wrap">
        <p className="eyebrow">MUI - Internal Framework</p>
        <h1 className={`heroTitle ${dmSerif.className}`}>The Cohort Framework</h1>
        <p className="heroSub">
          A 12-week, fully online, intercampus formation journey - structured
          across 5 pillars, 3 output levels, and a weekly rhythm designed for
          depth without institutional friction.
        </p>

        <div className="coreObjective">
          <p className="label">Core Objective - The Why</p>
          <p className={`statement ${dmSerif.className}`}>
            Form individuals who can think clearly, identify real problems, and
            use their voice to influence responsibly.
          </p>
        </div>

        <SectionHeader number="2" title="The 5 Pillars - 12-Week Structure" />

        <div className="pillars">
          {pillars.map((pillar, index) => {
            const isActive = activePillar === index;

            return (
              <div key={pillar.name} className="pillar">
                <button
                  type="button"
                  className={`pillarCard ${isActive ? "active" : ""}`}
                  onClick={() => togglePillar(index)}
                  aria-expanded={isActive}
                >
                  <div className="pillarHead">
                    <div className="pillarHeadLeft">
                      <span className={`pillarBadge ${pillar.badgeClass}`}>
                        {pillar.badge}
                      </span>
                      <span className="pillarName">{pillar.name}</span>
                    </div>
                    <div className="pillarMeta">
                      <span className="pillarWeeks">{pillar.weeks}</span>
                      <span className="pillarToggle">⌄</span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="pillarBody">
                      <div className="pillarGoal">
                        <p className="pillarGoalLabel">Goal</p>
                        <p className="pillarGoalText">{pillar.goal}</p>
                      </div>

                      <div className="pillarRows">
                        <div className="pillarCol">
                          <p className="pillarColLabel">{pillar.objectiveLabel}</p>
                          {pillar.objectives.map((item) => (
                            <div key={item} className="pillarColItem">
                              {item}
                            </div>
                          ))}
                        </div>

                        <div className="pillarCol">
                          <p className="pillarColLabel">{pillar.outputLabel}</p>
                          {pillar.outputs.map((item) => (
                            <div key={item} className="pillarColItem">
                              {item}
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

        <div className="outputGrid">
          {outputLevels.map((output) => (
            <div key={output.level} className={`outputCard ${output.levelClass}`}>
              <p className="outputLevel">{output.level}</p>
              <p className={`outputName ${dmSerif.className}`}>{output.name}</p>
              <div className="outputItems">
                {output.items.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
              <p className="outputResult">{output.result}</p>
            </div>
          ))}
        </div>

        <SectionHeader number="4" title="Cohort Rhythm" />

        <div className="rhythm">
          {rhythmCards.map((card) => (
            <div key={card.title} className="rhythmCard">
              <p className="rhythmFreq">{card.freq}</p>
              <p className="rhythmTitle">{card.title}</p>
              <p className="rhythmDesc">{card.desc}</p>
            </div>
          ))}
        </div>

        <SectionHeader number="5" title="Cohort Goals" />

        <div className="goalsGrid">
          <div className="goalCard goalPrimary">
            <p className="goalLabel">Primary Goal</p>
            <p className={`goalText ${dmSerif.className}`}>
              Develop clear thinkers with responsible voices.
            </p>
          </div>

          {goalGroups.map((group) => (
            <div key={group.label} className="goalCard">
              <p className="goalLabel">{group.label}</p>
              {group.items.map((item) => (
                <div key={item} className="goalItem">
                  <span className="goalCheck">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="designNote">
          <p className="designNoteLabel">Why Online & Intercampus</p>
          <p className="designNoteText">
            The cohort is fully online and spans multiple campuses
            simultaneously - by design, not default. Campus clubs create
            institutional friction: approval processes, physical logistics,
            single-campus access. A student at a TVET in Kisumu and a student
            at a university in Nairobi walk the same formation journey, at the
            same time. The result is also richer: cohort members are formed
            alongside peers from different institutions, disciplines, and
            realities. That diversity is part of the formation.
          </p>
          <div className="designNoteTags">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="downloadSection">
          <p className="downloadMeta">{preparedBy}</p>
          <p className="downloadMeta">Date: {preparedDate}</p>
          <button
            type="button"
            className="downloadButton"
            onClick={downloadFramework}
          >
            Download Framework
          </button>
        </div>
      </div>

      <style jsx>{`
        .frameworkPage {
          --ink: #f6f3ec;
          --muted: rgba(246, 243, 236, 0.76);
          --hint: rgba(246, 243, 236, 0.54);
          --surface: rgba(255, 255, 255, 0.04);
          --line: rgba(255, 255, 255, 0.1);
          --radius: 14px;
          --p1: #1a3a2e;
          --p2: #0f6e56;
          --p3: #1d9e75;
          --p4: #5dcaa5;
          --p5: #9fe1cb;
          --p6: #e1f5ee;
          background:
            radial-gradient(circle at top left, rgba(29, 158, 117, 0.12), transparent 30%),
            linear-gradient(180deg, #040404 0%, #080808 100%);
          color: var(--ink);
          padding: 2.5rem 1.5rem 4rem;
        }

        .wrap {
          max-width: 720px;
          margin: 0 auto;
        }

        .eyebrow {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--p4);
          margin-bottom: 8px;
        }

        .heroTitle {
          font-size: clamp(2rem, 3.8vw, 2.8rem);
          font-weight: 400;
          color: var(--ink);
          line-height: 1.15;
          margin-bottom: 6px;
        }

        .heroSub {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 480px;
        }

        .coreObjective {
          border-left: 3px solid var(--p3);
          padding: 16px 20px;
          background: rgba(225, 245, 238, 0.09);
          border-radius: 0 var(--radius) var(--radius) 0;
          margin-bottom: 36px;
        }

        .label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--p4);
          margin-bottom: 6px;
        }

        .statement {
          font-size: 17px;
          color: #9fe1cb;
          line-height: 1.45;
        }

        .sectionHeader {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .sectionNumber {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: var(--p3);
          color: #fff;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sectionTitle {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .pillars {
          position: relative;
          padding-left: 20px;
          margin-bottom: 40px;
        }

        .pillars::before {
          content: "";
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: linear-gradient(to bottom, var(--p3), var(--p5));
          border-radius: 2px;
        }

        .pillar {
          position: relative;
        }

        .pillar::before {
          content: "";
          position: absolute;
          left: -24px;
          top: 14px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--p3);
          border: 2px solid #080808;
          box-shadow: 0 0 0 1px var(--p3);
        }

        .pillarCard {
          width: 100%;
          border: 0.5px solid var(--line);
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 10px;
          background: rgba(7, 7, 7, 0.85);
          transition: border-color 0.2s ease;
          text-align: left;
        }

        .pillarCard:hover {
          border-color: var(--p4);
        }

        .pillarCard.active {
          border-color: var(--p3);
        }

        .pillarHead {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
        }

        .pillarHeadLeft {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .pillarBadge {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 4px;
          white-space: nowrap;
        }

        .badgePurple {
          background: #26215c;
          color: #afa9ec;
        }

        .badgeAmber {
          background: #412402;
          color: #fac775;
        }

        .badgeBlue {
          background: #042c53;
          color: #85b7eb;
        }

        .badgeCoral {
          background: #4a1b0c;
          color: #f0997b;
        }

        .badgeTeal {
          background: #04342c;
          color: #5dcaa5;
        }

        .pillarName {
          font-weight: 500;
          font-size: 14px;
          color: var(--ink);
        }

        .pillarMeta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .pillarWeeks {
          font-size: 11px;
          color: var(--hint);
        }

        .pillarToggle {
          font-size: 16px;
          color: var(--hint);
          transition: transform 0.2s ease;
          line-height: 1;
        }

        .pillarCard.active .pillarToggle {
          transform: rotate(180deg);
        }

        .pillarBody {
          padding: 0 16px 16px;
          border-top: 0.5px solid var(--line);
          background: rgba(7, 7, 7, 0.9);
        }

        .pillarGoal {
          margin-top: 12px;
          margin-bottom: 10px;
        }

        .pillarGoalLabel,
        .pillarColLabel,
        .outputLevel,
        .rhythmFreq,
        .goalLabel,
        .designNoteLabel {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .pillarGoalLabel,
        .pillarColLabel,
        .goalLabel,
        .designNoteLabel {
          color: var(--hint);
        }

        .pillarGoalLabel {
          margin-bottom: 4px;
        }

        .pillarGoalText {
          font-size: 13px;
          color: var(--muted);
          line-height: 1.5;
        }

        .pillarRows {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 10px;
        }

        .pillarCol {
          background: var(--surface);
          border-radius: var(--radius);
          padding: 10px 12px;
        }

        .pillarColLabel {
          margin-bottom: 6px;
        }

        .pillarColItem {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
          display: flex;
          gap: 6px;
          align-items: flex-start;
        }

        .pillarColItem::before {
          content: "-";
          color: var(--p4);
          flex-shrink: 0;
        }

        .outputGrid,
        .rhythm {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-bottom: 40px;
        }

        .outputCard {
          border: 0.5px solid var(--line);
          border-radius: 18px;
          padding: 14px;
          background: rgba(7, 7, 7, 0.85);
          position: relative;
          overflow: hidden;
        }

        .outputCard::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .levelOne::before {
          background: var(--p4);
        }

        .levelTwo::before {
          background: #ef9f27;
        }

        .levelThree::before {
          background: var(--p2);
        }

        .levelOne .outputLevel {
          color: var(--p3);
        }

        .levelTwo .outputLevel {
          color: #ba7517;
        }

        .levelThree .outputLevel {
          color: var(--p5);
        }

        .outputLevel {
          margin-bottom: 6px;
          letter-spacing: 0.12em;
        }

        .outputName {
          font-size: 16px;
          color: var(--ink);
          margin-bottom: 8px;
        }

        .outputItems {
          font-size: 11px;
          color: var(--muted);
          line-height: 1.8;
        }

        .outputResult {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 0.5px solid var(--line);
          font-size: 11px;
          font-style: italic;
          color: var(--hint);
        }

        .rhythmCard,
        .goalCard,
        .designNote {
          border: 0.5px solid var(--line);
          border-radius: var(--radius);
        }

        .rhythmCard {
          padding: 14px;
          background: var(--surface);
        }

        .rhythmFreq {
          color: var(--p3);
          margin-bottom: 6px;
          letter-spacing: 0.12em;
        }

        .rhythmTitle {
          font-weight: 500;
          font-size: 13px;
          color: var(--ink);
          margin-bottom: 4px;
        }

        .rhythmDesc,
        .designNoteText {
          font-size: 12px;
          color: var(--muted);
          line-height: 1.6;
        }

        .goalsGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 40px;
        }

        .goalCard {
          padding: 14px 16px;
          background: rgba(7, 7, 7, 0.85);
        }

        .goalPrimary {
          grid-column: 1 / -1;
          background: rgba(225, 245, 238, 0.09);
          border-color: rgba(159, 225, 203, 0.35);
        }

        .goalPrimary .goalLabel {
          color: var(--p4);
        }

        .goalText {
          font-size: 18px;
          color: #9fe1cb;
          line-height: 1.3;
        }

        .goalItem {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
          line-height: 1.5;
          margin-bottom: 6px;
        }

        .goalCheck {
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: var(--p3);
          flex-shrink: 0;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 8px;
        }

        .designNote {
          padding: 14px 16px;
          background: var(--surface);
        }

        .designNoteLabel {
          letter-spacing: 0.12em;
          margin-bottom: 6px;
        }

        .designNoteTags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }

        .tag {
          font-size: 11px;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 20px;
          background: #04342c;
          color: var(--p4);
        }

        .downloadSection {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.6rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 0.5px solid var(--line);
        }

        .downloadMeta {
          font-size: 12px;
          color: var(--hint);
          line-height: 1.5;
        }

        .downloadButton {
          border: 1px solid rgba(93, 202, 165, 0.45);
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            rgba(29, 158, 117, 0.22),
            rgba(15, 110, 86, 0.3)
          );
          color: var(--ink);
          padding: 0.8rem 1.35rem;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .downloadButton:hover {
          transform: translateY(-1px);
          border-color: var(--p4);
          background: linear-gradient(
            180deg,
            rgba(29, 158, 117, 0.3),
            rgba(15, 110, 86, 0.38)
          );
        }

        @media (max-width: 720px) {
          .frameworkPage {
            padding: 2rem 1rem 3rem;
          }

          .pillarHead {
            align-items: flex-start;
            flex-direction: column;
          }

          .pillarHeadLeft,
          .pillarMeta {
            width: 100%;
          }

          .pillarMeta {
            justify-content: space-between;
          }

          .pillarRows,
          .outputGrid,
          .rhythm,
          .goalsGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
