"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/* The UrbanTrace AI pipeline as a stack of floating layers. Real stages from the resume. */
const layers = [
  { n: "01", t: "Frame", s: "camera feed" },
  { n: "02", t: "Detect", s: "YOLO11m" },
  { n: "03", t: "Track", s: "ByteTrack" },
  { n: "04", t: "Read", s: "CCT-OCR" },
  { n: "05", t: "Store", s: "PostGIS" },
];

export default function Scene3D({ className = "" }: { className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 60, damping: 16 });
  const rz = useSpring(mx, { stiffness: 60, damping: 16 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 36);
      my.set((e.clientY / window.innerHeight - 0.5) * -22);
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div aria-hidden className={`[perspective:1400px] ${className}`}>
      <div className="sway h-full w-full" style={{ animation: "sway 9s ease-in-out infinite" }}>
        <motion.div
          style={{ rotateX: rx, rotateZ: rz, transformStyle: "preserve-3d", ["--b" as string]: "58deg" }}
          className="relative mx-auto h-full w-full [transform-style:preserve-3d]"
        >
          <div className="absolute left-1/2 top-1/2 h-[150px] w-[210px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-36deg)]">
            {layers.map((l, i) => (
              <motion.div
                key={l.n}
                initial={{ opacity: 0, z: 0 }}
                animate={{ opacity: 1, z: (i - 2) * 54 }}
                transition={{ delay: 0.5 + i * 0.12, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 rounded-xl border border-accent/60 p-3 shadow-[0_0_40px_-12px_var(--accent)]"
                style={{
                  background: `linear-gradient(135deg, color-mix(in srgb, var(--accent) ${22 - i * 3}%, var(--card)), color-mix(in srgb, var(--accent-2) ${12 - i}%, var(--card)))`,
                }}
              >
                <div className="mono flex items-start justify-between text-[10px] leading-none">
                  <span className="text-ink">{l.n} · {l.t}</span>
                  <span className="text-mute">{l.s}</span>
                </div>
                {i === 1 && <span className="absolute bottom-5 left-6 h-9 w-14 border border-accent" />}
                {i === 2 && (
                  <svg className="absolute inset-x-4 bottom-4 h-10 w-[calc(100%-2rem)]" viewBox="0 0 160 40" fill="none">
                    <path d="M0 30 C30 28 40 10 70 14 S120 30 160 8" stroke="var(--accent-2)" strokeWidth="2" />
                  </svg>
                )}
                {i === 3 && (
                  <span className="absolute bottom-4 left-4 flex h-8 w-24 items-center gap-1 border border-accent px-2">
                    {[7, 11, 5, 9, 6, 10].map((h, k) => <i key={k} className="w-1.5 bg-accent" style={{ height: h * 2 }} />)}
                  </span>
                )}
                {i === 4 && <span className="absolute bottom-4 left-4 h-8 w-8 rounded-full border border-accent2 bg-accent2/30" />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
