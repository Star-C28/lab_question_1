import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Search,
  Menu,
  X,
  Trophy,
  ShieldAlert,
  Sparkles,
  Heart,
  Layers,
  Compass,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const { games, favorites } = useGame();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/games?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
      setMobileMenuOpen(false);
    }
  };

  const filteredSuggestions = searchQuery.trim()
    ? games
        .filter((g) =>
          g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          g.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'All Games', to: '/games' },
    { label: 'Categories', to: '/#categories' },
    { label: 'Leaderboard', to: '/leaderboard' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1020]/90 backdrop-blur-md border-b border-purple-500/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:neon-glow-purple transition-all duration-300">
              <Gamepad2 className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  Play<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Zone</span>
                </span>
              </div>
              <span className="text-[10px] tracking-widest uppercase font-extrabold text-cyan-400 block -mt-1">
                Free Online Games
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive && !link.to.includes('#')
                      ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="w-full bg-[#172033] border border-slate-700/80 rounded-xl py-1.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </form>

            {/* Instant Search Dropdown */}
            {showSearchDropdown && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-[#172033] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-1">
                  {filteredSuggestions.map((g) => (
                    <Link
                      key={g.id}
                      to={`/game/${g.id}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-xs text-slate-200 transition-colors"
                    >
                      <img
                        src={g.thumbnail}
                        alt={g.title}
                        className="w-8 h-8 rounded-md object-cover bg-slate-900 shrink-0"
                      />
                      <div className="flex-1 truncate">
                        <span className="font-bold text-white block truncate">{g.title}</span>
                        <span className="text-[10px] text-cyan-400">{g.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Favorites, Admin Dashboard */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/games?fav=true"
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Favorites"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Admin</span>
            </Link>

            <Link
              to="/premium"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>VIP</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F172A] border-b border-purple-500/20 px-4 pt-3 pb-6 animate-fade-in">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#172033] border border-slate-700 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </div>
          </form>

          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/premium"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-amber-400 flex items-center gap-2 hover:bg-slate-800"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade to Premium</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm font-bold text-purple-400 flex items-center gap-2 hover:bg-slate-800"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
