"use client";

import { useState } from "react";
import { profile } from "@/lib/data";
import { Arrow, FloatShape, Reveal, SectionHead, Tilt } from "./ui";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line bg-bg px-4 py-3.5 text-base outline-none transition placeholder:text-mute/60 focus:border-accent";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const d = new FormData(form);
    setStatus("sending");
    try {
      // Delivered straight to the inbox via FormSubmit (no server or API key needed).
      const res = await fetch(`https://formsubmit.co/ajax/${profile.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: d.get("name"),
          email: d.get("email"),
          message: d.get("message"),
          _subject: `Portfolio: ${d.get("subject")} — from ${d.get("name")}`,
          _replyto: d.get("email"),
          _template: "table",
          _captcha: "false",
          _honey: d.get("_honey"),
        }),
      });
      const json = await res.json().catch(() => null);
      // FormSubmit answers 200 with success:"false" until the inbox is activated, so check the body too
      if (!res.ok || json?.success === "false" || json?.success === false) throw new Error();
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "Phone", value: profile.phone, href: `tel:+91${profile.phone}` },
    { label: "LinkedIn", value: "sunkireddy-barath", href: profile.linkedin, ext: true },
    { label: "GitHub", value: "barath80", href: profile.github, ext: true },
  ];

  return (
    <section id="contact" className="section">
      <FloatShape kind="gyro" size={110} className="left-[-10px] top-28 !opacity-40 sm:left-[5%] sm:!opacity-60 md:top-36" />
      <div className="wrap">
        <SectionHead index="06" kicker="Contact" title="Let's build something." />
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <Reveal className="lg:col-span-2">
            <p className="text-lg text-mute">
              Hiring for SDE, ML, Generative AI or Agentic AI? Send a note — it lands directly in my inbox and I reply fast.
            </p>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-14 items-center justify-between gap-4 py-4"
                  >
                    <span>
                      <span className="label block">{l.label}</span>
                      <span className="break-all font-semibold">{l.value}</span>
                    </span>
                    <Arrow className="shrink-0 text-mute transition group-hover:text-accent" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mono mt-5 text-xs text-mute">Based in {profile.location}</p>
            <a href={profile.resume} download className="btn btn-solid mt-6 w-full sm:w-auto">
              Download resume (PDF)
            </a>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <Tilt max={2} className="rounded-3xl"><form onSubmit={submit} className="gcard space-y-4 rounded-3xl border border-line bg-card p-5 sm:p-8">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="label mb-2 block">Your name</span>
                  <input name="name" required autoComplete="name" className={field} placeholder="Jane Doe" />
                </label>
                <label className="block">
                  <span className="label mb-2 block">Your email</span>
                  <input name="email" type="email" required autoComplete="email" className={field} placeholder="jane@company.com" />
                </label>
              </div>
              <label className="block">
                <span className="label mb-2 block">Subject</span>
                <input name="subject" required className={field} placeholder="Internship opportunity" />
              </label>
              <label className="block">
                <span className="label mb-2 block">Message</span>
                <textarea name="message" required rows={6} className={`${field} resize-y`} placeholder="Tell me about the role or project…" />
              </label>
              {/* honeypot: bots fill it, humans never see it */}
              <input name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <button type="submit" disabled={status === "sending"} className="btn btn-solid w-full disabled:opacity-60">
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              <p role="status" aria-live="polite" className="min-h-6 text-sm">
                {status === "sent" && <span className="font-semibold text-accent">Sent. It&apos;s in my inbox and I&apos;ll reply soon.</span>}
                {status === "error" && (
                  <span className="text-mute">
                    Couldn&apos;t send right now. Please email{" "}
                    <a className="font-semibold text-ink underline" href={`mailto:${profile.email}`}>{profile.email}</a> directly.
                  </span>
                )}
              </p>
            </form></Tilt>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
