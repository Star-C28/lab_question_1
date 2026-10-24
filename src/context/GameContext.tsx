import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, CategoryInfo, LeaderboardEntry, GameCategory } from '../types/game';
import { INITIAL_GAMES, INITIAL_CATEGORIES, INITIAL_LEADERBOARDS } from '../data/initialGames';

interface GameContextType {
  games: Game[];
  categories: CategoryInfo[];
  leaderboard: LeaderboardEntry[];
  favorites: string[];
  addGame: (game: Omit<Game, 'id' | 'createdAt' | 'plays'>) => Game;
  updateGame: (id: string, game: Partial<Game>) => void;
  deleteGame: (id: string) => void;
  toggleFeatured: (id: string) => void;
  recordPlay: (id: string) => void;
  saveScore: (gameId: string, score: number, playerName: string, note?: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getGameById: (id: string) => Game | undefined;
  getHighScoresForGame: (gameId: string) => LeaderboardEntry[];
  resetToDefaults: () => void;
  exportDatabase: () => string;
  importDatabase: (jsonString: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEYS = {
  GAMES: 'playzone_games_data_v1',
  CATEGORIES: 'playzone_categories_v1',
  LEADERBOARD: 'playzone_leaderboard_v1',
  FAVORITES: 'playzone_user_favorites_v1',
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GAMES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load games from localStorage', e);
    }
    return INITIAL_GAMES;
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
    return INITIAL_CATEGORIES;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    }
    return INITIAL_LEADERBOARDS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
    return ['game-snake', 'game-breakout'];
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
    } catch (e) {
      console.error('Error saving games', e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error('Error saving categories', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(leaderboard));
    } catch (e) {
      console.error('Error saving leaderboard', e);
    }
  }, [leaderboard]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (e) {
      console.error('Error saving favorites', e);
    }
  }, [favorites]);

  const addGame = (gameData: Omit<Game, 'id' | 'createdAt' | 'plays'>): Game => {
    const newGame: Game = {
      ...gameData,
      id: `game-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      plays: 1,
    };
    setGames((prev) => [newGame, ...prev]);
    return newGame;
  };

  const updateGame = (id: string, updatedFields: Partial<Game>) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updatedFields } : g))
    );
  };

  const deleteGame = (id: string) => {
    setGames((prev) => prev.filter((g) => g.id !== id));
    setLeaderboard((prev) => prev.filter((entry) => entry.gameId !== id));
    setFavorites((prev) => prev.filter((favId) => favId !== id));
  };

  const toggleFeatured = (id: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, featured: !g.featured } : g))
    );
  };

  const recordPlay = (id: string) => {
    setGames((prev) =>
      prev.map((g) => (g.id === id ? { ...g, plays: g.plays + 1 } : g))
    );
  };

  const saveScore = (gameId: string, score: number, playerName: string, note?: string) => {
    const game = games.find((g) => g.id === gameId);
    const newEntry: LeaderboardEntry = {
      id: `lb-${Date.now()}`,
      gameId,
      gameTitle: game ? game.title : 'Game',
      playerName: playerName.trim() || 'Anonymous Player',
      score,
      date: new Date().toISOString().split('T')[0],
      note,
    };

    setLeaderboard((prev) => {
      const updated = [newEntry, ...prev];
      // Keep top entries sorted
      return updated;
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavorite = (id: string) => favorites.includes(id);

  const getGameById = (id: string) => games.find((g) => g.id === id);

  const getHighScoresForGame = (gameId: string) => {
    return leaderboard
      .filter((e) => e.gameId === gameId)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  };

  const resetToDefaults = () => {
    setGames(INITIAL_GAMES);
    setCategories(INITIAL_CATEGORIES);
    setLeaderboard(INITIAL_LEADERBOARDS);
    setFavorites(['game-snake', 'game-breakout']);
    localStorage.removeItem(STORAGE_KEYS.GAMES);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  };

  const exportDatabase = (): string => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      games,
      categories,
      leaderboard,
    };
    return JSON.stringify(data, null, 2);
  };

  const importDatabase = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.games)) {
        setGames(parsed.games);
      }
      if (Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
      }
      if (Array.isArray(parsed.leaderboard)) {
        setLeaderboard(parsed.leaderboard);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <GameContext.Provider
      value={{
        games,
        categories,
        leaderboard,
        favorites,
        addGame,
        updateGame,
        deleteGame,
        toggleFeatured,
        recordPlay,
        saveScore,
        toggleFavorite,
        isFavorite,
        getGameById,
        getHighScoresForGame,
        resetToDefaults,
        exportDatabase,
        importDatabase,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
