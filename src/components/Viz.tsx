"use client";

import { motion } from "framer-motion";

/* Hand-built diagrams. Every figure comes from the resume bullets for that project. */

const view = { once: true, margin: "-40px" } as const;
const T = { fontFamily: "var(--font-mono)", fontSize: 10, fill: "var(--mute)" } as const;

function Bar({ y, w, label, value, hot, i }: { y: number; w: number; label: string; value: string; hot?: boolean; i: number }) {
  return (
    <g>
      <text x="0" y={y - 6} style={T}>{label}</text>
      <rect x="0" y={y} width="300" height="12" rx="2" fill="var(--line)" />
      <motion.rect
        x="0" y={y} height="12" rx="2"
        fill={hot ? "var(--accent)" : "var(--ink)"}
        initial={{ width: 0 }}
        whileInView={{ width: Math.max(w, 1.5) }}
        viewport={view}
        transition={{ duration: 1.1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
      />
      <text x="308" y={y + 10} style={{ ...T, fill: "var(--ink)", fontWeight: 700 }}>{value}</text>
    </g>
  );
}

function Urban() {
  const boxes = [
    { x: 14, y: 52, id: "id 41" },
    { x: 92, y: 40, id: "id 57" },
    { x: 170, y: 58, id: "id 88" },
  ];
  return (
    <svg viewBox="0 0 360 130" className="h-full w-full" role="img" aria-label="Three tracker IDs merged into one vehicle">
      <path d="M0 100H360M0 112H360" stroke="var(--line)" strokeDasharray="6 8" />
      {boxes.map((b, i) => (
        <g key={b.id}>
          <motion.rect
            x={b.x} y={b.y} width="64" height="38" fill="none" stroke="var(--mute)" strokeDasharray="4 4"
            initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ delay: i * 0.25, duration: 0.6 }}
          />
          <text x={b.x} y={b.y - 5} style={T}>{b.id}</text>
        </g>
      ))}
      <motion.path
        d="M78 71 H110 M156 59 H186 M234 77 H262" stroke="var(--accent)" strokeWidth="2" fill="none"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={view} transition={{ delay: 0.9, duration: 0.8 }}
      />
      <motion.rect
        x="262" y="50" width="84" height="48" fill="none" stroke="var(--accent)" strokeWidth="2"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={view} transition={{ delay: 1.5 }}
      />
      <text x="262" y="44" style={{ ...T, fill: "var(--accent)", fontWeight: 700 }}>1 vehicle</text>
      <text x="0" y="14" style={T}>110 tracker IDs</text>
      <text x="262" y="122" style={T}>28 vehicles</text>
    </svg>
  );
}

function Agri() {
  return (
    <svg viewBox="0 0 360 130" className="h-full w-full" role="img" aria-label="Accuracy bars">
      <g transform="translate(0 22)">
        <Bar i={0} y={0} w={279} value="93%" label="crop model accuracy, 22 crops" hot />
        <Bar i={1} y={34} w={273} value="0.91" label="yield model R-squared" />
        <Bar i={2} y={68} w={294.3} value="98.1%" label="disease model, unseen data" hot />
      </g>
    </svg>
  );
}

function Sentinel() {
  return (
    <svg viewBox="0 0 360 130" className="h-full w-full" role="img" aria-label="False recovery claims fell from 72 percent to 0">
      <g transform="translate(0 28)">
        <Bar i={0} y={0} w={216} value="72%" label="false recovery claims, before contracts" />
        <Bar i={1} y={44} w={0} value="0%" label="after rehearsal + SLO verification" hot />
      </g>
      <text x="0" y="122" style={T}>root cause named correctly 99% over 20 seeds</text>
    </svg>
  );
}

function Contexta() {
  const n = 5;
  return (
    <svg viewBox="0 0 360 130" className="h-full w-full" role="img" aria-label="Five agents feeding a signed hash chain">
      {Array.from({ length: n }).map((_, i) => (
        <g key={i}>
          <motion.circle
            cx={36 + i * 72} cy="26" r="9" fill="var(--accent)"
            initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={view} transition={{ delay: i * 0.12, type: "spring" }}
          />
          <path d={`M${36 + i * 72} 36V68`} stroke="var(--line)" strokeWidth="2" />
          <motion.rect
            x={8 + i * 72} y="68" width="56" height="34" rx="3" fill="var(--card)" stroke="var(--ink)" strokeWidth="1.5"
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ delay: 0.5 + i * 0.12 }}
          />
          <text x={14 + i * 72} y="89" style={{ ...T, fontSize: 9 }}>#{`${(i * 3 + 7).toString(16)}a${i}f`}</text>
          {i < n - 1 && <path d={`M${64 + i * 72} 85H${80 + i * 72}`} stroke="var(--ink)" strokeWidth="1.5" />}
        </g>
      ))}
      <text x="0" y="122" style={T}>5 agents → consensus → Ed25519-signed hash chain</text>
    </svg>
  );
}

function Veritas() {
  return (
    <svg viewBox="0 0 360 130" className="h-full w-full" role="img" aria-label="Benchmark score 1.00 against 0.11">
      <g transform="translate(0 26)">
        <Bar i={0} y={0} w={300} value="1.00" label="VERITAS, TemporalEvidenceBench" hot />
        <Bar i={1} y={44} w={33} value="0.11" label="basic RAG baseline" />
      </g>
      <text x="0" y="122" style={T}>audit 50/50 correct · 12/12 refusals</text>
    </svg>
  );
}

const map: Record<string, () => React.JSX.Element> = { "01": Urban, "02": Agri, "03": Sentinel, "04": Contexta, "05": Veritas };

export default function Viz({ id }: { id: string }) {
  const C = map[id];
  return (
    <div className="mt-7 aspect-[360/130] w-full overflow-hidden rounded-xl border border-line bg-bg p-3 sm:p-4 lg:mt-0">
      {C && <C />}
    </div>
  );
}
