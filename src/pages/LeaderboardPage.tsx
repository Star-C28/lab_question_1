import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Medal, Search, Flame, Gamepad2, ArrowRight } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { AdPlaceholder } from '../components/common/AdPlaceholder';

export const LeaderboardPage: React.FC = () => {
  const { games, leaderboard } = useGame();
  const [selectedGameId, setSelectedGameId] = useState<string>('all');
  const [playerSearch, setPlayerSearch] = useState<string>('');

  const filteredLeaderboard = leaderboard
    .filter((entry) => {
      const matchGame = selectedGameId === 'all' || entry.gameId === selectedGameId;
      const matchPlayer = entry.playerName
        .toLowerCase()
        .includes(playerSearch.toLowerCase());
      return matchGame && matchPlayer;
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>Competitive High Scores</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            PlayZone Hall of Fame
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global leaderboard recorded from HTML5 browser gaming sessions across PlayZone.
          </p>
        </div>

        <Link
          to="/games"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all self-start md:self-auto"
        >
          <span>Play & Compete</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#172033] border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Game Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedGameId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              selectedGameId === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            All Games
          </button>
          {games
            .filter((g) => g.gameType === 'internal')
            .map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGameId(g.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  selectedGameId === g.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {g.title}
              </button>
            ))}
        </div>

        {/* Player Name Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by player name..."
            value={playerSearch}
            onChange={(e) => setPlayerSearch(e.target.value)}
            className="w-full bg-[#0B1020] border border-slate-700 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Leaderboard Table Container */}
      <div className="bg-[#172033] border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-700/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] bg-slate-900/60">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4">Game Title</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-4">Notes</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-black">
                      {idx === 0 ? (
                        <div className="flex items-center gap-1.5 text-amber-400 text-base">
                          <Medal className="w-5 h-5 fill-amber-400" />
                          <span>1st</span>
                        </div>
                      ) : idx === 1 ? (
                        <div className="flex items-center gap-1.5 text-slate-300 text-base">
                          <Medal className="w-5 h-5 fill-slate-300" />
                          <span>2nd</span>
                        </div>
                      ) : idx === 2 ? (
                        <div className="flex items-center gap-1.5 text-amber-600 text-base">
                          <Medal className="w-5 h-5 fill-amber-600" />
                          <span>3rd</span>
                        </div>
                      ) : (
                        <span className="font-mono text-slate-400">#{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-black text-white shadow-sm">
                          {item.playerName.charAt(0)}
                        </div>
                        <span>{item.playerName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        to={`/game/${item.gameId}`}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold"
                      >
                        {item.gameTitle}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-amber-400 text-base">
                      {item.score.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {item.note || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                      {item.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                    No scores found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ad slot */}
      <AdPlaceholder format="banner" />
    </div>
  );
};
