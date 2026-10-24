import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Maximize,
  Minimize,
  RotateCcw,
  Star,
  Users,
  Heart,
  Share2,
  Trophy,
  ChevronRight,
  ShieldCheck,
  Gamepad2,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { SnakeGame } from '../components/games/SnakeGame';
import { BreakoutGame } from '../components/games/BreakoutGame';
import { MemoryMatchGame } from '../components/games/MemoryMatchGame';
import { NumberPuzzleGame } from '../components/games/NumberPuzzleGame';
import { TicTacToeGame } from '../components/games/TicTacToeGame';
import { EmbedGamePlayer } from '../components/games/EmbedGamePlayer';
import { GameCard } from '../components/common/GameCard';
import { AdPlaceholder } from '../components/common/AdPlaceholder';

export const GameDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { games, getGameById, recordPlay, saveScore, getHighScoresForGame, toggleFavorite, isFavorite } = useGame();

  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'controls' | 'leaderboard'>('instructions');
  const [gameKey, setGameKey] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Score submission modal state
  const [showScoreModal, setShowScoreModal] = useState<boolean>(false);
  const [submittedScore, setSubmittedScore] = useState<number>(0);
  const [playerNameInput, setPlayerNameInput] = useState<string>('Player One');

  const game = getGameById(id || '');

  // Record play session on mount
  useEffect(() => {
    if (game) {
      recordPlay(game.id);
      window.scrollTo(0, 0);
    }
  }, [game?.id]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-black text-white mb-2">Game Not Found</h2>
        <p className="text-slate-400 mb-6">The requested game ID does not exist in the PlayZone directory.</p>
        <Link
          to="/games"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md"
        >
          Return to All Games
        </Link>
      </div>
    );
  }

  const highScores = getHighScoresForGame(game.id);
  const relatedGames = games.filter((g) => g.id !== game.id && g.category === game.category).slice(0, 4);

  const toggleFullscreenMode = () => {
    if (!gameContainerRef.current) return;
    if (!document.fullscreenElement) {
      gameContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleScoreCaptured = (score: number) => {
    setSubmittedScore(score);
    setShowScoreModal(true);
  };

  const handleConfirmScoreSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    saveScore(game.id, submittedScore, playerNameInput);
    setShowScoreModal(false);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumbs Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/games" className="hover:text-white transition-colors">
          Games
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/games?category=${encodeURIComponent(game.category)}`}
          className="text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {game.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-white font-medium truncate max-w-[200px]">{game.title}</span>
      </nav>

      {/* Main Game Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Game Player & Tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Top Title Bar with Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-[#172033] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  {game.category}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {game.plays.toLocaleString()} plays
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {game.rating.toFixed(1)}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{game.title}</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(game.id)}
                aria-label="Favorite"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite(game.id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                  }`}
                />
              </button>

              <button
                onClick={handleShare}
                aria-label="Share game"
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors relative"
                title="Copy share link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setGameKey((k) => k + 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-colors"
                title="Restart game session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>

              <button
                onClick={toggleFullscreenMode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Play Canvas Container */}
          <div
            ref={gameContainerRef}
            className={`relative rounded-3xl bg-[#090D1A] border-2 border-purple-500/30 p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center min-h-[460px] overflow-hidden ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none p-8' : ''
            }`}
          >
            {/* Render the specific real game based on internalId or embed */}
            {game.gameType === 'embed' ? (
              <EmbedGamePlayer key={gameKey} embedUrl={game.embedUrl} title={game.title} />
            ) : game.internalId === 'snake' ? (
              <SnakeGame key={gameKey} onScoreSubmit={handleScoreCaptured} gameId={game.id} />
            ) : game.internalId === 'breakout' ? (
              <BreakoutGame key={gameKey} onScoreSubmit={handleScoreCaptured} />
            ) : game.internalId === 'memory' ? (
              <MemoryMatchGame key={gameKey} onScoreSubmit={handleScoreCaptured} />
            ) : game.internalId === 'puzzle15' ? (
              <NumberPuzzleGame key={gameKey} onScoreSubmit={handleScoreCaptured} />
            ) : game.internalId === 'tictactoe' ? (
              <TicTacToeGame key={gameKey} onScoreSubmit={handleScoreCaptured} />
            ) : (
              <SnakeGame key={gameKey} onScoreSubmit={handleScoreCaptured} gameId={game.id} />
            )}
          </div>

          {/* Ad Below Game Container */}
          <AdPlaceholder format="banner" />

          {/* Game Information Tabs: Instructions, Controls, Local High Scores */}
          <div className="bg-[#172033] border border-slate-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
              <button
                onClick={() => setActiveTab('instructions')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'instructions'
                    ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                How to Play
              </button>
              <button
                onClick={() => setActiveTab('controls')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'controls'
                    ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Controls & Keys
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'leaderboard'
                    ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                High Scores ({highScores.length})
              </button>
            </div>

            {/* Instructions Tab Content */}
            {activeTab === 'instructions' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">{game.description}</p>
                <div>
                  <h4 className="text-xs font-bold uppercase text-cyan-400 tracking-wider mb-2">
                    Key Objectives & Rules
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                    {game.instructions.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="text-xs text-slate-400 font-semibold">Tags:</span>
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800 text-[11px] text-slate-300 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Controls Tab Content */}
            {activeTab === 'controls' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {game.controls.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-slate-800"
                    >
                      <span className="text-xs text-slate-400 font-medium">{c.action}</span>
                      <kbd className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-400 font-mono text-xs font-bold">
                        {c.key}
                      </kbd>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 pt-2">
                  Mobile devices automatically display responsive on-screen touch D-Pad controls where applicable.
                </p>
              </div>
            )}

            {/* High Scores Tab Content */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-3">
                {highScores.length > 0 ? (
                  <div className="divide-y divide-slate-800 text-xs">
                    {highScores.map((h, i) => (
                      <div key={h.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-400 w-6">#{i + 1}</span>
                          <span className="font-bold text-white">{h.playerName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-extrabold text-amber-400">
                            {h.score.toLocaleString()} pts
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">{h.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">
                    No high scores logged yet. Be the first champion by playing now!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Ads & Related Games (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Game Quick Info Card */}
          <div className="bg-[#172033] border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Game Details
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Category:</span>
                <span className="text-cyan-400 font-bold">{game.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Technology:</span>
                <span className="text-slate-200">HTML5 Canvas / React</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Rating:</span>
                <span className="text-amber-400 font-bold">★ {game.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Total Plays:</span>
                <span className="text-white font-mono">{game.plays.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Release Date:</span>
                <span className="text-slate-300 font-mono">{game.createdAt.split('T')[0]}</span>
              </div>
            </div>
          </div>

          {/* Sidebar Advertisement */}
          <AdPlaceholder format="sidebar" />

          {/* Related Games Recommendation Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-400" /> Related Games
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {relatedGames.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/game/${rel.id}`}
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-[#172033] hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 transition-all"
                >
                  <img
                    src={rel.thumbnail}
                    alt={rel.title}
                    className="w-16 h-12 rounded-lg object-cover bg-slate-900 shrink-0"
                  />
                  <div className="flex-1 truncate">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                      {rel.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 block">{rel.category} • ★ {rel.rating}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Score Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#172033] border border-purple-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-fade-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center mx-auto mb-3 text-white shadow-lg">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-white">Save High Score</h3>
            <p className="text-xs text-slate-300 mt-1 mb-4">
              You scored <span className="text-amber-400 font-mono font-bold text-base">{submittedScore}</span> points! Enter your handle for the PlayZone leaderboard.
            </p>

            <form onSubmit={handleConfirmScoreSubmission} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={20}
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  placeholder="Player Nickname"
                  className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowScoreModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-md"
                >
                  Submit Score
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
