import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  Heart,
  Github,
  Twitter,
  Youtube,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080C18] border-t border-slate-800 text-slate-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white">
                Play<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Zone</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-4">
              PlayZone is your premium portal for instant, free HTML5 browser games. No downloads, zero installs, play anywhere on desktop, tablet, and mobile with live high-score leaderboards.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" /> Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-cyan-400 transition-colors">
                  All Games Catalog
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-cyan-400 transition-colors">
                  High Scores & Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/premium" className="hover:text-cyan-400 transition-colors">
                  PlayZone Premium VIP
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-purple-400 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" /> Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/games?category=Arcade" className="hover:text-purple-400 transition-colors">
                  Arcade Classics
                </Link>
              </li>
              <li>
                <Link to="/games?category=Brain Training" className="hover:text-purple-400 transition-colors">
                  Brain Training & IQ
                </Link>
              </li>
              <li>
                <Link to="/games?category=Puzzle" className="hover:text-purple-400 transition-colors">
                  Puzzle & Logic
                </Link>
              </li>
              <li>
                <Link to="/games?category=Action" className="hover:text-purple-400 transition-colors">
                  Action & Reflex
                </Link>
              </li>
              <li>
                <Link to="/games?category=Racing" className="hover:text-purple-400 transition-colors">
                  Racing & Speed
                </Link>
              </li>
            </ul>
          </div>

          {/* University Project & Legal */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Lab Project
            </h4>
            <ul className="space-y-2 text-xs mb-4">
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-emerald-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
            <div className="p-2.5 rounded-xl bg-[#172033] border border-slate-700/60 text-[11px] text-slate-300">
              <span className="font-bold text-cyan-400 block mb-0.5">Web Engineering Lab</span>
              Demonstrable full-stack frontend portal with 5 custom HTML5 canvas games.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} PlayZone. Built with React, TypeScript & HTML5 Canvas.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Free Browser Games</span>
            <span>•</span>
            <span>No Installation Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
