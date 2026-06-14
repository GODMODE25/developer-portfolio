"use client";

import React, { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site";

interface Node {
  id: string;
  label: string;
  category: string;
  val: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Link {
  source: string;
  target: string;
  sourceNode?: Node;
  targetNode?: Node;
}

export const Skills: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = containerRef.current?.clientWidth || 800);
    const height = (canvas.height = 500);

    let animationFrameId: number;

    // Load data from config
    const nodes: Node[] = siteConfig.skillsGraph.nodes.map((node) => ({
      ...node,
      x: width / 2 + (Math.random() - 0.5) * 300,
      y: height / 2 + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
      radius: Math.sqrt(node.val) * 6,
    }));

    const links: Link[] = siteConfig.skillsGraph.links.map((link) => ({
      ...link,
      sourceNode: nodes.find((n) => n.id === link.source),
      targetNode: nodes.find((n) => n.id === link.target),
    }));

    // Interactive States
    let draggedNode: Node | null = null;
    let hoveredNode: Node | null = null;

    // Physics parameters
    const kRepel = 2200; // Coulomb constant
    const kSpring = 0.04; // Spring stiffness
    const linkLength = 80;
    const friction = 0.88;
    const centerPull = 0.015;

    // Core Physics Simulation Tick
    const updatePhysics = () => {
      // 1. Repel nodes from each other
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.hypot(dx, dy) || 1;
          
          if (dist < 280) {
            // Coulomb's law force
            const force = kRepel / (dist * dist);
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            if (n1 !== draggedNode) {
              n1.vx -= fx;
              n1.vy -= fy;
            }
            if (n2 !== draggedNode) {
              n2.vx += fx;
              n2.vy += fy;
            }
          }
        }
      }

      // 2. Spring force between connected edges
      links.forEach((l) => {
        if (!l.sourceNode || !l.targetNode) return;
        const n1 = l.sourceNode;
        const n2 = l.targetNode;
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.hypot(dx, dy) || 1;
        
        // Hooke's law: force proportional to displacement
        const force = (dist - linkLength) * kSpring;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (n1 !== draggedNode) {
          n1.vx += fx;
          n1.vy += fy;
        }
        if (n2 !== draggedNode) {
          n2.vx -= fx;
          n2.vy -= fy;
        }
      });

      // 3. Central gravity and movement constraints
      nodes.forEach((n) => {
        if (n === draggedNode) return;

        // Pull towards center of gravity
        n.vx += (width / 2 - n.x) * centerPull;
        n.vy += (height / 2 - n.y) * centerPull;

        // Apply friction
        n.vx *= friction;
        n.vy *= friction;

        // Apply velocity to position
        n.x += n.vx;
        n.y += n.vy;

        // Keep inside boundary constraints
        n.x = Math.max(n.radius, Math.min(width - n.radius, n.x));
        n.y = Math.max(n.radius, Math.min(height - n.radius, n.y));
      });
    };

    // Rendering Tick
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Get color tokens dynamically
      let cyanColor = "#00f0ff";
      let purpleColor = "#bd00ff";
      let greenColor = "#39ff14";
      let roseColor = "#ff007f";
      let textAccent = "#00f0ff";

      if (typeof window !== "undefined") {
        const rootStyles = getComputedStyle(document.documentElement);
        textAccent = rootStyles.getPropertyValue("--neon-accent").trim() || "#00f0ff";
        if (textAccent.includes("39ff14")) {
          // matrix
          cyanColor = "#39ff14";
          purpleColor = "#39ff14";
          greenColor = "#39ff14";
          roseColor = "#39ff14";
        }
      }

      const getCategoryColor = (cat: string) => {
        switch (cat) {
          case "frontend":
            return cyanColor;
          case "backend":
            return purpleColor;
          case "ai":
            return greenColor;
          case "trading":
            return roseColor;
          default:
            return "#64748b"; // devops
        }
      };

      // 1. Draw Links
      links.forEach((l) => {
        if (!l.sourceNode || !l.targetNode) return;
        const n1 = l.sourceNode;
        const n2 = l.targetNode;

        // Determine if highlighted
        let isHighlighted = false;
        let isFaded = false;
        
        if (hoveredNode) {
          if (hoveredNode === n1 || hoveredNode === n2) {
            isHighlighted = true;
          } else {
            isFaded = true;
          }
        } else if (activeCategory) {
          if (n1.category === activeCategory && n2.category === activeCategory) {
            isHighlighted = true;
          } else {
            isFaded = true;
          }
        }

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.strokeStyle = isHighlighted ? textAccent : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = isHighlighted ? 1.5 : 0.6;
        ctx.globalAlpha = isFaded ? 0.08 : 1.0;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });

      // 2. Draw Nodes
      nodes.forEach((n) => {
        const color = getCategoryColor(n.category);
        
        // Highlight states
        const isHovered = hoveredNode === n;
        const isCategoryMatch = activeCategory === n.category;
        const isFocus = isHovered || isCategoryMatch;
        const isFaded = (hoveredNode && !isHovered && !links.some(l => (l.source === hoveredNode?.id && l.target === n.id) || (l.target === hoveredNode?.id && l.source === n.id))) || (activeCategory && !isCategoryMatch);

        ctx.globalAlpha = isFaded ? 0.2 : 1.0;

        // Draw outer glow if focused
        if (isFocus) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.globalAlpha = 0.15;
          ctx.fill();
          ctx.globalAlpha = isFaded ? 0.2 : 1.0;
        }

        // Draw node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(10, 10, 12, 0.9)";
        ctx.strokeStyle = isFocus ? textAccent : color;
        ctx.lineWidth = isFocus ? 2.5 : 1.2;
        ctx.fill();
        ctx.stroke();

        // Draw node label
        ctx.fillStyle = isFocus ? "#ffffff" : "rgba(255, 255, 255, 0.85)";
        ctx.font = `bold ${n.radius > 20 ? 11 : 9}px monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.label, n.x, n.y);
      });

      ctx.globalAlpha = 1.0;
    };

    // Animation Loop
    const loop = () => {
      updatePhysics();
      render();
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    // Event Handlers
    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      const pos = getMousePos(e);
      // Check if mouse hits a node
      const clicked = nodes.find(
        (n) => Math.hypot(n.x - pos.x, n.y - pos.y) < n.radius + 5
      );
      if (clicked) {
        draggedNode = clicked;
        clicked.vx = 0;
        clicked.vy = 0;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const pos = getMousePos(e);
      if (draggedNode) {
        draggedNode.x = pos.x;
        draggedNode.y = pos.y;
        draggedNode.vx = 0;
        draggedNode.vy = 0;
      } else {
        // Track hover node
        const hovered = nodes.find(
          (n) => Math.hypot(n.x - pos.x, n.y - pos.y) < n.radius + 5
        );
        hoveredNode = hovered || null;
      }
    };

    const handleMouseUp = () => {
      draggedNode = null;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Resize observer
    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      width = canvas.width = containerRef.current.clientWidth;
      initPositions();
    };

    const initPositions = () => {
      nodes.forEach((n) => {
        n.x = Math.max(n.radius, Math.min(width - n.radius, n.x));
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeCategory]);

  return (
    <section id="skills" className="page-section bg-cyber-black relative z-10 border-b border-white/5">
      <div className="section-shell">
        
        {/* Header headings */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-block text-xs font-mono tracking-widest text-neon uppercase">
            [02 // SKILLS_COCKPIT]
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase">
            Skills Node Network
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-400 font-mono">
            Click and drag nodes to test physics bindings. Hover over a skill node to trace network dependencies.
          </p>
        </div>

        {/* Categories togglers */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { id: "frontend", label: "Frontend Core", color: "border-neon-cyan text-neon-cyan bg-neon-cyan/5" },
            { id: "backend", label: "Backend Systems", color: "border-neon-purple text-neon-purple bg-neon-purple/5" },
            { id: "ai", label: "AI & LangChain", color: "border-neon-green text-neon-green bg-neon-green/5" },
            { id: "trading", label: "Quant / Solidity", color: "border-neon-rose text-neon-rose bg-neon-rose/5" },
            { id: "devops", label: "Cloud & Devops", color: "border-slate-500 text-slate-400 bg-slate-500/5" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`px-4 py-1.5 text-xs font-mono rounded-lg border transition-all duration-300 ${
                activeCategory === cat.id
                  ? `${cat.color.split(" ")[0]} bg-white/10 text-white shadow-neon border-white`
                  : `border-white/10 text-slate-400 hover:border-white/30`
              }`}
            >
              {cat.label}
            </button>
          ))}
          {activeCategory && (
            <button 
              onClick={() => setActiveCategory(null)}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Physics Canvas box wrapper */}
        <div 
          ref={containerRef}
          className="w-full relative rounded-xl border border-white/5 bg-neutral-950/40 backdrop-blur-md overflow-hidden p-3"
          style={{ height: "500px" }}
        >
          {/* Subtle scanning glow background grid */}
          <div className="absolute inset-0 grid-bg pointer-events-none opacity-20" />
          
          <canvas 
            ref={canvasRef} 
            className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 rounded-lg" 
          />
        </div>

      </div>
    </section>
  );
};
export default Skills;
