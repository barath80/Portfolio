"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { Arrow } from "./ui";

const stats = [
  { v: 3, s: "", l: "internships" },
  { v: 5, s: "", l: "shipped AI projects" },
  { v: 4, s: "", l: "hackathon podiums" },
  { v: 1000, s: "+", l: "LeetCode solved" },
];

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return setN(to);
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1400, 1);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <>{n.toLocaleString()}{suffix}</>;
}

/** A detector-style box that trails the cursor — a nod to the ANPR/YOLO work. */
function CursorBox({ host }: { host: React.RefObject<HTMLElement | null> }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 220, damping: 24 });
  const sy = useSpring(y, { stiffness: 220, damping: 24 });
  const [on, setOn] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setFine(window.matchMedia("(pointer: fine)").matches);
    const el = host.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      setOn(true);
    };
    const leave = () => setOn(false);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [host, x, y]);

  if (!fine) return null;
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      animate={{ opacity: on ? 1 : 0 }}
      className="pointer-events-none absolute left-0 top-0 z-10"
    >
      <div className="-ml-14 -mt-10 h-20 w-28 border border-accent">
        <span className="mono absolute -top-5 left-[-1px] bg-accent px-1.5 py-0.5 text-[10px] text-accent-ink">visitor 0.97</span>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const host = useRef<HTMLElement>(null);
  const [role, setRole] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRole((r) => (r + 1) % profile.roles.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" ref={host} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-10 pt-28">
      <CursorBox host={host} />
      <div className="wrap relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mono mb-12 flex w-fit max-w-full items-center gap-2.5 rounded-xl border border-line bg-card px-3.5 py-2 text-xs sm:mb-14"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Open to internships &amp; entry roles · {profile.location.split(",")[0]}
        </motion.p>

        <div className="relative inline-block max-w-full">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3rem,13vw,9.5rem)] font-extrabold leading-[0.88] tracking-[-0.045em]"
          >
            Sunkireddy
            <br />
            <span className="text-accent">Barath</span>
          </motion.h1>
          {/* static detection frame around the name */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="pointer-events-none absolute -inset-2 border border-dashed border-accent/70 sm:-inset-4"
          >
            <span className="mono absolute -top-6 left-[-1px] bg-accent px-2 py-0.5 text-[10px] text-accent-ink sm:text-xs">
              id:07 · engineer · 0.99
            </span>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 max-w-2xl">
          <p className="text-xl font-medium leading-snug sm:text-2xl md:text-3xl">
            I build
            {/* all roles share one grid cell so the line never jumps; own line avoids a gap on phones */}
            <span className="grid text-4xl leading-[1.15] sm:text-5xl md:text-6xl">
              {profile.roles.map((r, i) => (
                <motion.span
                  key={r}
                  aria-hidden={i !== role}
                  initial={false}
                  animate={{ opacity: i === role ? 1 : 0, y: i === role ? 0 : 10 }}
                  transition={{ duration: 0.35 }}
                  className="col-start-1 row-start-1 whitespace-nowrap font-extrabold text-accent"
                >
                  {r}
                </motion.span>
              ))}
            </span>
            systems that hold up past the demo.
          </p>
          <p className="mt-4 text-base text-mute md:text-lg">
            B.E. Computer Science at {profile.education.school} ({profile.education.years}), CGPA {profile.education.cgpa}. Production
            pipelines, agents and backends — measured, benchmarked, deployed.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={profile.resume} download className="btn btn-solid">
            Download resume <Arrow />
          </a>
          <a href="#projects" className="btn btn-ghost">See my work</a>
          <a href="#contact" className="btn btn-ghost">Hire me</a>
        </motion.div>

        <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l} className="bg-card p-5 md:p-6">
              <dt className="sr-only">{s.l}</dt>
              <dd className="text-4xl font-extrabold tracking-tight md:text-5xl">
                <Counter to={s.v} suffix={s.s} />
              </dd>
              <p className="label mt-2 !tracking-[.08em]">{s.l}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
