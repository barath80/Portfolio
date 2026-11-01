"use client";

import { achievements, competitive, experience, profile, projects, skills } from "@/lib/data";
import { Arrow, Reveal, SectionHead } from "./ui";

export function About() {
  const loop = skills.flatMap((s) => s.items);
  return (
    <section id="about" className="section pt-10 md:pt-20">
      <div className="mb-14 overflow-hidden border-y border-line py-4" aria-hidden>
        <div className="marquee mono text-sm text-mute">
          {[...loop, ...loop].map((s, i) => (
            <span key={i} className="mx-5 whitespace-nowrap">
              <span className="mr-5 text-accent">✦</span>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="wrap">
        <SectionHead index="01" kicker="About" title="Engineer first. Measured always." />
        <div className="grid gap-8 md:grid-cols-5 md:gap-14">
          <Reveal className="md:col-span-3">
            <p className="text-xl leading-relaxed sm:text-2xl">
              I&apos;m a Computer Science student building across the stack — from{" "}
              <b>transaction-safe backends</b> to <b>computer-vision pipelines</b>, <b>RAG systems</b> and{" "}
              <b>multi-agent platforms</b>. Every project here carries a number: an accuracy, a latency, a false-claim rate driven to zero.
            </p>
            <p className="mt-6 text-lg text-mute">
              Three internships, four hackathon placements (two outright wins) and 1000+ solved LeetCode problems — aimed at SDE, Machine
              Learning, Generative AI and Agentic AI roles.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-2">
            <div className="rounded-2xl border border-line bg-card p-6">
              <p className="label mb-4">Education</p>
              <p className="text-xl font-bold leading-snug">{profile.education.school}</p>
              <p className="mt-1 text-mute">{profile.education.degree}</p>
              <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
                <span className="mono text-sm text-mute">{profile.education.years}</span>
                <span className="text-right">
                  <span className="block text-4xl font-extrabold text-accent">8.78</span>
                  <span className="label">CGPA / 10</span>
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="section">
      <div className="wrap">
        <SectionHead index="02" kicker="Experience" title="Where I've shipped." />
        <ol className="relative border-l border-line pl-6 md:pl-10">
          {experience.map((e, i) => (
            <li key={e.company} className="relative pb-12 last:pb-0">
              <span className="absolute -left-[31px] top-2 h-3 w-3 rounded-full border-2 border-accent bg-bg md:-left-[47px]" />
              <Reveal delay={i * 0.05}>
                <div className="rounded-2xl border border-line bg-card p-5 transition hover:border-accent md:p-8">
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <h3 className="text-2xl font-extrabold tracking-tight md:text-3xl">{e.company}</h3>
                    <span className="mono text-xs text-mute">{e.period}</span>
                  </div>
                  <p className="mt-1 flex flex-wrap gap-x-3 text-mute">
                    <span className="font-semibold text-ink">{e.role}</span>
                    <span>· {e.place}</span>
                  </p>
                  <ul className="mt-5 space-y-3">
                    {e.points.map((p) => (
                      <li key={p} className="flex gap-3 leading-relaxed">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="section bg-bg2">
      <div className="wrap">
        <SectionHead index="03" kicker="Selected work" title="Projects with receipts." />
        <div className="space-y-6">
          {projects.map((p) => (
            <Reveal key={p.id}>
              <article className="group relative overflow-hidden rounded-3xl border border-line bg-card p-5 transition hover:border-accent sm:p-8 md:p-10">
                <span className="mono pointer-events-none absolute right-5 top-3 text-6xl font-extrabold text-line transition group-hover:text-accent/40 md:text-8xl">
                  {p.id}
                </span>
                <div className="relative">
                  <h3 className="pr-16 text-3xl font-extrabold tracking-tight md:text-5xl">{p.name}</h3>
                  <p className="mt-2 text-base text-mute md:text-lg">{p.tagline}</p>

                  <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-4">
                    {p.headline.map((h) => (
                      <div key={h.label} className="rounded-xl border border-line bg-bg p-3 sm:p-4">
                        <p className="break-words text-xl font-extrabold leading-none text-accent sm:text-3xl md:text-4xl">{h.value}</p>
                        <p className="label mt-2 !text-[.62rem] !tracking-[.05em] sm:!text-[.7rem]">{h.label}</p>
                      </div>
                    ))}
                  </div>

                  <ul className="mt-7 space-y-3">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-3 leading-relaxed">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {pt}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <span key={s} className="chip">{s}</span>
                    ))}
                  </div>

                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-8 w-full sm:w-auto" aria-label={`${p.name} on GitHub`}>
                    View on GitHub <Arrow />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="section">
      <div className="wrap">
        <SectionHead index="04" kicker="Toolkit" title="Stack & problem-solving." />
        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {skills.map((g, i) => (
            <Reveal key={g.group} delay={(i % 2) * 0.05} className={`bg-card p-6 ${i === skills.length - 1 && skills.length % 2 ? "md:col-span-2" : ""}`}>
              <p className="label mb-4 !text-accent">{g.group}</p>
              <div className="flex flex-wrap gap-2">
                {g.items.map((s) => (
                  <span key={s} className="chip !whitespace-normal">{s}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <h3 className="label mb-5 mt-20">Competitive programming</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {competitive.map((c) => (
            <Reveal key={c.platform}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-line bg-card p-6 transition hover:-translate-y-1 hover:border-accent"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{c.platform}</span>
                  <Arrow className="text-mute transition group-hover:text-accent" />
                </div>
                <p className="mono text-xs text-mute">@{c.handle}</p>
                <p className="mt-5 text-6xl font-extrabold tracking-tighter text-accent">{c.big}</p>
                <p className="label mb-4">{c.bigLabel}</p>
                <p className="mt-auto text-sm leading-relaxed text-mute">{c.text}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AchievementsSection() {
  return (
    <section id="achievements" className="section bg-bg2">
      <div className="wrap">
        <SectionHead index="05" kicker="Achievements" title="Built under the clock." />
        <div className="divide-y divide-line border-y border-line">
          {achievements.map((a) => (
            <Reveal key={a.title}>
              <div className="grid gap-2 py-6 md:grid-cols-12 md:items-center md:gap-6 md:py-8">
                <span className="mono text-xs text-mute md:col-span-2">{a.date}</span>
                <div className="md:col-span-6">
                  <h3 className="text-xl font-extrabold tracking-tight md:text-2xl">{a.title}</h3>
                  <p className="mt-1 text-sm text-mute">{a.detail}</p>
                </div>
                <span className="w-fit rounded-full bg-accent px-3.5 py-1.5 text-sm font-bold text-accent-ink md:col-span-2 md:justify-self-start">
                  {a.result}
                </span>
                <span className="mono text-sm font-semibold md:col-span-2 md:text-right">{a.prize}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
