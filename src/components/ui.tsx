"use client";

import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

/** Content tilts up out of the page in 3D as it scrolls into view. `x` makes it swing in from a side. */
export function Reveal({ children, delay = 0, className, x = 0 }: { children: React.ReactNode; delay?: number; className?: string; x?: number }) {
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1000, transformOrigin: "50% 100%" }}
      initial={{ opacity: 0, y: 44, x, rotateX: 12, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, x: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Card that tilts toward the pointer with a moving highlight. Touch devices skip it. */
export function Tilt({ children, className = "", max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const rx = useSpring(0, { stiffness: 180, damping: 18 });
  const ry = useSpring(0, { stiffness: 180, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 62%)`;
  const opacity = useMotionValue(0);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
    opacity.set(1);
  };
  const leave = () => { rx.set(0); ry.set(0); opacity.set(0); };
  return (
    <motion.div
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div aria-hidden style={{ background: glare, opacity }} className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity" />
    </motion.div>
  );
}

/** Slowly spinning CSS-3D object that drifts at a different speed than the page (parallax). */
export function FloatShape({ kind = "cube", size = 90, className = "" }: { kind?: "cube" | "gyro"; size?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute z-0 opacity-70 [perspective:900px] ${className}`}>
      <motion.div style={{ y }}>
        {kind === "cube" ? (
          <div className="cube" style={{ ["--s" as string]: `${size}px` }}>
            <i /><i /><i /><i /><i /><i />
          </div>
        ) : (
          <div className="gyro" style={{ ["--s" as string]: `${size}px` }}>
            <i /><i /><i /><i />
          </div>
        )}
      </motion.div>
    </div>
  );
}

/** Animated rule between sections: draws itself, with a glint travelling along it. */
export function Divider() {
  return (
    <div aria-hidden className="wrap">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-20%" }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-px origin-left bg-gradient-to-r from-transparent via-accent to-transparent"
      >
        <span className="travel absolute top-1/2 h-1.5 w-16 -translate-y-1/2 rounded-full bg-accent2 opacity-80 blur-[3px]" style={{ animation: "travel 5s ease-in-out infinite alternate" }} />
      </motion.div>
    </div>
  );
}

export function SectionHead({ index, title, kicker }: { index: string; title: string; kicker?: string }) {
  return (
    <Reveal className="mb-10 md:mb-16">
      <p className="label mb-3">
        <span className="text-accent">/{index}</span> &nbsp;{kicker}
      </p>
      <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-7xl">{title}</h2>
    </Reveal>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent to-accent2" />;
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";
  // circular reveal from the button using the View Transitions API; plain switch elsewhere
  const toggle = (e: React.MouseEvent) => {
    const next = dark ? "light" : "dark";
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
    if (!doc.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setTheme(next);
    const x = e.clientX, y = e.clientY;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    doc.startViewTransition(() => {
      document.documentElement.classList.toggle("dark", next === "dark");
      setTheme(next);
    }).ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" },
      );
    }).catch(() => {});
  };
  return (
    <button
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      data-cursor=""
      onClick={toggle}
      className={`grid h-11 w-11 place-items-center rounded-full border border-line bg-card transition hover:border-ink ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        )}
      </svg>
    </button>
  );
}

export const Arrow = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
