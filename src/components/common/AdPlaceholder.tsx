import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface AdPlaceholderProps {
  format?: 'banner' | 'sidebar' | 'leaderboard' | 'game-side';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'banner',
  className = '',
}) => {
  return (
    <div
      className={`w-full relative overflow-hidden rounded-xl border border-dashed border-slate-700/80 bg-[#0F172A]/70 text-slate-400 p-3 flex flex-col items-center justify-center transition-all ${className}`}
    >
      <div className="absolute top-1.5 right-2 flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded">
        <span>Advertisement</span>
      </div>

      {format === 'leaderboard' && (
        <div className="py-4 px-6 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">
                Partner Showcase
              </span>
              <h5 className="text-sm sm:text-base font-bold text-white">
                Ultra-Low Latency Cloud Gaming Network
              </h5>
              <p className="text-xs text-slate-400">
                Stream 4K PC games directly on your browser with zero latency.
              </p>
            </div>
          </div>
          <span className="shrink-0 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700">
            <span>Sponsored Link</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </span>
        </div>
      )}

      {format === 'sidebar' && (
        <div className="py-6 px-4 flex flex-col items-center text-center w-full">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">
            Featured Partner
          </span>
          <h5 className="text-sm font-bold text-white mb-1">
            Pro Mechanical Keyboards & Headsets
          </h5>
          <p className="text-xs text-slate-400 mb-3 max-w-[220px]">
            Engineered for esports champions. Up to 40% student discount.
          </p>
          <span className="px-3.5 py-1.5 rounded-lg bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold">
            Explore Collection
          </span>
        </div>
      )}

      {format === 'banner' && (
        <div className="py-2.5 px-4 flex items-center justify-between w-full text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-semibold text-slate-300">
              Google AdSense Placement Area · 728×90 Responsive Banner
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Ads by Google</span>
        </div>
      )}

      {format === 'game-side' && (
        <div className="py-4 px-3 flex flex-col items-center text-center">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Ad Space (300×250)
          </span>
          <div className="w-full h-32 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-3">
            <p className="text-xs text-slate-400">
              Your Banner Here <br />
              <span className="text-cyan-400 font-mono text-[10px]">ad-slot-game-play</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
