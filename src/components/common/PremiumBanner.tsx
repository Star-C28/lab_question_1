import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Shield, Crown, ArrowRight } from 'lucide-react';

export const PremiumBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950 via-[#172033] to-slate-900 border border-purple-500/30 p-6 sm:p-8 shadow-2xl my-10">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Experience</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-cyan-400">PlayZone Premium</span>
          </h3>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Take your gaming to the next level. Enjoy a 100% ad-free experience, unlimited cloud save sync, exclusive seasonal tournament badges, and early beta access to brand new HTML5 releases.
          </p>

          {/* Key perks pills */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Ad-Free Gaming</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Instant Turbo Loading</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Crown className="w-4 h-4 text-purple-400" />
              <span>Golden Leaderboard Crown</span>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/premium"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl transition-transform active:scale-95"
          >
            <span>Learn More & VIP Perks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
