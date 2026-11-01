"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Scene3D from "../Scene3D";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => <div className="h-full w-full" /> });

function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** WebGL centrepiece with a CSS-3D fallback (no WebGL, reduced motion, or Save-Data). */
export default function HeroVisual({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"pending" | "gl" | "css">("pending");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saver = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setMode(!reduce && !saver && webglOk() ? "gl" : "css");
  }, []);

  return (
    <div className={className} role="img" aria-label="Interactive 3D object">
      {mode === "gl" && <HeroScene />}
      {mode === "css" && <Scene3D className="h-full w-full" />}
    </div>
  );
}
