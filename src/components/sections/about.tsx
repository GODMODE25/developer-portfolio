"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Cpu, Terminal, Compass, LineChart, Code } from "lucide-react";
import { siteConfig } from "@/content/site";
import Image from "next/image";

export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Connect scroll progress of this container to fill up the timeline track line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const getTimelineIcon = (id: string) => {
    switch (id) {
      case "curiosity":
        return Compass;
      case "learning":
        return Code;
      case "building":
        return Terminal;
      case "investing":
        return LineChart;
      case "engineering":
        return Cpu;
      default:
        return Cpu;
    }
  };

  return (
    <section
      id="about"
      ref={containerRef}
      className="page-section bg-cyber-black relative z-10 border-b border-white/5 overflow-hidden"
    >
      {/* Decorative gradient sphere */}
      <div className="absolute right-0 top-1/3 w-[400px] h-[400px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />

      <div className="section-shell-narrow">
        {/* Section Heading */}
        <div className="text-center space-y-4 mb-20">
          <div className="inline-block text-xs font-mono tracking-widest text-neon uppercase">
            [01 // BIOGRAPHY_LOG]
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase">
            Evolution Path
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-400 font-mono mt-4">
            A chronological mapping of my programming journey from game modding scripts to low-latency infrastructure design.
          </p>
        </div>
        <div className="w-full h-6"></div>

        {/* Narrative & Profile Box */}
        <div className="flex flex-col items-center gap-10 mb-24">
          {/* Profile Picture */}
          <div className="flex-shrink-0 relative w-32 h-32 md:w-48 md:h-48 rounded-full p-1 border border-white/10 bg-cyber-black overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] group mb-8 mt-8">
            <div className="absolute inset-0 bg-neon/10 animate-pulse" />
            <div className="relative w-full h-full rounded-full overflow-hidden border border-white/5">
              <Image
                src={siteConfig.avatar}
                alt={siteConfig.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Narrative Paragraph */}
          <div className="p-7 rounded-xl glass-panel border-white/5 text-slate-300 font-sans text-sm md:text-base leading-loose relative flex-1 text-left mt-12">
            <div className="absolute top-0 left-0 h-[2px] bg-neon w-16" style={{ backgroundColor: "var(--neon-accent)" }} />
            {siteConfig.aboutNarrative}
          </div>
        </div>
        <div className="w-full h-6"></div>

        {/* Timeline Flow */}
        <div className="relative max-w-3xl mx-auto space-y-60">
          {/* Vertical progress bar track line */}
          <div className="absolute left-5 md:left-7 top-4 bottom-4 w-[2px] bg-neutral-800" />

          {/* Animated filled progress bar */}
          <motion.div
            className="absolute left-5 md:left-7 top-4 bottom-4 w-[2px] origin-top"
            style={{
              scaleY,
              backgroundColor: "var(--neon-accent)",
              boxShadow: "0 0 10px var(--neon-accent)"
            }}
          />

          {siteConfig.timeline.map((item, index) => {
            const Icon = getTimelineIcon(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative grid grid-cols-[2.75rem_minmax(0,1fr)] md:grid-cols-[3.5rem_minmax(0,1fr)] gap-5 md:gap-8 text-left"
              >
                {/* Timeline node icon */}
                <div className="relative z-10 mt-1 flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-full bg-cyber-black border border-neutral-700 text-slate-400 group-hover:text-neon group-hover:border-neon transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </div>

                {/* Event details */}
                <div className="space-y-6 pb-2">

                  {/* Metadata and timeline header */}
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 font-mono justify-start">
                    <span className="text-xs text-neon font-bold">{item.year}</span>
                    <span className="hidden md:inline text-neutral-600">{"//"}</span>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 bg-white/5 text-slate-300">
                      {item.stage}
                    </span>
                  </div>

                  {/* Narrative details */}
                  <h3 className="text-xl md:text-2xl font-mono font-semibold text-white tracking-wide">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-loose font-sans max-w-2xl">
                    {item.description}
                  </p>

                  {/* Bullet achievements */}
                  <ul className="space-y-3 pl-4 border-l border-neutral-800 text-xs text-slate-300 font-mono text-left">
                    {item.accomplishments.map((acc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-neon select-none">&gt;</span>
                        <span>{acc}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Era Technologies */}
                  <div className="flex flex-wrap gap-2 pt-6 pb-12 justify-start">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/5 bg-cyber-dark text-slate-400 group-hover:border-neon/30 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {index < siteConfig.timeline.length - 1 && (
                    <div
                      aria-hidden="true"
                      style={{ height: "4rem" }}
                    />
                  )}

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default About;
