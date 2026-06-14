"use client";

import React, { useState, useEffect } from "react";
import { Cpu, Activity, Clock, MapPin } from "lucide-react";
import { siteConfig } from "@/content/site";

export const StatusPanel: React.FC = () => {
  const [uptime, setUptime] = useState("");
  const [latency, setLatency] = useState(14);
  const [cpu, setCpu] = useState(8);
  const [health, setHealth] = useState(siteConfig.systemStatus.systemHealth);
  const [currentProcess, setCurrentProcess] = useState("indexing_github_commits");

  // Counter loop for real-time uptime duration since siteConfig.systemStatus.uptimeStart
  useEffect(() => {
    const startDate = new Date(siteConfig.systemStatus.uptimeStart);
    
    const updateUptime = () => {
      const diff = Date.now() - startDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setUptime(
        `${days}d ${hours.toString().padStart(2, "0")}h ${minutes
          .toString()
          .padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`
      );
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Micro fluctuations for latency, CPU, and health to feel "responsive and alive"
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(9, Math.min(24, prev + change));
      });
      setCpu((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1 to +1
        return Math.max(4, Math.min(18, prev + change));
      });
      setHealth((prev) => {
        const adjustment = (Math.random() * 0.02 - 0.01); // -0.01% to +0.01%
        return Math.max(99.95, Math.min(99.99, prev + adjustment));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Rotate simulated active tasks
  useEffect(() => {
    const processes = [
      "evaluating_bellman_ford_mempool_cycles",
      "indexing_github_contributions",
      "optimizing_llvm_unrolling_heuristics",
      "polling_l2_gas_oracle_averages",
      "syncing_portfolio_analytics_workers"
    ];
    
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * processes.length);
      setCurrentProcess(processes[randomIdx]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="status-panel" className="page-section-compact bg-cyber-black relative z-10 border-b border-white/5 text-left">
      <div className="section-shell flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 rounded-xl glass-panel border-white/5 shadow-2xl relative overflow-hidden">
          {/* Subtle neon glowing grid divider */}
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/2 to-transparent pointer-events-none" />

          {/* Metric 1: Timezone / Location */}
          <div className="flex items-center gap-4 p-2">
            <div className="p-3 rounded-lg bg-neon-cyan/5 border border-neon-cyan/20 text-neon-cyan">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs">
              <span className="block text-slate-500 uppercase tracking-wider text-[9px]">PHYSICAL_NODE</span>
              <span className="block text-slate-200 font-semibold">{siteConfig.systemStatus.location}</span>
              <span className="block text-[10px] text-slate-400">GMT+1 Timezone</span>
            </div>
          </div>

          {/* Metric 2: Uptime Counter */}
          <div className="flex items-center gap-4 p-2">
            <div className="p-3 rounded-lg bg-neon-green/5 border border-neon-green/20 text-neon-green">
              <Clock className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs">
              <span className="block text-slate-500 uppercase tracking-wider text-[9px]">SYSTEM_UPTIME</span>
              <span className="block text-slate-200 font-semibold">{uptime || "00d 00h 00m 00s"}</span>
              <span className="block text-[10px] text-emerald-400">99.99% Node SLA</span>
            </div>
          </div>

          {/* Metric 3: Health & Response Ping */}
          <div className="flex items-center gap-4 p-2">
            <div className="p-3 rounded-lg bg-neon-purple/5 border border-neon-purple/20 text-neon-purple">
              <Activity className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs w-full">
              <span className="block text-slate-500 uppercase tracking-wider text-[9px]">RESPONSE_LATENCY</span>
              <div className="flex items-center gap-2">
                <span className="block text-slate-200 font-semibold">{latency}ms</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-400">Health: {health.toFixed(3)}%</span>
              </div>
              {/* CPU Load bar */}
              <div className="mt-1 w-full bg-neutral-800 h-1 rounded overflow-hidden">
                <div 
                  className="bg-neon-purple h-full transition-all duration-1000" 
                  style={{ width: `${cpu * 5}%` }}
                />
              </div>
            </div>
          </div>

          {/* Metric 4: Thread Process */}
          <div className="flex items-center gap-4 p-2">
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="font-mono text-xs overflow-hidden">
              <span className="block text-slate-500 uppercase tracking-wider text-[9px]">ACTIVE_PROCESS_THREAD</span>
              <span className="block text-amber-400 font-semibold truncate animate-pulse">
                {currentProcess}
              </span>
              <span className="block text-[10px] text-slate-400">Task Scheduler [OK]</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default StatusPanel;
