"use client";

import { useState } from "react";
import CommandPalette from "@/components/CommandPalette";
import { Cursor, Preloader, SmoothScroll } from "@/components/Interactions";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { About, AchievementsSection, ExperienceSection, ProjectsSection, SkillsSection } from "@/components/Sections";
import { Depth, Divider, ScrollProgress } from "@/components/ui";
import { profile } from "@/lib/data";

export default function Home() {
  const [palette, setPalette] = useState(false);
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Header onPalette={() => setPalette(true)} />
      <CommandPalette open={palette} setOpen={setPalette} />
      <main>
        <Hero />
        <Depth><About /></Depth>
        <Divider />
        <Depth><ExperienceSection /></Depth>
        <Divider />
        <Depth><ProjectsSection /></Depth>
        <Divider />
        <Depth><SkillsSection /></Depth>
        <Divider />
        <Depth><AchievementsSection /></Depth>
        <Divider />
        <Depth><Contact /></Depth>
      </main>
      <footer className="border-t border-line py-10">
        <div className="wrap flex flex-col gap-6 text-sm text-mute md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <nav aria-label="Footer" className="mono flex flex-wrap gap-x-6 gap-y-3 text-xs">
            <a className="transition hover:text-ink" href={`mailto:${profile.email}`}>Email</a>
            <a className="transition hover:text-ink" href={`tel:+91${profile.phone}`}>Call</a>
            <a className="transition hover:text-ink" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="transition hover:text-ink" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="transition hover:text-ink" href={profile.resume} download>Resume</a>
            <a className="transition hover:text-ink" href="#top">Back to top</a>
          </nav>
        </div>
      </footer>
    </>
  );
}
