import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  Code,
  Layers,
  Cpu,
  Shield,
  Zap,
  Sparkles,
  GraduationCap,
  CheckCircle,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4" />
          <span>Web Engineering University Lab Project</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">PlayZone</span>
        </h1>
        <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          A high-performance, cost-effective online gaming platform designed to run lightweight, responsive HTML5 browser games directly on any device without downloads or plugins.
        </p>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">Project Mission & Objectives</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            PlayZone was engineered as a comprehensive demonstration of modern client-side and full-stack web engineering principles. It highlights real-time rendering with HTML5 Canvas, robust component-driven state architecture with React and TypeScript, persistent browser storage, and an intuitive administrative portal.
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-cost architecture with zero paid third-party dependencies</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Five real, playable HTML5 canvas games with retro synthesized audio</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full CRUD admin control with instant public updates and data backup</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Accessible across desktop, tablet, and mobile with touch D-pads</span>
            </li>
          </ul>
        </div>

        <div className="bg-[#172033] border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-4 h-4 text-cyan-400" /> Technology Stack
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0B1020] border border-slate-800">
              <span className="font-bold text-purple-400 block mb-0.5">Frontend Core</span>
              <span className="text-slate-300">React.js 19 + TypeScript + Vite build pipeline</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1020] border border-slate-800">
              <span className="font-bold text-cyan-400 block mb-0.5">Styling & UI</span>
              <span className="text-slate-300">Tailwind CSS (Dark gaming palette: #0B1020, #172033, #8B5CF6, #06B6D4)</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1020] border border-slate-800">
              <span className="font-bold text-amber-400 block mb-0.5">Game Engines</span>
              <span className="text-slate-300">Native HTML5 2D Canvas API + Web Audio Synthesizer + Minimax AI</span>
            </div>
            <div className="p-3 rounded-xl bg-[#0B1020] border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-0.5">Persistence</span>
              <span className="text-slate-300">Reactive Browser LocalStorage with JSON backup and factory reset seed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white text-center">Core Engineering Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#172033] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">5 Playable Engines</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snake, Breakout, Memory Matrix, Sliding 15-Puzzle, and Tic Tac Toe with Minimax AI.
            </p>
          </div>

          <div className="bg-[#172033] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Administrative Dashboard</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time game catalog management, category organization, and database backup.
            </p>
          </div>

          <div className="bg-[#172033] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Instant High Scores</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Score persistence, player ranking medals, and customizable leaderboards.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl transition-all"
        >
          <span>Start Playing Now</span>
        </Link>
      </div>
    </div>
  );
};
