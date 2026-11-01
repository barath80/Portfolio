"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { skills } from "@/lib/data";
import { Arrow, Reveal, Tilt } from "./ui";

/* ---------- tech tiles: real logo when one exists, monogram otherwise ---------- */

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons";
// resume name -> devicon folder/file. Anything not listed (ONNX, YOLO, RAG, ...) gets a monogram instead of a made-up logo.
const icons: Record<string, string> = {
  C: "c/c-original", "C++": "cplusplus/cplusplus-original", Python: "python/python-original", Java: "java/java-original",
  JavaScript: "javascript/javascript-original", TypeScript: "typescript/typescript-original",
  NumPy: "numpy/numpy-original", Pandas: "pandas/pandas-original", "Scikit-learn": "scikitlearn/scikitlearn-original",
  TensorFlow: "tensorflow/tensorflow-original", PyTorch: "pytorch/pytorch-original", Keras: "keras/keras-original", OpenCV: "opencv/opencv-original",
  "Node.js": "nodejs/nodejs-original", "Express.js": "express/express-original", Flask: "flask/flask-original", FastAPI: "fastapi/fastapi-original",
  MySQL: "mysql/mysql-original", MongoDB: "mongodb/mongodb-original", PostgreSQL: "postgresql/postgresql-original", Redis: "redis/redis-original",
  HTML: "html5/html5-original", CSS: "css3/css3-original", "React.js": "react/react-original", "Next.js": "nextjs/nextjs-original",
  "Angular.js": "angularjs/angularjs-original", Bootstrap: "bootstrap/bootstrap-original", "Tailwind CSS": "tailwindcss/tailwindcss-original",
  Figma: "figma/figma-original", Canva: "canva/canva-original",
  Git: "git/git-original", GitHub: "github/github-original", Docker: "docker/docker-original", Jenkins: "jenkins/jenkins-original",
  Kubernetes: "kubernetes/kubernetes-plain", "Linux (Ubuntu)": "ubuntu/ubuntu-plain", Pytest: "pytest/pytest-original",
};
// these logos are black, so they are inverted on the dark theme
const darkLogos = new Set(["Express.js", "Flask", "Next.js", "GitHub"]);
// multi-colour logos with dark parts: keep their colours, sit them on a light backing in dark mode
const lightBacked = new Set(["Pandas", "Java", "Jenkins", "Bootstrap", "Pytest"]);

function TechTile({ name }: { name: string }) {
  const [broken, setBroken] = useState(false);
  const file = icons[name];
  const mono = name.replace(/[^A-Za-z0-9+]/g, "").slice(0, 2);
  return (
    <span className="tech group inline-flex items-center gap-2.5 rounded-xl border border-line bg-bg/60 py-1.5 pl-1.5 pr-3.5 text-[13px] font-medium transition duration-300 hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_8px_24px_-10px_var(--accent)]">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-line bg-card transition group-hover:border-accent ${lightBacked.has(name) ? "dark:!bg-white/90" : ""}`}>
        {file && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${DEVICON}/${file}.svg`} alt="" width={20} height={20} loading="lazy" decoding="async" onError={() => setBroken(true)} className={`h-5 w-5 ${darkLogos.has(name) ? "dark:invert" : ""}`} />
        ) : (
          <span className="grad-text mono text-[11px] font-bold">{mono}</span>
        )}
      </span>
      {name}
    </span>
  );
}

/* ---------- skills: orbit constellation + category filter ---------- */

type Ring = { r: number; dur: number; groups: string[]; nodes: string[] };

// every node below is taken from the skills list on the resume
const rings: Ring[] = [
  { r: 62, dur: 26, groups: ["Machine Learning and AI", "Generative and Agentic AI"], nodes: ["PyTorch", "ONNX", "OpenCV", "XGBoost", "RAG", "LangGraph"] },
  { r: 208 / 2 + 6, dur: 38, groups: ["Backend and Database", "DevOps, Cloud and Testing"], nodes: ["FastAPI", "PostgreSQL", "Redis", "Node.js", "Docker", "Kubernetes"] },
  { r: 150, dur: 52, groups: ["Programming Languages", "Frontend and Design"], nodes: ["Python", "TypeScript", "React.js", "Next.js", "Java", "C++"] },
];

function Constellation({ active }: { active: string }) {
  return (
    <svg viewBox="0 0 400 400" className="mx-auto aspect-square w-full max-w-[420px]" role="img" aria-label="Orbit of core technologies">
      <defs>
        <radialGradient id="core" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="34" fill="url(#core)" />
      <text x="200" y="205" textAnchor="middle" style={{ font: "700 13px var(--font-mono)", fill: "var(--ink)" }}>SB</text>
      {rings.map((ring, ri) => {
        const lit = active === "All" || ring.groups.includes(active);
        return (
          <g key={ri} style={{ opacity: lit ? 1 : 0.18, transition: "opacity .5s" }}>
            <circle cx="200" cy="200" r={ring.r} fill="none" stroke="var(--line)" strokeDasharray="3 6" />
            <g className="orbit" style={{ animationDuration: `${ring.dur}s`, animationDirection: ri % 2 ? "reverse" : "normal" }}>
              {ring.nodes.map((n, i) => {
                const a = (i / ring.nodes.length) * Math.PI * 2;
                // rounded: Node and browsers differ in the last float digit, which trips hydration
                const x = Math.round((200 + Math.cos(a) * ring.r) * 100) / 100;
                const y = Math.round((200 + Math.sin(a) * ring.r) * 100) / 100;
                return (
                  <g key={n} transform={`translate(${x} ${y})`}>
                    <g className="orbit" style={{ animationDuration: `${ring.dur}s`, animationDirection: ri % 2 ? "normal" : "reverse" }}>
                      <circle r="3.5" fill={ri === 1 ? "var(--accent-2)" : "var(--accent)"} />
                      <text y="-9" textAnchor="middle" style={{ font: "500 10.5px var(--font-mono)", fill: "var(--ink)" }}>{n}</text>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

export function SkillsExplorer() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? skills : skills.filter((s) => s.group === active);
  const tabs = ["All", ...skills.map((s) => s.group)];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <Reveal>
            <Constellation active={active} />
          </Reveal>
        </div>
      </div>

      <div className="min-w-0 lg:col-span-7">
        {/* horizontally scrollable on phones, wrapping on larger screens */}
        <div role="tablist" aria-label="Skill categories" className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
          {tabs.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={active === t}
              onClick={() => setActive(t)}
              className={`mono shrink-0 rounded-full border px-4 py-2.5 text-xs transition ${
                active === t ? "border-transparent bg-gradient-to-r from-accent to-accent2 font-bold text-accent-ink" : "border-line bg-card text-mute hover:border-accent hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {shown.map((g) => (
              <motion.div
                key={g.group}
                layout
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={active === "All" && g.items.length > 9 ? "sm:col-span-2" : active !== "All" ? "sm:col-span-2" : ""}
              >
                <Tilt max={4} className="h-full rounded-2xl">
                  <div className="gcard h-full rounded-2xl border border-line bg-card p-5">
                    <p className="label mb-4 !text-accent">{g.group}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((s) => (
                        <TechTile key={s} name={s} />
                      ))}
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------- live GitHub repositories (real data, fails quietly) ---------- */

type Repo = { id: number; name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean };

export function GithubRepos({ user }: { user: string }) {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctl = new AbortController();
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`, { signal: ctl.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Repo[]) => setRepos(d.filter((r) => !r.fork).slice(0, 6)))
      .catch((e) => { if (e?.name !== "AbortError") setFailed(true); });
    return () => ctl.abort();
  }, [user]);

  return (
    <div className="mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h3 className="label">Latest on GitHub</h3>
        <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer" className="mono text-xs text-mute underline-offset-4 hover:text-ink hover:underline">
          github.com/{user}
        </a>
      </div>

      {failed && (
        <p className="rounded-2xl border border-line bg-card p-5 text-sm text-mute">
          Live repository data is unavailable right now. Everything is on{" "}
          <a className="font-semibold text-ink underline" href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">my GitHub profile</a>.
        </p>
      )}

      {!failed && !repos && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 animate-pulse rounded-2xl border border-line bg-card" />)}
        </div>
      )}

      {repos && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r) => (
            <li key={r.id}>
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="OPEN"
                className="gcard group flex h-full flex-col rounded-2xl border border-line bg-card p-5 transition hover:-translate-y-1"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="truncate font-bold">{r.name}</span>
                  <Arrow className="shrink-0 text-mute transition group-hover:text-accent" />
                </span>
                <span className="mt-2 line-clamp-2 text-sm text-mute">{r.description ?? "No description provided."}</span>
                <span className="mono mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4 text-[11px] text-mute">
                  {r.language && <span className="text-ink">{r.language}</span>}
                  {r.stargazers_count > 0 && <span>{r.stargazers_count} stars</span>}
                  <span>updated {new Date(r.pushed_at).toLocaleDateString("en", { month: "short", year: "numeric" })}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
