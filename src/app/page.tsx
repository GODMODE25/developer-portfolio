"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Github, Layers } from "lucide-react";
import { siteConfig } from "@/content/site";

// Component imports
import Hero from "@/components/sections/hero";
import StatusPanel from "@/components/sections/status-panel";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Projects from "@/components/sections/projects";
import Contact from "@/components/sections/contact";
import CommandMenu from "@/components/ui/command-menu";
import RetroTerminal from "@/components/ui/retro-terminal";
import ScrollToTop from "@/components/ui/scroll-to-top";

export default function Home() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  // Toggle terminal handler
  const handleToggleTerminal = () => {
    setIsTerminalOpen((prev) => !prev);
  };

  // Listen for Konami Code for a hidden easter egg!
  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let index = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[index]) {
        index++;
        if (index === konamiCode.length) {
          setIsTerminalOpen(true);
          index = 0;
        }
      } else {
        index = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-cyber-black text-slate-200">
      
      {/* Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-cyber-black/70 backdrop-blur-md">
        <div className="site-shell h-14 flex items-center justify-between font-mono text-xs">
          
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 text-white hover:text-neon transition-colors"
          >
            <Layers className="w-4 h-4 text-neon" />
            <span className="font-bold tracking-widest">HOME</span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-slate-400">
            <button onClick={() => scrollToSection("about")} className="hover:text-white transition-colors">[01. ABOUT]</button>
            <button onClick={() => scrollToSection("skills")} className="hover:text-white transition-colors">[02. SKILLS]</button>
            <button onClick={() => scrollToSection("projects")} className="hover:text-white transition-colors">[03. PROJECTS]</button>
            <button onClick={() => scrollToSection("blog")} className="hover:text-white transition-colors">[04. BLOG]</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors">[05. CONTACT]</button>
          </nav>

          {/* Control Right buttons */}
          <div className="flex items-center gap-3">
            <a 
              href={siteConfig.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-white transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            
            <button
              onClick={handleToggleTerminal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neon/30 text-neon bg-neon/5 hover:bg-neon hover:text-cyber-black hover:shadow-neon hover:scale-105 transition-all duration-300"
              title="Launch Terminal Emulator"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SHELL</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main content flow */}
      <main className="flex-grow">
        
        {/* Sections */}
        <Hero onOpenTerminal={handleToggleTerminal} />
        
        <StatusPanel />
        
        <About />
        
        <Skills />
        
        <Projects />

        {/* Section 4: Blog Preview Feed */}
        <section id="blog" className="page-section bg-cyber-black relative z-10 border-b border-white/5">
          <div className="section-shell-blog mt-12">
            
            <div className="text-center space-y-4 mb-16">
              <div className="inline-block text-xs font-mono tracking-widest text-neon uppercase">
                [04 // ARCHIVE_INDEX]
              </div>
              <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase">
                Engineering Logs
              </h2>
              <p className="max-w-md mx-auto text-sm text-slate-400 font-mono">
                Technical writings and deep dives into compilers, EVM optimizations, and system architectures.
              </p>
            </div>
            <div className="w-full h-6"></div>

            <div className="space-y-0 px-0 md:px-2">
  {siteConfig.blogPosts.map((post, idx) => (
    <React.Fragment key={post.slug}>
      <div
        onClick={() => window.location.href = `/blog/${post.slug}`}
        className="group p-6 rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md hover:border-neon/40 hover:bg-neutral-900/20 cursor-pointer transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8"
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
            <span>{post.publishedAt}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          <h3 className="text-lg md:text-xl font-mono font-semibold text-white group-hover:text-neon transition-colors duration-200">
            {post.title}
          </h3>
          <p className="text-xs text-slate-400 font-sans leading-relaxed text-justify">
            {post.summary}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 md:flex-col md:items-end">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-[9px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/5 text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {idx < siteConfig.blogPosts.length - 1 && (
        <div className="w-full h-6"></div>
      )}
    </React.Fragment>
  ))}
</div>
            <div className="text-center pt-12 font-mono">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-xs text-neon hover:underline"
              >
                <span>VIEW ALL ARCHIVES</span>
                <span>[→]</span>
              </Link>
            </div>

          </div>
        </section>

        <Contact />

      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-cyber-black/80 font-mono text-[10px] text-slate-500">
        <div className="site-shell flex flex-col md:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} {siteConfig.name.toUpperCase()}. ALL RIGHT EXECUTION CHANNELS BINDED.</span>

          <div className="flex items-center gap-6">
            
            <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LINKEDIN</a>
            <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GITHUB</a>
            <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TELEGRAM</a>
            
          </div>
        </div>
      </footer>

      {/* Cmd+K Palette */}
      <CommandMenu onToggleTerminal={handleToggleTerminal} />

      {/* Interactive CRT Terminal emulator */}
      <RetroTerminal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* Scroll to top button */}
      <ScrollToTop />

    </div>
  );
}
