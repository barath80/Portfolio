"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { navItems, profile } from "@/lib/data";
import { lockScroll } from "@/lib/scroll";
import { Magnetic } from "./Interactions";
import { ThemeToggle } from "./ui";

export default function Header({ onPalette }: { onPalette: () => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navItems.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled || open ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between gap-3">
        <a href="#top" aria-label="Home" className="flex items-center gap-2.5 font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-sm text-accent-ink">SB</span>
          <span className="hidden sm:inline">Barath</span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navItems.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                active === n.id ? "bg-ink text-bg" : "text-mute hover:text-ink"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onPalette}
            className="mono hidden h-11 items-center gap-2 rounded-full border border-line bg-card px-4 text-xs text-mute transition hover:border-ink md:flex"
            aria-label="Open command menu"
          >
            Search <kbd className="rounded border border-line px-1.5 py-0.5">Ctrl K</kbd>
          </button>
          <Magnetic><a href={profile.resume} download className="btn btn-solid !min-h-11 !px-4 text-sm" data-cursor="GET">
            Resume
          </a></Magnetic>
          <ThemeToggle />
          <button
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card lg:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition-all ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-0.5 w-5 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="wrap flex h-[calc(100dvh-4rem)] flex-col justify-between bg-bg pb-8 pt-6 lg:hidden"
            aria-label="Mobile"
          >
            <ul>
              {navItems.map((n, i) => (
                <li key={n.id} className="border-b border-line">
                  <a href={`#${n.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-4 text-4xl font-extrabold tracking-tight">
                    <span className="mono text-xs text-accent">0{i + 1}</span>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3">
              <a href={profile.resume} download className="btn btn-solid">Download resume</a>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost">{profile.email}</a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
