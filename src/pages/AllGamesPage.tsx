import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  X,
  Gamepad2,
  Heart,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { GameCard } from '../components/common/GameCard';
import { AdPlaceholder } from '../components/common/AdPlaceholder';

export const AllGamesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { games, categories, favorites } = useGame();

  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'popular';
  const onlyFavorites = searchParams.get('fav') === 'true';

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [showOnlyFavs, setShowOnlyFavs] = useState<boolean>(onlyFavorites);

  // Sync state with URL params changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);

    const cat = searchParams.get('category');
    if (cat !== null) setSelectedCategory(cat);

    const fav = searchParams.get('fav');
    if (fav === 'true') setShowOnlyFavs(true);
  }, [searchParams]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = game.title.toLowerCase().includes(q);
          const matchesDesc = game.description.toLowerCase().includes(q);
          const matchesCategory = game.category.toLowerCase().includes(q);
          const matchesTags = game.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTags) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && game.category !== selectedCategory) {
          return false;
        }

        // Favorites filter
        if (showOnlyFavs && !favorites.includes(game.id)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.plays - a.plays;
        if (sortBy === 'newest')
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, searchQuery, selectedCategory, sortBy, showOnlyFavs, favorites]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('popular');
    setShowOnlyFavs(false);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">
            Library Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            All Free Online Games
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse our entire collection of instant HTML5 browser games. No downloads needed.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
          <span>Showing {filteredGames.length} of {games.length} games</span>
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-[#172033] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="Search by title, tag, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B1020] border border-slate-700 rounded-xl py-2.5 pl-10 pr-9 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="md:col-span-3 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#0B1020] border border-slate-700 rounded-xl py-2.5 px-3 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-purple-400 appearance-none cursor-pointer"
            >
              <option value="popular">Sort: Most Popular</option>
              <option value="newest">Sort: Newly Added</option>
              <option value="rating">Sort: Highest Rated</option>
              <option value="title">Sort: Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
          </div>

          {/* Favorites toggle button */}
          <div className="md:col-span-3 flex items-center gap-2">
            <button
              onClick={() => setShowOnlyFavs(!showOnlyFavs)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                showOnlyFavs
                  ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  : 'bg-[#0B1020] border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${showOnlyFavs ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
              />
              <span>Favorites Only ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner Ad */}
      <AdPlaceholder format="banner" />

      {/* Game Cards Grid */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 px-6 text-center rounded-3xl bg-[#172033] border border-slate-800 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 mb-4">
            <Gamepad2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">No Games Found</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
            We couldn't find any games matching "{searchQuery}". Try adjusting your keywords or clearing the category filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
