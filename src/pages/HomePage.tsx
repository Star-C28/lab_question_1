import React from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Gamepad2,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Puzzle,
  Swords,
  Brain,
  Compass,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameCard } from '../components/common/GameCard';
import { AdPlaceholder } from '../components/common/AdPlaceholder';
import { PremiumBanner } from '../components/common/PremiumBanner';

export const HomePage: React.FC = () => {
  const { games, categories, leaderboard } = useGame();

  // Featured hero game
  const heroGame = games.find((g) => g.id === 'game-snake') || games[0];

  // Popular games sorted by plays
  const popularGames = [...games].sort((a, b) => b.plays - a.plays).slice(0, 4);

  // New arrivals sorted by date
  const newGames = [...games]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  // Top 5 Leaderboard entries
  const topScores = [...leaderboard].sort((a, b) => b.score - a.score).slice(0, 5);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'puzzle':
        return <Puzzle className="w-5 h-5 text-cyan-400" />;
      case 'action':
        return <Swords className="w-5 h-5 text-rose-400" />;
      case 'racing':
        return <Flame className="w-5 h-5 text-amber-400" />;
      case 'arcade':
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'adventure':
        return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'brain training':
        return <Brain className="w-5 h-5 text-pink-400" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="space-y-12 pb-12">
      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdPlaceholder format="banner" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#172033] via-[#0F172A] to-[#0B1020] border border-purple-500/30 p-8 sm:p-12 lg:p-16 shadow-2xl overflow-hidden bg-grid-pattern">
          {/* Neon backdrop glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Next-Gen Web Gaming Portal</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Play Amazing Games <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400">
                  for Free!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover hundreds of exciting browser games. No downloads, no installation. Just click and play instantly with smooth controls and real-time leaderboards!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={`/game/${heroGame.id}`}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl transition-all transform active:scale-95 neon-glow-purple"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>Play Now</span>
                </Link>

                <Link
                  to="/games"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 font-bold text-base transition-colors"
                >
                  <span>Explore Games</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free Forever</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Zero Downloads</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Mobile & Desktop Ready</span>
                </div>
              </div>
            </div>

            {/* Right Hero Featured Game Display */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md group">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600 to-cyan-500 opacity-60 blur-lg group-hover:opacity-100 transition duration-500" />
                <div className="relative rounded-2xl bg-[#172033] border border-purple-500/50 p-4 shadow-2xl">
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3">
                    <img
                      src={heroGame.thumbnail}
                      alt={heroGame.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-purple-600/90 text-white text-[10px] font-bold uppercase tracking-wider">
                      Featured Pick
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-white text-base">{heroGame.title}</h4>
                      <p className="text-xs text-slate-400">{heroGame.category} • {heroGame.plays.toLocaleString()} plays</p>
                    </div>
                    <Link
                      to={`/game/${heroGame.id}`}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Play</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Game Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Choose your genre and dive straight into the action
            </p>
          </div>
          <Link
            to="/games"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const count = games.filter((g) => g.category === cat.name).length;
            return (
              <Link
                key={cat.id}
                to={`/games?category=${encodeURIComponent(cat.name)}`}
                className="group relative bg-[#172033] hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0B1020] border border-slate-700/80 group-hover:border-cyan-400/60 flex items-center justify-center mb-3 transition-colors shadow-inner">
                  {getCategoryIcon(cat.name)}
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  {count} {count === 1 ? 'Game' : 'Games'}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Games Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Popular Games
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Most-played games loved by thousands of players worldwide
            </p>
          </div>
          <Link
            to="/games?sort=popular"
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>See More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} badge="Popular" />
          ))}
        </div>
      </section>

      {/* Mid-page Advertisement Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder format="leaderboard" />
      </div>

      {/* New Games Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                New Games
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Recently added instant titles fresh from the lab
            </p>
          </div>
          <Link
            to="/games?sort=newest"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>All New Games</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newGames.map((game) => (
            <GameCard key={game.id} game={game} badge="New" />
          ))}
        </div>
      </section>

      {/* PlayZone Premium Promo Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PremiumBanner />
      </div>

      {/* Leaderboard Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#172033] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Hall of Fame · Leaderboard
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Top high scores achieved on local browser games
              </p>
            </div>
            <Link
              to="/leaderboard"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Leaderboards</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-700/80 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Player</th>
                  <th className="py-3 px-3">Game Title</th>
                  <th className="py-3 px-3">Score</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {topScores.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-3 font-black">
                      {idx === 0 ? (
                        <span className="text-amber-400 text-base">🥇 #1</span>
                      ) : idx === 1 ? (
                        <span className="text-slate-300 text-base">🥈 #2</span>
                      ) : idx === 2 ? (
                        <span className="text-amber-600 text-base">🥉 #3</span>
                      ) : (
                        <span className="text-slate-400 font-mono">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-[10px] text-white">
                        {item.playerName.charAt(0)}
                      </div>
                      <span>{item.playerName}</span>
                    </td>
                    <td className="py-3.5 px-3 text-cyan-400 font-medium">
                      {item.gameTitle}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-400 text-sm">
                      {item.score.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-xs">
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};
