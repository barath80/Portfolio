"use client";

import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useState } from "react";
import { introSeen, lockScroll, markIntroDone, scrollToId } from "@/lib/scroll";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/** True once the intro has finished (or was skipped / already seen this session). */
export function useIntroDone() {
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (introSeen() || reduce) setDone(true);
    const h = () => setDone(true);
    window.addEventListener("intro:done", h);
    return () => window.removeEventListener("intro:done", h);
  }, [reduce]);
  return done;
}

/** Lenis smooth scrolling + in-page anchor handling. Touch devices keep native momentum. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    let raf = 0;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const click = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href")!.slice(1);
      if (id === "top") { e.preventDefault(); lenis.scrollTo(0, { duration: 1.4 }); }
      else if (document.getElementById(id)) { e.preventDefault(); scrollToId(id); }
    };
    document.addEventListener("click", click);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("click", click); lenis.destroy(); delete window.__lenis; };
  }, []);
  return null;
}

/** Skippable intro. Shown once per session, never for reduced-motion users. */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [pct, setPct] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (introSeen() || reduce) { setShow(false); markIntroDone(); return; }
    lockScroll(true);
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1500, 1);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(finish, 250);
    };
    raf = requestAnimationFrame(tick);
    const finish = () => { cancelAnimationFrame(raf); setShow(false); lockScroll(false); markIntroDone(); };
    (window as unknown as { __skipIntro?: () => void }).__skipIntro = finish;
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7 }} className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-3xl font-extrabold text-accent-ink">
            SB
          </motion.div>
          <p className="mono mt-6 text-xs tracking-[.3em] text-mute">LOADING PORTFOLIO</p>
          <div className="mt-4 h-[3px] w-56 overflow-hidden rounded-full bg-line">
            <div className="h-full bg-gradient-to-r from-accent to-accent2" style={{ width: `${pct}%` }} />
          </div>
          <p className="mono mt-3 text-xs text-mute">{pct}%</p>
          <button
            onClick={() => (window as unknown as { __skipIntro?: () => void }).__skipIntro?.()}
            className="mono absolute bottom-[max(2rem,env(safe-area-inset-bottom))] rounded-full border border-line px-5 py-3 text-xs tracking-widest text-mute transition hover:border-accent hover:text-ink"
          >
            SKIP INTRO
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Desktop-only cursor: dot + trailing ring that grows on interactive elements and shows contextual labels. */
export function Cursor() {
  const [fine, setFine] = useState(false);
  const [label, setLabel] = useState("");
  const [hot, setHot] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setFine(ok);
    if (!ok) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY); setVisible(true);
      const t = e.target as Element | null;
      const lab = t?.closest?.("[data-cursor]")?.getAttribute("data-cursor") ?? "";
      setLabel(lab);
      setHot(!!t?.closest?.("a,button,summary,[role=button]"));
    };
    const out = (e: MouseEvent) => { if (!e.relatedTarget) setVisible(false); };
    window.addEventListener("pointermove", move);
    document.addEventListener("mouseout", out);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseout", out);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!fine) return null;
  const size = label ? 78 : hot ? 54 : 34;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90]" style={{ opacity: visible ? 1 : 0, transition: "opacity .2s" }}>
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <span className="absolute -left-[3px] -top-[3px] block h-1.5 w-1.5 rounded-full bg-accent" />
      </motion.div>
      <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0">
        <motion.div
          animate={{ width: size, height: size, x: -size / 2, y: -size / 2, backgroundColor: label ? "var(--accent)" : "rgba(0,0,0,0)" }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="grid place-items-center rounded-full border border-accent"
        >
          {label && <span className="mono text-[10px] font-bold tracking-widest text-accent-ink">{label}</span>}
        </motion.div>
      </motion.div>
    </div>
  );
}

/** Wrapper that pulls its child toward the pointer. */
export function Magnetic({ children, className = "", strength = 0.3 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const x = useSpring(0, { stiffness: 220, damping: 16 });
  const y = useSpring(0, { stiffness: 220, damping: 16 });
  return (
    <motion.div
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}
