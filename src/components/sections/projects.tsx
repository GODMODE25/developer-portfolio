"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Filter, Code2, ArrowUpRight, Layers, X } from "lucide-react";
import { projectsData, Project } from "@/content/projects";

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"default" | "complexity" | "loc">("default");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Filter Categories
  const categories = ["ALL", "AI", "Crypto", "Systems", "Fintech", "Tools"];

  // Filter and Sort implementation
  const filteredProjects = projectsData
    .filter((p) => filter === "ALL" || p.category.toUpperCase() === filter.toUpperCase())
    .sort((a, b) => {
      if (sortBy === "complexity") return b.complexity - a.complexity;
      if (sortBy === "loc") return b.linesOfCode - a.linesOfCode;
      return 0; // default order
    });

  return (
    <section id="projects" className="page-section bg-cyber-black relative z-10 border-b border-white/5">
      
      {/* Decorative gradient overlay */}
      <div className="absolute left-0 bottom-1/4 w-[400px] h-[400px] rounded-full bg-neon-purple/5 blur-[120px] pointer-events-none" />

      <div className="section-shell">
        
        {/* Section header */}
        <div className="flex flex-col items-center justify-center gap-8 mb-14">
          <div className="space-y-4 text-center">
            <div className="inline-block text-xs font-mono tracking-widest text-neon uppercase">
              [03 // PROJECT_REGISTRY]
            </div>
            <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase">
              System Catalog
            </h2>
            <p className="max-w-md mx-auto text-sm text-slate-400 font-mono">
              Production modules and engineering systems. Sort by code lines or algorithmic complexity.
            </p>
          </div>

          {/* Filters and Sorters Panel */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center font-mono">
            {/* Category filter */}
            <div className="flex flex-wrap justify-center gap-1.5 p-1 rounded-lg border border-white/5 bg-neutral-900/40 backdrop-blur-md">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    filter === cat
                      ? "bg-neon/10 text-neon border border-neon/20 font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sorter */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "default" | "complexity" | "loc")}
                className="bg-neutral-950/80 text-slate-300 border border-white/5 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-neon font-mono cursor-pointer"
              >
                <option value="default">Default Sort</option>
                <option value="complexity">Sort: Complexity</option>
                <option value="loc">Sort: Lines of Code</option>
              </select>
            </div>
          </div>
        </div>
        <div className="w-full h-6"></div>

        {/* Project Card Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-0 md:px-2"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative flex flex-col justify-between rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md overflow-hidden hover:border-neon/40 hover:shadow-neon/5 transition-all duration-300 h-[300px]"
              >
                {/* Floating metrics inside card */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-white/5 bg-neutral-900/30 text-[10px] font-mono text-slate-500">
                  <span className="text-neon uppercase tracking-wider font-semibold">{project.category}</span>
                  <div className="flex items-center gap-3">
                    <span>LOC: {project.linesOfCode.toLocaleString()}</span>
                    <span>CMP: {project.complexity}/10</span>
                  </div>
                </div>

                {/* Card Main Box */}
                <div className="p-6 flex-1 flex flex-col justify-between overflow-hidden relative">
                  
                  {/* Interactive Code preview appearing on hover */}
                  <AnimatePresence>
                    {hoveredProject === project.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-neutral-950/95 p-4 overflow-hidden font-mono text-[10px] text-emerald-400 select-text scrollbar-none z-10 border-b border-white/5"
                      >
                        <div className="flex items-center gap-1.5 mb-2 text-slate-500 select-none text-[8px] uppercase">
                          <Code2 className="w-3 h-3 text-neon" />
                          <span>SOURCE_BUFFER_VIEW</span>
                        </div>
                        <pre className="overflow-x-auto whitespace-pre font-mono leading-relaxed">{project.mockCodePreview}</pre>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-4">
                    <h3 className="text-xl font-mono font-semibold text-white tracking-wide group-hover:text-neon transition-colors duration-200">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">
                      {project.subtitle}
                    </p>
                    <p className="text-xs text-slate-400 leading-loose font-sans line-clamp-4 pt-2 text-left">
                      {project.whyItExists}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[9px] font-mono px-2 py-0.5 rounded border border-white/5 bg-white/5 text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[9px] font-mono px-2 py-0.5 text-neon">
                        +{project.techStack.length - 3} more
                      </span>
                    )}
                  </div>

                </div>

                {/* Card footer CTA buttons */}
                <div className="px-4 py-3 border-t border-white/5 bg-neutral-950/80 flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 hover:underline transition-all"
                  >
                    <span>SPECIFICATION</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Github Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    {/* {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-neon transition-colors"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )} */}
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Dynamic specification Overlay Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-2xl rounded-xl border glass-panel-glow border-neon/30 overflow-hidden font-mono"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/60">
                  <div className="flex items-center gap-2 text-neon text-xs">
                    <Layers className="w-4 h-4" />
                    <span>SPECIFICATION // {selectedProject.title}</span>
                  </div>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
                  {/* Title & metrics row */}
                  <div>
                    <h3 className="text-2xl font-bold text-white uppercase">{selectedProject.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="text-neon">{selectedProject.category.toUpperCase()} MODULE</span>
                      <span>LOC: {selectedProject.linesOfCode.toLocaleString()} lines</span>
                      <span>COMPLEXITY: {selectedProject.complexity}/10</span>
                      <span className="uppercase px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white">
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>

                  {/* Why it exists description */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">WHY IT EXISTS</div>
                    <p className="text-sm text-slate-300 font-sans leading-relaxed text-justify">
                      {selectedProject.whyItExists}
                    </p>
                  </div>

                  {/* Architecture Details bullet points */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">ARCHITECTURE HIGHLIGHTS</div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {selectedProject.architectureDetails.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-neon">&gt;</span>
                          <span className="font-sans">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech stack stack badges */}
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">TECH STACK INTEGRATION</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 rounded border border-white/10 bg-neutral-900 text-slate-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="px-6 py-4 border-t border-white/5 bg-neutral-950 flex items-center justify-between text-xs">
                  <span>DEPLOYED STATE: STABLE</span>
                  <div className="flex items-center gap-4">
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded border border-white/10 hover:border-white hover:bg-white/5 transition-all text-white"
                    >
                      <Github className="w-4 h-4" />
                      <span>SOURCE</span>
                    </a>
                    {/* {selectedProject.demoUrl && (
                      <a
                        href={selectedProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded bg-neon hover:opacity-90 transition-all text-cyber-black"
                        style={{ backgroundColor: "var(--neon-accent)" }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>LIVE PREVIEW</span>
                      </a>
                    )} */}
                  </div>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
export default Projects;
