import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Heart, Users, Flame } from 'lucide-react';
import { Game } from '../../types/game';
import { useGame } from '../../context/GameContext';

interface GameCardProps {
  game: Game;
  badge?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ game, badge }) => {
  const { toggleFavorite, isFavorite } = useGame();
  const favorited = isFavorite(game.id);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'puzzle':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'action':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'racing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'arcade':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'adventure':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'brain training':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="group relative bg-[#172033] border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col hover:-translate-y-1.5">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B1020]">
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#172033] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-auto">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md uppercase tracking-wider ${getCategoryColor(
              game.category
            )}`}
          >
            {game.category}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(game.id);
            }}
            aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-slate-700/60 text-slate-300 transition-colors backdrop-blur-md"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-white'
              }`}
            />
          </button>
        </div>

        {/* Featured / Popular badge */}
        {(badge || game.featured) && (
          <div className="absolute bottom-2 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] uppercase tracking-wider backdrop-blur-xs">
            <Flame className="w-3 h-3 fill-slate-950" />
            <span>{badge || 'Featured'}</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors line-clamp-1">
              {game.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Footer meta + Play button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{game.plays.toLocaleString()} plays</span>
          </div>

          <Link
            to={`/game/${game.id}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 group-hover:neon-glow-cyan"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Play Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
