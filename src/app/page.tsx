"use client";

import { useState } from "react";
import CommandPalette from "@/components/CommandPalette";
import Contact from "@/components/Contact";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import { About, AchievementsSection, ExperienceSection, ProjectsSection, SkillsSection } from "@/components/Sections";
import { ScrollProgress } from "@/components/ui";
import { profile } from "@/lib/data";

export default function Home() {
  const [palette, setPalette] = useState(false);
  return (
    <>
      <ScrollProgress />
      <Header onPalette={() => setPalette(true)} />
      <CommandPalette open={palette} setOpen={setPalette} />
      <main>
        <Hero />
        <About />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <AchievementsSection />
        <Contact />
      </main>
      <footer className="border-t border-line py-8">
        <div className="wrap flex flex-col items-center justify-between gap-3 text-sm text-mute sm:flex-row">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p className="mono text-xs">Built with Next.js · Tailwind · Framer Motion</p>
        </div>
      </footer>
    </>
  );
}
