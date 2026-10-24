import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  Flame,
  ShieldCheck,
  RefreshCw,
  Download,
  Upload,
  Layers,
  Gamepad2,
  Check,
  AlertTriangle,
  X,
  ExternalLink,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Game, GameCategory } from '../types/game';
import { createNeonGameThumbnail } from '../data/initialGames';

export const AdminPage: React.FC = () => {
  const {
    games,
    categories,
    addGame,
    updateGame,
    deleteGame,
    toggleFeatured,
    resetToDefaults,
    exportDatabase,
    importDatabase,
  } = useGame();

  const [activeTab, setActiveTab] = useState<'games' | 'categories' | 'tools'>('games');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Form states for Add / Edit
  const [formTitle, setFormTitle] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('');
  const [formShortDesc, setFormShortDesc] = useState<string>('');
  const [formCategory, setFormCategory] = useState<string>('Arcade');
  const [formThumbnail, setFormThumbnail] = useState<string>('');
  const [formGameType, setFormGameType] = useState<'internal' | 'embed'>('internal');
  const [formInternalId, setFormInternalId] = useState<'snake' | 'breakout' | 'memory' | 'puzzle15' | 'tictactoe'>('snake');
  const [formEmbedUrl, setFormEmbedUrl] = useState<string>('');
  const [formFeatured, setFormFeatured] = useState<boolean>(false);
  const [formRating, setFormRating] = useState<number>(4.8);

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormShortDesc('');
    setFormCategory('Arcade');
    setFormThumbnail('');
    setFormGameType('internal');
    setFormInternalId('snake');
    setFormEmbedUrl('');
    setFormFeatured(false);
    setFormRating(4.8);
    setEditingGame(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (game: Game) => {
    setEditingGame(game);
    setFormTitle(game.title);
    setFormDescription(game.description);
    setFormShortDesc(game.shortDescription);
    setFormCategory(game.category);
    setFormThumbnail(game.thumbnail);
    setFormGameType(game.gameType);
    if (game.internalId) setFormInternalId(game.internalId);
    setFormEmbedUrl(game.embedUrl || '');
    setFormFeatured(game.featured);
    setFormRating(game.rating);
    setIsAddModalOpen(true);
  };

  const handleGenerateNeonThumbnail = () => {
    if (!formTitle) {
      alert('Please enter a Game Title first to generate a thumbnail.');
      return;
    }
    const generated = createNeonGameThumbnail(
      formTitle.toUpperCase(),
      formCategory,
      '#8B5CF6',
      '#06B6D4',
      '🕹️'
    );
    setFormThumbnail(generated);
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();

    const thumbnailFinal =
      formThumbnail ||
      createNeonGameThumbnail(formTitle.toUpperCase(), formCategory, '#8B5CF6', '#06B6D4', '🎮');

    const defaultInstructions = [
      'Follow on-screen instructions and controls to play.',
      'Achieve the highest score possible and submit your name to the leaderboard.',
      'Use keyboard controls on desktop or touch on mobile devices.',
    ];

    const defaultControls = [
      { key: 'Mouse / Touch', action: 'Primary Game Interaction' },
      { key: 'Arrow Keys / WASD', action: 'Navigation & Direction' },
    ];

    if (editingGame) {
      updateGame(editingGame.id, {
        title: formTitle,
        description: formDescription,
        shortDescription: formShortDesc || formDescription.slice(0, 80) + '...',
        category: formCategory,
        thumbnail: thumbnailFinal,
        gameType: formGameType,
        internalId: formGameType === 'internal' ? formInternalId : undefined,
        embedUrl: formGameType === 'embed' ? formEmbedUrl : undefined,
        featured: formFeatured,
        rating: Number(formRating),
      });
      setStatusMessage(`Game "${formTitle}" successfully updated!`);
    } else {
      addGame({
        title: formTitle,
        description: formDescription,
        shortDescription: formShortDesc || formDescription.slice(0, 80) + '...',
        category: formCategory,
        thumbnail: thumbnailFinal,
        gameType: formGameType,
        internalId: formGameType === 'internal' ? formInternalId : undefined,
        embedUrl: formGameType === 'embed' ? formEmbedUrl : undefined,
        featured: formFeatured,
        popularity: 90,
        rating: Number(formRating),
        tags: [formCategory, 'Browser', 'Free'],
        instructions: defaultInstructions,
        controls: defaultControls,
      });
      setStatusMessage(`New game "${formTitle}" added to PlayZone!`);
    }

    setIsAddModalOpen(false);
    resetForm();
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleDelete = (id: string) => {
    deleteGame(id);
    setDeleteConfirmId(null);
    setStatusMessage('Game successfully removed from directory.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleExportJson = () => {
    const json = exportDatabase();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playzone_database_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importDatabase(content)) {
        setStatusMessage('Database successfully imported!');
      } else {
        alert('Invalid JSON file schema. Import cancelled.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered games for management table
  const filteredGames = games.filter((g) => {
    const matchSearch =
      g.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      g.category.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat =
      selectedCategoryFilter === 'All' || g.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  const totalPlays = games.reduce((acc, cur) => acc + cur.plays, 0);
  const featuredCount = games.filter((g) => g.featured).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Demo Notice Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-950/70 via-[#172033] to-slate-900 border border-purple-500/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Admin Demonstration Portal</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                LAB MODE ACTIVE
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Any changes made here persistently update the portal in real-time. Use the Reset button anytime to restore default presets.
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Game</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>✓ {statusMessage}</span>
          <button onClick={() => setStatusMessage('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#172033] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Total Games</span>
          <span className="text-3xl font-black text-white font-mono mt-1 block">{games.length}</span>
          <span className="text-[11px] text-cyan-400 mt-1 block">Live in directory</span>
        </div>

        <div className="bg-[#172033] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Total Plays</span>
          <span className="text-3xl font-black text-amber-400 font-mono mt-1 block">
            {totalPlays.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all games</span>
        </div>

        <div className="bg-[#172033] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Categories</span>
          <span className="text-3xl font-black text-purple-400 font-mono mt-1 block">
            {categories.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Configured genres</span>
        </div>

        <div className="bg-[#172033] border border-slate-800 rounded-2xl p-4 shadow-md">
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Featured</span>
          <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">
            {featuredCount}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Homepage spotlight</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
            activeTab === 'games'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Manage Games ({games.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
            activeTab === 'categories'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
            activeTab === 'tools'
              ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Database Tools & Backup
        </button>
      </div>

      {/* TAB 1: Games Management */}
      {activeTab === 'games' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#172033] border border-slate-800 p-3 rounded-2xl">
            <input
              type="text"
              placeholder="Search games by title..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full sm:w-64 bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400"
            />

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>

              <button
                onClick={openAddModal}
                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Game</span>
              </button>
            </div>
          </div>

          {/* Games Table */}
          <div className="bg-[#172033] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-900/60">
                    <th className="py-3 px-4">Game</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Type</th>
                    <th className="py-3 px-3">Plays</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredGames.map((g) => (
                    <tr key={g.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={g.thumbnail}
                            alt={g.title}
                            className="w-10 h-7 rounded object-cover bg-slate-900 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-white block text-sm">{g.title}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1">
                              {g.shortDescription}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-semibold text-cyan-300">
                          {g.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-[11px] text-slate-300">
                          {g.gameType === 'internal' ? `Internal (${g.internalId})` : 'Embedded URL'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {g.plays.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-400">
                        ★ {g.rating.toFixed(1)}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => toggleFeatured(g.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            g.featured
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : 'bg-slate-800 border-slate-700 text-slate-500'
                          }`}
                          title="Toggle featured status"
                        >
                          <Star className={`w-3.5 h-3.5 ${g.featured ? 'fill-amber-400' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(g)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                            title="Edit Game"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(g.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-300 hover:text-rose-400"
                            title="Delete Game"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Categories Management */}
      {activeTab === 'categories' && (
        <div className="bg-[#172033] border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-2">Configured Categories</h3>
          <p className="text-xs text-slate-400 mb-6">
            Categories organize game items across navigation menus and catalog filter bars.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => {
              const gameCount = games.filter((g) => g.category === c.name).length;
              return (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#0B1020] border border-slate-800 flex items-start justify-between"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{c.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                    <span className="text-[11px] font-mono text-cyan-400 mt-2 block">
                      {gameCount} assigned games
                    </span>
                  </div>
                  <div
                    className="w-3 h-3 rounded-full shrink-0 mt-1"
                    style={{ backgroundColor: c.color }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Database Tools & Backup */}
      {activeTab === 'tools' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#172033] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" /> Export & Backup Database
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export all games, categories, and player leaderboard high scores as a JSON backup file.
            </p>
            <button
              onClick={handleExportJson}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="bg-[#172033] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-purple-400" /> Import JSON Database
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restore a previously saved PlayZone JSON backup file into local storage.
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Upload Backup JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          <div className="md:col-span-2 bg-[#172033] border border-rose-500/30 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-400" /> Reset to University Lab Default Seed
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reset the games collection, categories, and high scores back to the pristine university lab demonstration state. This clears custom modifications from localStorage.
            </p>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all game data to university demo defaults?')) {
                  resetToDefaults();
                  setStatusMessage('Database reset to defaults successfully.');
                  setTimeout(() => setStatusMessage(''), 3000);
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 border border-rose-500 text-rose-200 hover:text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Database to Default</span>
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Game Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#172033] border border-purple-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl animate-fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
              <h3 className="text-lg font-bold text-white">
                {editingGame ? 'Edit Game Information' : 'Add New Game to PlayZone'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGame} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Game Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Neon Pinball Strike"
                  className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Initial Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Brief 1-sentence synopsis for catalog cards"
                  className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed gameplay rules, backstory, and instructions"
                  className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Game Engine Type</label>
                  <select
                    value={formGameType}
                    onChange={(e) => setFormGameType(e.target.value as 'internal' | 'embed')}
                    className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="internal">Internal HTML5 Canvas Engine</option>
                    <option value="embed">Embedded External HTML5 URL</option>
                  </select>
                </div>

                {formGameType === 'internal' ? (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Engine Game Preset</label>
                    <select
                      value={formInternalId}
                      onChange={(e) =>
                        setFormInternalId(
                          e.target.value as 'snake' | 'breakout' | 'memory' | 'puzzle15' | 'tictactoe'
                        )
                      }
                      className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="snake">Cyber Snake Engine</option>
                      <option value="breakout">Neon Breakout Engine</option>
                      <option value="memory">Memory Matrix Engine</option>
                      <option value="puzzle15">Sliding Puzzle Engine</option>
                      <option value="tictactoe">Tic Tac Toe AI Engine</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Embed URL (HTTPS)</label>
                    <input
                      type="url"
                      value={formEmbedUrl}
                      onChange={(e) => setFormEmbedUrl(e.target.value)}
                      placeholder="https://example.com/game.html"
                      className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-slate-300 font-bold">Thumbnail Artwork (URL or SVG)</label>
                  <button
                    type="button"
                    onClick={handleGenerateNeonThumbnail}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    ⚡ Auto-Generate Neon SVG
                  </button>
                </div>
                <input
                  type="text"
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="Paste image URL or click Auto-Generate"
                  className="w-full bg-[#0B1020] border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                />
                {formThumbnail && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-slate-700 bg-black">
                    <img src={formThumbnail} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formFeatured}
                  onChange={(e) => setFormFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600"
                />
                <label htmlFor="featuredToggle" className="text-slate-300 font-semibold cursor-pointer">
                  Feature on Homepage Hero & Spotlights
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md"
                >
                  {editingGame ? 'Save Changes' : 'Create Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#172033] border border-rose-500/40 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Confirm Game Removal</h3>
            <p className="text-xs text-slate-300 mt-1 mb-6">
              Are you sure you want to delete this game? This will also remove associated leaderboard scores.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md"
              >
                Delete Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
