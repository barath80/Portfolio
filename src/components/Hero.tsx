"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { Magnetic, useIntroDone } from "./Interactions";
import { CountUp } from "./ui";
import HeroVisual from "./three/HeroVisual";

const stats = [
  { v: 3, s: "", l: "internships" },
  { v: 5, s: "", l: "shipped AI projects" },
  { v: 4, s: "", l: "hackathon podiums" },
  { v: 1000, s: "+", l: "LeetCode solved" },
];

const ease = [0.22, 1, 0.36, 1] as const;

/** Letter-by-letter mask reveal. `gradient` spreads one gradient across the whole word. */
function Chars({ text, start, gradient = false }: { text: string; start: boolean; gradient?: boolean }) {
  const n = text.length;
  return (
    <span aria-hidden className="inline-block whitespace-nowrap">
      {text.split("").map((c, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]">
          <motion.span
            className={`inline-block ${gradient ? "grad-text" : ""}`}
            style={gradient ? { backgroundSize: `${n * 100}% 100%`, backgroundPosition: `${(i / Math.max(n - 1, 1)) * 100}% 0` } : undefined}
            initial={{ y: "115%", rotate: 8 }}
            animate={start ? { y: "0%", rotate: 0 } : { y: "115%", rotate: 8 }}
            transition={{ duration: 0.9, delay: i * 0.04, ease }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const start = useIntroDone();
  const host = useRef<HTMLElement>(null);
  const [role, setRole] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRole((r) => (r + 1) % profile.roles.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" ref={host} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-10 pt-28">
      <div className="wrap relative">
        <div className="relative inline-block max-w-full">
          <h1 aria-label="Sunkireddy Barath" className="text-[clamp(3rem,13vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            <Chars text="Sunkireddy" start={start} />
            <br />
            <Chars text="Barath" start={start} gradient />
          </h1>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={start ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="mt-10 max-w-2xl">
          <p className="text-xl font-medium leading-snug sm:text-2xl md:text-3xl">
            I build
            {/* all roles share one grid cell so the line never jumps; own line avoids a gap on phones */}
            <span className="relative block h-[1.2em] overflow-hidden text-4xl leading-[1.2] sm:text-5xl md:text-6xl">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={role}
                  initial={{ y: "70%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-70%", opacity: 0, transition: { duration: 0.14 } }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-x-0 top-0 whitespace-nowrap font-extrabold text-accent"
                >
                  {profile.roles[role]}
                </motion.span>
              </AnimatePresence>
            </span>
            systems that hold up past the demo.
          </p>
          <p className="mt-4 text-base text-mute md:text-lg">
            B.E. Computer Science at {profile.education.school} ({profile.education.years}), CGPA {profile.education.cgpa}. Production
            pipelines, agents and backends — measured, benchmarked, deployed.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={start ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Magnetic className="sm:w-auto"><a href={profile.resume} download className="btn btn-solid w-full" data-cursor="GET">Download resume</a></Magnetic>
          <Magnetic className="sm:w-auto"><a href="#projects" className="btn btn-ghost w-full" data-cursor="VIEW">View my work</a></Magnetic>
          <Magnetic className="sm:w-auto"><a href="#contact" className="btn btn-ghost w-full">Contact me</a></Magnetic>
        </motion.div>

        <p className="mono mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-mute">
          <a className="underline-offset-4 transition hover:text-ink hover:underline" href={`mailto:${profile.email}`}>{profile.email}</a>
          <a className="underline-offset-4 transition hover:text-ink hover:underline" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="underline-offset-4 transition hover:text-ink hover:underline" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        </p>

        <HeroVisual className="relative mx-auto mt-12 h-[300px] w-full max-w-sm xl:absolute xl:right-0 xl:top-16 xl:mt-0 xl:h-[500px] xl:w-[420px] xl:max-w-none" />

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-card p-5 md:p-6">
              <dt className="sr-only">{s.l}</dt>
              <dd className="text-4xl font-extrabold tracking-tight md:text-5xl">
                <CountUp value={`${s.v}${s.s}`} enabled={start} group eager />
              </dd>
              <p className="label mt-2 !tracking-[.08em]">{s.l}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
