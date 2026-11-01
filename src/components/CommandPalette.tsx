"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";
import { navItems, profile, projects } from "@/lib/data";

type Cmd = { label: string; hint: string; run: () => void };

export default function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const cmds = useMemo<Cmd[]>(() => {
    const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    const ext = (u: string) => () => window.open(u, "_blank", "noopener,noreferrer");
    return [
      ...navItems.map((n) => ({ label: `Go to ${n.label}`, hint: "Section", run: go(n.id) })),
      { label: "Download resume", hint: "PDF", run: () => { const a = document.createElement("a"); a.href = profile.resume; a.download = ""; a.click(); } },
      { label: "Send email", hint: profile.email, run: () => (location.href = `mailto:${profile.email}`) },
      { label: "Open LinkedIn", hint: "Link", run: ext(profile.linkedin) },
      { label: "Open GitHub", hint: "Link", run: ext(profile.github) },
      { label: `Toggle ${resolvedTheme === "dark" ? "light" : "dark"} mode`, hint: "Theme", run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark") },
      ...projects.map((p) => ({ label: `Repo: ${p.name}`, hint: "GitHub", run: ext(p.repo) })),
    ];
  }, [resolvedTheme, setTheme]);

  const list = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQ("");
      setSel(0);
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);

  const exec = (c?: Cmd) => {
    if (!c) return;
    setOpen(false);
    setTimeout(c.run, 120);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
        >
          <motion.div
            initial={{ y: -16, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -16, scale: 0.97 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-card shadow-2xl"
          >
            <input
              ref={input}
              value={q}
              onChange={(e) => { setQ(e.target.value); setSel(0); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s + 1, list.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s - 1, 0)); }
                if (e.key === "Enter") exec(list[sel]);
              }}
              placeholder="Type a command or search…"
              className="w-full border-b border-line bg-transparent px-5 py-4 text-base outline-none"
            />
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {list.length === 0 && <li className="px-4 py-6 text-center text-sm text-mute">No results</li>}
              {list.map((c, i) => (
                <li key={c.label}>
                  <button
                    onMouseEnter={() => setSel(i)}
                    onClick={() => exec(c)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm ${i === sel ? "bg-accent text-accent-ink" : ""}`}
                  >
                    <span className="font-medium">{c.label}</span>
                    <span className="mono text-xs opacity-70">{c.hint}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
