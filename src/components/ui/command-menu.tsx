"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Terminal, 
  Code, 
  User, 
  Cpu, 
  Mail, 
  BookOpen, 
  Copy, 
  Palette, 
  Compass, 
  X,
  Check
} from "lucide-react";

interface CommandMenuProps {
  onToggleTerminal: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({ onToggleTerminal }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTheme, setActiveTheme] = useState(() =>
    typeof document === "undefined"
      ? "neon-cyan"
      : document.documentElement.getAttribute("data-theme") || "neon-cyan"
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle Command Palette with Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeMenu = () => {
    setSearch("");
    setIsOpen(false);
  };

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("mousedown", handleOutsideClick);
    }
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  const changeTheme = (themeName: string) => {
    document.documentElement.setAttribute("data-theme", themeName);
    // Update local state and trigger window event to refresh canvas colors
    setActiveTheme(themeName);
    window.dispatchEvent(new Event("resize")); 
    closeMenu();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("musasamuel147@gmail.com");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      closeMenu();
    }, 1000);
  };

  const navigateTo = (sectionId: string) => {
    closeMenu();
    
    // Check if we are on the home page or blog pages
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  const commands = [
    // Navigation
    { id: "nav-hero", label: "Scroll to Hero Section", category: "Navigation", icon: Compass, action: () => navigateTo("hero") },
    { id: "nav-about", label: "Scroll to Biography Story", category: "Navigation", icon: User, action: () => navigateTo("about") },
    { id: "nav-projects", label: "Scroll to Project List", category: "Navigation", icon: Code, action: () => navigateTo("projects") },
    { id: "nav-skills", label: "Scroll to Skills Web Node", category: "Navigation", icon: Cpu, action: () => navigateTo("skills") },
    { id: "nav-blog", label: "Scroll to MDX Blog posts", category: "Navigation", icon: BookOpen, action: () => navigateTo("blog") },
    { id: "nav-contact", label: "Scroll to Contact Terminal", category: "Navigation", icon: Mail, action: () => navigateTo("contact") },
    
    // Themes
    { id: "theme-cyan", label: "Theme: Cyber Neon Cyan (Default)", category: "Appearance", icon: Palette, action: () => changeTheme("neon-cyan") },
    { id: "theme-green", label: "Theme: Matrix Toxic Green", category: "Appearance", icon: Palette, action: () => changeTheme("neon-green") },
    { id: "theme-purple", label: "Theme: EVM Neon Purple", category: "Appearance", icon: Palette, action: () => changeTheme("neon-purple") },
    { id: "theme-matrix", label: "Theme: Retro CRT Monitor Matrix", category: "Appearance", icon: Terminal, action: () => changeTheme("terminal-matrix") },
    
    // Special
    { id: "action-terminal", label: "Launch Interactive Shell Console", category: "System Control", icon: Terminal, action: () => { closeMenu(); onToggleTerminal(); } },
    { id: "action-copy", label: copied ? "Copied to Clipboard!" : "Copy Developer Email (musasamuel147@gmail.com)", category: "System Control", icon: copied ? Check : Copy, action: copyEmail },
    { id: "action-blog-page", label: "Navigate to Full Blog Page", category: "Redirects", icon: BookOpen, action: () => { closeMenu(); router.push("/blog"); } },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Floating command prompt indicator in corner */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2 text-xs font-mono rounded-lg border glass-panel border-neon/30 text-neon hover:border-neon hover:shadow-neon transition-all duration-300"
        title="Open Command Palette (Ctrl+K)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon/80 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-neon"></span>
        </span>
        <span>SYS.CMD [Ctrl+K]</span>
      </button>

      {/* Palette Overlay Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              ref={menuRef}
              className="w-full max-w-lg overflow-hidden border rounded-xl glass-panel-glow border-neon/30"
            >
              {/* Search input bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 opacity-40 text-neon" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or filter options..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-white outline-none font-mono"
                />
                <button
                  onClick={closeMenu}
                  className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions / List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-3 font-mono text-xs">
                {filteredCommands.length > 0 ? (
                  // Group by category
                  Array.from(new Set(filteredCommands.map((c) => c.category))).map((cat) => (
                    <div key={cat} className="space-y-1">
                      <div className="px-3 py-1 font-semibold text-white/40 tracking-wider uppercase text-[10px]">
                        {cat}
                      </div>
                      {filteredCommands
                        .filter((c) => c.category === cat)
                        .map((cmd) => {
                          const Icon = cmd.icon;
                          const isThemeMatch = cmd.id.startsWith("theme-") && activeTheme === cmd.id.replace("theme-", "neon-");
                          return (
                            <button
                              key={cmd.id}
                              onClick={cmd.action}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-150 ${
                                isThemeMatch 
                                  ? "bg-neon/10 text-neon border border-neon/20" 
                                  : "hover:bg-white/5 text-white/80 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className={`w-4 h-4 ${isThemeMatch ? "text-neon" : "opacity-60"}`} />
                                <span>{cmd.label}</span>
                              </div>
                              {isThemeMatch && (
                                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border border-neon/30 text-neon bg-neon/10">
                                  active
                                </span>
                              )}
                            </button>
                          );
                        })}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-white/40">
                    No system commands matching &quot;{search}&quot; found.
                  </div>
                )}
              </div>

              {/* Status footer info */}
              <div className="px-4 py-2 bg-white/2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
                <span>Select command to execute</span>
                <span className="flex items-center gap-1">
                  <span>ESC to exit</span>
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
export default CommandMenu;
