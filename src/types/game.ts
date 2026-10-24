export type GameCategory = 
  | 'Puzzle'
  | 'Action'
  | 'Racing'
  | 'Arcade'
  | 'Adventure'
  | 'Brain Training';

export interface GameControl {
  key: string;
  action: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  category: GameCategory | string;
  thumbnail: string;
  gameType: 'internal' | 'embed';
  internalId?: 'snake' | 'tictactoe' | 'memory' | 'puzzle15' | 'breakout';
  embedUrl?: string;
  featured: boolean;
  popularity: number; // 0 to 100
  rating: number; // e.g. 4.8
  plays: number;
  createdAt: string; // ISO date
  tags: string[];
  instructions: string[];
  controls: GameControl[];
}

export interface CategoryInfo {
  id: string;
  name: GameCategory;
  slug: string;
  icon: string;
  color: string;
  bgGradient: string;
  description: string;
}

export interface LeaderboardEntry {
  id: string;
  gameId: string;
  gameTitle: string;
  playerName: string;
  score: number;
  date: string;
  note?: string;
}
