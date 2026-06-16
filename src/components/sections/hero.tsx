"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Github, Terminal as TerminalIcon } from "lucide-react";
import { siteConfig } from "@/content/site";
import { CanvasParticles } from "../ui/canvas-particles";

interface HeroProps {
  onOpenTerminal: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenTerminal }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const targetName = siteConfig.name;

  // Typewriter scramble name reveal on load
  useEffect(() => {
    let iteration = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";

    const interval = setInterval(() => {
      setDisplayName(() => {
        return targetName
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return targetName[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });

      if (iteration >= targetName.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 45);

    return () => clearInterval(interval);
  }, [targetName]);

  // Rotating roles sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % siteConfig.rotatingRoles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex flex-col justify-center items-center px-4 overflow-hidden border-b border-white/5 grid-bg"
    >
      {/* Interactive particle canvas network */}
      <CanvasParticles interactive={true} density={50} />

      {/* Decorative neon gradient overlays */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neon-cyan/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] rounded-full bg-neon-purple/5 blur-[100px] pointer-events-none" />

      {/* Foreground Content */}
      <div className="max-w-4xl w-full text-center z-10 space-y-8 select-none">
        
        {/* Fake system badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3 py-1 text-[10px] font-mono rounded-full border border-neon/30 bg-neon/5 text-neon"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
          </span>
          <span>PORTFOLIO CORE v1.3.0 // ONLINE</span>
        </motion.div>

        {/* Big Name scrambled reveal */}
        <h1 className="text-4xl md:text-7xl font-bold font-mono tracking-tight text-white uppercase select-text h-[48px] md:h-[80px]">
          {displayName}
        </h1>

        {/* Subtitle Rotator */}
        <div className="text-lg md:text-2xl font-mono text-slate-400 h-8 flex flex-row items-center justify-center gap-2 flex-nowrap whitespace-nowrap">
          <span>I am a</span>
          <div className="relative inline-block text-neon text-left w-[180px] sm:w-[200px] md:w-[280px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 block text-neon font-semibold drop-shadow-[0_0_10px_var(--neon-glow)]"
              >
                {siteConfig.rotatingRoles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Narrative tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-xl mx-auto text-sm md:text-base text-slate-400 leading-relaxed font-sans"
        >
          {siteConfig.tagline}
        </motion.p>

        {/* Action button rows */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {/* Main call-to-action */}
          <button
            onClick={() => scrollToSection("projects")}
            className="w-full sm:w-auto px-8 py-3 text-xs font-mono font-semibold rounded-lg bg-neon text-cyber-black hover:bg-white hover:text-black hover:shadow-neon hover:scale-105 transition-all duration-300 border border-neon"
            style={{ 
              backgroundColor: "var(--neon-accent)",
              borderColor: "var(--neon-accent)"
            }}
          >
            VIEW PROJECTS
          </button>

          {/* Social connections */}
          <div className="flex w-full sm:w-auto items-center gap-3">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono border border-white/10 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all duration-200"
            >
              <Github className="w-4 h-4" />
              <span>GITHUB</span>
            </a>

            <button
              onClick={onOpenTerminal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono border border-neon/30 text-neon rounded-lg hover:border-neon hover:bg-neon/5 transition-all duration-200"
            >
              <TerminalIcon className="w-4 h-4" />
              <span>SHELL</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Down arrow scroll indicator */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        onClick={() => scrollToSection("status-panel")}
        className="absolute bottom-10 z-10 p-2 text-slate-500 hover:text-neon transition-colors"
      >
        <ArrowDown className="w-5 h-5" />
      </motion.button>
    </section>
  );
};
export default Hero;
