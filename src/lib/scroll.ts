import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Smooth-scroll to a section id (Lenis when active, native otherwise). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
}

export function lockScroll(lock: boolean) {
  if (window.__lenis) (lock ? window.__lenis.stop() : window.__lenis.start());
  document.body.style.overflow = lock ? "hidden" : "";
}

const KEY = "sb-intro-seen";
export const introSeen = () => {
  try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; }
};
export const markIntroDone = () => {
  try { sessionStorage.setItem(KEY, "1"); } catch { /* private mode */ }
  window.dispatchEvent(new Event("intro:done"));
};
