"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, CheckCircle2, ShieldCheck, Mail, ArrowRight } from "lucide-react";
import { siteConfig } from "@/content/site";

interface TerminalLog {
  text: string;
  type: "info" | "success" | "warning" | "error";
}

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([]);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [terminalLogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTerminalLogs([]);

    const logs: { text: string; type: TerminalLog["type"]; delay: number }[] = [
      { text: "[DISPATCH] Initializing mail daemon pipeline...", type: "info", delay: 100 },
      { text: `[DISPATCH] Handshaking from guest: ${formData.name} <${formData.email}>`, type: "info", delay: 500 },
      { text: "[DISPATCH] Resolving destination [EMAIL_ADDRESS]... [OK]", type: "success", delay: 1200 },
      { text: "[DISPATCH] Packaging packet structures with GPG-256 envelop...", type: "info", delay: 1800 },
      { text: `[DISPATCH] Payload envelope compiled successfully (size: ${formData.message.length + 80} bytes).`, type: "success", delay: 2400 },
      { text: "[DISPATCH] Transmitting payload to secure endpoint...", type: "info", delay: 3000 }
    ];

    logs.forEach((log) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, { text: log.text, type: log.type }]);
      }, log.delay);
    });

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "46a15206-1458-4d24-9238-de0f0f7f4488",
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });
      
      const result = await response.json();

      setTimeout(() => {
        if (result.success) {
          setTerminalLogs((prev) => [...prev, { text: "[DISPATCH] Server response: 250 Message queued and delivered.", type: "success" }]);
          setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            setFormData({ name: "", email: "", message: "" });
          }, 1200);
        } else {
          setTerminalLogs((prev) => [...prev, { text: `[ERROR] Transmission failed: ${result.message}`, type: "error" }]);
          setTimeout(() => {
            setIsSubmitting(false);
          }, 3000);
        }
      }, 3600); // 3600ms is right after the last scheduled log
      
    } catch {
      setTimeout(() => {
         setTerminalLogs((prev) => [...prev, { text: "[ERROR] Network failure during transmission.", type: "error" }]);
         setTimeout(() => {
            setIsSubmitting(false);
          }, 3000);
      }, 3600);
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setTerminalLogs([]);
  };

  return (
    <section id="contact" className="page-section bg-cyber-black relative z-10 border-b border-white/5 grid-bg">
      <div className="section-shell-narrow">
        
        {/* Header Title */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block text-xs font-mono tracking-widest text-neon uppercase">
            [05 // COMMUNICATIONS_ROUTER]
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white uppercase">
            Initialize Contact
          </h2>
          <p className="max-w-md mx-auto text-sm text-slate-400 font-mono">
            Secure SSH envelope wrapper. Submit the form to view transmission logs.
          </p>
        </div>
        <div className="w-full h-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-stretch px-0 md:px-2">
          
          {/* Left panel: Info */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6 p-5 rounded-xl glass-panel border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neon-purple/2 to-transparent pointer-events-none" />

            <div className="space-y-6">
              <h3 className="text-xl font-mono font-semibold text-white tracking-wide uppercase">
                Active Sockets
              </h3>
              <div className="w-full h-6"></div>

              <div className="space-y-5 font-mono text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-neon" />
                  <div>
                    <span className="block text-[9px] text-slate-500">SECURE_MAIL</span>
                    <a href={`mailto:${siteConfig.email}`} className="text-white hover:underline">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
                <div className="w-full h-6"></div>

                <div className="flex items-center gap-3">
                  <Terminal className="w-4 h-4 text-neon" />
                  <div>
                    <span className="block text-[9px] text-slate-500">TELEGRAM_BRIDGE</span>
                    <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
                      {siteConfig.telegramHandle}
                    </a>
                  </div>
                </div>
                <div className="w-full h-6"></div>

                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-neon" />
                  <div>
                    <span className="block text-[9px] text-slate-500">GPG_ENVELOPE</span>
                    <span className="text-slate-300">0x9F4C...B28A</span>
                  </div>
                </div>
                <div className="w-full h-6"></div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 text-[10px] font-mono text-slate-500 space-y-1">
              <span className="block uppercase tracking-wider">NETWORK SECURITY STATE</span>
              <span className="block text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                END_TO_END ENCRYPTED
              </span>
            </div>
          </div>

          {/* Right panel: Interactive Form */}
          <div className="md:col-span-7 p-5 rounded-xl glass-panel border-white/5 flex flex-col justify-center relative overflow-hidden min-h-[300px]">
            
            {/* 1. Terminal Send Logs overlay */}
            <AnimatePresence>
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-neutral-950/95 z-20 flex flex-col p-6 font-mono text-xs text-cyan-400 select-text"
                >
                  <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2 text-slate-400 select-none">
                    <Terminal className="w-4 h-4 text-neon animate-pulse" />
                    <span className="uppercase text-[9px]">GUEST_MAILER_DAEMON_SHELL</span>
                  </div>

                  <div 
                    ref={logsContainerRef}
                    className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin"
                  >
                    {terminalLogs.map((log, idx) => (
                      <div 
                        key={idx} 
                        className={
                          log.type === "success" ? "text-emerald-400" : 
                          log.type === "warning" ? "text-amber-400" : 
                          log.type === "error" ? "text-rose-500" : "text-cyan-400"
                        }
                      >
                        {log.text}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[10px] text-slate-500 select-none">
                    <span>TRANSMITTING ENVELOPE...</span>
                    <span className="animate-pulse">LOADING</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 2. Success screen */}
            <AnimatePresence>
              {isSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-neutral-950/95 z-20 flex flex-col items-center justify-center p-6 text-center font-mono"
                >
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-4 animate-bounce" />
                  <h4 className="text-lg text-white font-bold uppercase tracking-wider">Transmission Logged</h4>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed mt-2 font-sans">
                    The dispatch package was successfully compiled, signed, and delivered. I will verify your contact payload shortly.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-6 flex items-center gap-2 px-4 py-2 border border-white/10 text-xs text-slate-300 rounded hover:border-white hover:text-white hover:bg-white/5 transition-all"
                  >
                    <span>SEND ANOTHER PACKET</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. Main Form Inputs */}
            <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs">
              
              <div className="space-y-2">
                <label className="text-slate-400 uppercase tracking-widest text-[9px]">Sender Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-3 rounded-lg glass-input text-white text-xs font-mono"
                />
              </div>
              <div className="w-full h-6"></div>

              <div className="space-y-2">
                <label className="text-slate-400 uppercase tracking-widest text-[9px]">Reply Sockets (Email)</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. satoshi@bitcoin.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-3 rounded-lg glass-input text-white text-xs font-mono"
                />
              </div>
              <div className="w-full h-6"></div>

              <div className="space-y-2">
                <label className="text-slate-400 uppercase tracking-widest text-[9px]">Payload Content (Message)</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Input text logs..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-3 rounded-lg glass-input text-white text-xs font-mono resize-none"
                />
              </div>
              <div className="w-full h-6"></div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-neon hover:bg-neon/5 hover:text-neon text-white font-semibold tracking-wider hover:shadow-neon hover:scale-[1.01] transition-all duration-300"
              >
                <Send className="w-4 h-4" />
                <span>SEND SECURE DISPATCH</span>
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
export default Contact;
