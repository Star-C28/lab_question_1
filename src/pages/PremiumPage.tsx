import React, { useState } from 'react';
import { Crown, Check, Shield, Sparkles, Zap, Flame, Bell, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PremiumPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setNotified(true);
      try {
        confetti({ particleCount: 60, spread: 70 });
      } catch {}
    }
  };

  const perks = [
    {
      title: '100% Ad-Free Gaming',
      desc: 'Zero interstitial or banner advertisements across all games and pages.',
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: 'VIP Golden Crown Badge',
      desc: 'Exclusive glowing gold crown displayed next to your name on high-score boards.',
      icon: <Crown className="w-6 h-6 text-amber-400" />,
    },
    {
      title: 'Cloud Save Synchronization',
      desc: 'Seamlessly sync your game progress, levels, and unlocks across any browser or phone.',
      icon: <Zap className="w-6 h-6 text-purple-400" />,
    },
    {
      title: 'Early Beta Game Access',
      desc: 'Play brand new HTML5 arcade, puzzle, and action titles two weeks before public release.',
      icon: <Flame className="w-6 h-6 text-rose-400" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>VIP Early Access Tier</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-cyan-400">PlayZone Premium</span>
        </h1>
        <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          The ultimate gaming pass for browser gamers. Pure uninterrupted gameplay, zero ads, and exclusive VIP privileges.
        </p>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {perks.map((p, i) => (
          <div
            key={i}
            className="p-6 rounded-3xl bg-[#172033] border border-slate-800 hover:border-purple-500/40 transition-all flex items-start gap-4 shadow-xl"
          >
            <div className="p-3 rounded-2xl bg-[#0B1020] border border-slate-700 shrink-0">
              {p.icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">{p.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-[#172033] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Plan Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-700/80 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4 text-center">Free Player</th>
                <th className="py-3 px-4 text-center text-amber-400">VIP Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-3 px-4 font-medium text-white">Full Access to All 5+ Games</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Free</td>
                <td className="py-3 px-4 text-center text-emerald-400 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Ad-Free Gaming Experience</td>
                <td className="py-3 px-4 text-center text-slate-500">Google Ads shown</td>
                <td className="py-3 px-4 text-center text-amber-400 font-bold">✓ 100% Zero Ads</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Leaderboard High Score Submission</td>
                <td className="py-3 px-4 text-center text-emerald-400">✓ Included</td>
                <td className="py-3 px-4 text-center text-amber-400 font-bold">✓ Golden Crown Badge</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Early Beta Game Releases</td>
                <td className="py-3 px-4 text-center text-slate-500">Standard release</td>
                <td className="py-3 px-4 text-center text-amber-400 font-bold">✓ 14-Day Early Access</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Cross-Device Cloud Saves</td>
                <td className="py-3 px-4 text-center text-slate-500">Local storage</td>
                <td className="py-3 px-4 text-center text-amber-400 font-bold">✓ Instant Cloud Sync</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Early Access Waitlist (No real payment) */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-[#172033] to-[#0B1020] border border-amber-500/40 p-8 text-center max-w-xl mx-auto shadow-2xl">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2" />
        <h3 className="text-2xl font-black text-white">VIP Membership Coming Soon</h3>
        <p className="text-xs text-slate-300 mt-2 mb-6">
          PlayZone Premium will launch in our next major platform release. Register your email to reserve your free 30-day VIP beta pass!
        </p>

        {notified ? (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>You're on the VIP priority waitlist! We'll notify you on launch day.</span>
          </div>
        ) : (
          <form onSubmit={handleNotifyMe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for beta pass..."
              className="flex-1 bg-[#0B1020] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span>Notify Me</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
