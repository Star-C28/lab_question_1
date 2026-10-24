import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="w-5 h-5 text-purple-400" />
        <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">Terms of Service</span>
      </div>
      <h1 className="text-3xl font-black text-white">Terms and Conditions</h1>
      <p className="text-xs text-slate-400 font-mono">Last Updated: October 2026</p>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">1. Acceptance of Terms</h2>
        <p>
          By accessing and playing games on PlayZone, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, please do not use our online gaming portal.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">2. Free Usage & Availability</h2>
        <p>
          PlayZone offers free access to browser-based games for personal, non-commercial entertainment. While we strive for 100% uptime, games are provided on an "as-is" and "as-available" basis.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">3. Fair Play & High Scores</h2>
        <p>
          Players must not use automated bots or scripts to manipulate or tamper with game state or high-score leaderboards.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-base font-bold text-white">4. Intellectual Property</h2>
        <p>
          All game code, designs, logos, and portal assets are intellectual property of the PlayZone engineering project authors.
        </p>
      </section>
    </div>
  );
};
