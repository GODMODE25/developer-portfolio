"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Terminal } from "lucide-react";
import { projectsData } from "@/content/projects";
import { siteConfig } from "@/content/site";

interface RetroTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogLine {
  text: string;
  type: "system" | "input" | "error" | "success" | "info";
  timestamp: string;
}

const getTime = () => {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const createInitialHistory = (): LogLine[] => [
  { text: "=== PORTFOLIO TERMINAL CONSOLE v1.0.0 ===", type: "system", timestamp: getTime() },
  { text: "[SECURE_SHELL] Initializing handshake client...", type: "info", timestamp: getTime() },
  { text: "[SECURE_SHELL] Memory buffers allocated successfully. [OK]", type: "success", timestamp: getTime() },
  { text: "[SECURE_SHELL] Binding visual node layout to DOM client... [OK]", type: "success", timestamp: getTime() },
  { text: "[SECURE_SHELL] Type 'help' for a list of shell commands. Escape / 'exit' to quit.", type: "info", timestamp: getTime() },
  { text: " ", type: "info", timestamp: getTime() },
];

export const RetroTerminal: React.FC<RetroTerminalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<LogLine[]>(createInitialHistory);
  const [input, setInput] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Scroll to bottom when history updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const addLine = (text: string, type: LogLine["type"] = "info") => {
    setHistory((prev) => [...prev, { text, type, timestamp: getTime() }]);
  };

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    addLine(`$ ${trimmed}`, "input");
    
    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    switch (command) {
      case "help":
        addLine("Available commands:", "system");
        addLine("  about       - Output narrative bio and background information");
        addLine("  projects    - List active development projects with metadata");
        addLine("  skills      - Output skills matrix and tech stack bindings");
        addLine("  theme <val> - Change theme colors. Options: cyan, green, purple, matrix");
        addLine("  contact     - Display social hooks & communications");
        addLine("  clear       - Clear the screen buffer logs");
        addLine("  exit        - Terminate terminal session and return to app");
        break;

      case "about":
        addLine("--- DEVELOPER NARRATIVE ---", "info");
        addLine(siteConfig.aboutNarrative, "system");
        addLine(`Uptime start: ${new Date(siteConfig.systemStatus.uptimeStart).toLocaleString()}`, "success");
        addLine(`Location: ${siteConfig.systemStatus.location}`, "info");
        break;

      case "projects":
        addLine("--- ACTIVE PORTFOLIO PROJECTS ---", "info");
        projectsData.forEach((p) => {
          addLine(`[${p.category.toUpperCase()}] ${p.title} (${p.status})`, "success");
          addLine(`  Complexity: ${p.complexity}/10 | Lines: ${p.linesOfCode.toLocaleString()} LOC`, "system");
          addLine(`  Why exists: ${p.whyItExists}`, "info");
          addLine(`  Source: ${p.githubUrl}`, "system");
          addLine(" ", "info");
        });
        break;

      case "skills":
        addLine("--- SKILL LAYER MATRIX ---", "info");
        const categories = Array.from(new Set(siteConfig.skillsGraph.nodes.map(n => n.category)));
        categories.forEach(cat => {
          const skills = siteConfig.skillsGraph.nodes
            .filter(n => n.category === cat)
            .map(n => n.label)
            .join(", ");
          addLine(`  ${cat.toUpperCase()}: ${skills}`, "system");
        });
        break;

      case "theme":
        if (args.length === 0) {
          addLine("Error: Please specify a theme. Options: cyan, green, purple, matrix", "error");
        } else {
          const targetTheme = args[0].toLowerCase();
          if (["cyan", "green", "purple", "matrix"].includes(targetTheme)) {
            const finalTheme = targetTheme === "matrix" ? "terminal-matrix" : `neon-${targetTheme}`;
            document.documentElement.setAttribute("data-theme", finalTheme);
            window.dispatchEvent(new Event("resize"));
            addLine(`Theme updated to: ${targetTheme}`, "success");
          } else {
            addLine(`Error: Theme '${targetTheme}' not recognized. Options: cyan, green, purple, matrix`, "error");
          }
        }
        break;

      case "contact":
        addLine("--- SECURE NETWORK HOOKS ---", "info");
        addLine(`  Email:    ${siteConfig.email}`, "success");
        addLine(`  GitHub:   ${siteConfig.github}`, "system");
        addLine(`  Telegram: ${siteConfig.telegram}`, "success");
        addLine(`  Twitter:  ${siteConfig.twitter}`, "system");
        break;

      case "clear":
        setHistory([]);
        break;

      case "exit":
      case "close":
      case "quit":
        addLine("Closing terminal session...", "info");
        setTimeout(() => {
          onClose();
        }, 300);
        break;

      default:
        addLine(`Command '${command}' not found. Type 'help' for options.`, "error");
    }

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md scanline">
      <div 
        className="w-full max-w-4xl h-[80vh] flex flex-col rounded-lg border border-neon/50 bg-black/95 shadow-neon/40 shadow-2xl crt-effect text-green-500 font-mono text-sm overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neon/30 bg-neutral-900/60 select-none">
          <div className="flex items-center gap-2 text-neon">
            <Terminal className="w-4 h-4" />
            <span className="text-xs uppercase">developer_shell@sam_pc:~</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1 rounded hover:bg-neutral-800 text-neon hover:text-rose-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Console output buffer */}
        <div 
          ref={terminalRef}
          className="flex-1 p-4 overflow-y-auto space-y-1.5 scrollbar-thin select-text"
        >
          {history.map((line, index) => (
            <div 
              key={index} 
              className={`flex items-start gap-2 ${
                line.type === "error" ? "text-rose-500" :
                line.type === "success" ? "text-emerald-400" :
                line.type === "system" ? "text-amber-400" :
                line.type === "input" ? "text-cyan-400" : "text-slate-300"
              }`}
            >
              <span className="text-[10px] opacity-40 select-none">[{line.timestamp}]</span>
              <span className="whitespace-pre-wrap">{line.text}</span>
            </div>
          ))}
        </div>

        {/* Console Command Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-neon/20 bg-neutral-950/80">
          <span className="text-cyan-400 select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-slate-100 outline-none font-mono caret-cyan-400"
            placeholder="Type command (e.g. 'help', 'projects', 'exit')..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
export default RetroTerminal;
