import { CategoryInfo, Game, LeaderboardEntry } from '../types/game';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  {
    id: 'cat-puzzle',
    name: 'Puzzle',
    slug: 'puzzle',
    icon: 'Puzzle',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500/20 to-blue-600/10',
    description: 'Solve mind-bending challenges and logic puzzles.',
  },
  {
    id: 'cat-action',
    name: 'Action',
    slug: 'action',
    icon: 'Swords',
    color: '#EF4444',
    bgGradient: 'from-red-500/20 to-rose-600/10',
    description: 'Fast-paced combat, reflexes, and adrenaline thrills.',
  },
  {
    id: 'cat-racing',
    name: 'Racing',
    slug: 'racing',
    icon: 'Flame',
    color: '#F59E0B',
    bgGradient: 'from-amber-500/20 to-orange-600/10',
    description: 'High-speed circuits, drift masters, and time trials.',
  },
  {
    id: 'cat-arcade',
    name: 'Arcade',
    slug: 'arcade',
    icon: 'Gamepad2',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500/20 to-indigo-600/10',
    description: 'Classic retro arcade favorites with high-score battles.',
  },
  {
    id: 'cat-adventure',
    name: 'Adventure',
    slug: 'adventure',
    icon: 'Compass',
    color: '#10B981',
    bgGradient: 'from-emerald-500/20 to-teal-600/10',
    description: 'Explore quests, mysterious worlds, and epic journeys.',
  },
  {
    id: 'cat-brain',
    name: 'Brain Training',
    slug: 'brain-training',
    icon: 'Brain',
    color: '#EC4899',
    bgGradient: 'from-pink-500/20 to-purple-600/10',
    description: 'Boost memory, cognitive agility, and spatial IQ.',
  },
];

// Helper to generate visually stunning SVG thumbnails without relying on external unreliable CDNs
export const createNeonGameThumbnail = (
  title: string,
  category: string,
  color1: string,
  color2: string,
  iconSymbol: string
): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0F172A" />
        <stop offset="50%" stop-color="#1E1B4B" />
        <stop offset="100%" stop-color="#0B1020" />
      </linearGradient>
      <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" />
        <stop offset="100%" stop-color="${color2}" />
      </linearGradient>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1" />
      </pattern>
      <filter id="neon" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    <rect width="100%" height="100%" fill="url(#grid)" />
    
    <!-- Neon Circles -->
    <circle cx="200" cy="95" r="55" fill="none" stroke="url(#glow)" stroke-width="3" filter="url(#neon)" opacity="0.8" />
    <circle cx="200" cy="95" r="42" fill="rgba(15, 23, 42, 0.6)" stroke="${color1}" stroke-width="1" />
    
    <!-- Category Glow Pill -->
    <rect x="25" y="20" width="90" height="24" rx="12" fill="rgba(15, 23, 42, 0.8)" stroke="${color2}" stroke-width="1" />
    <text x="70" y="36" fill="${color2}" font-family="sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">${category.toUpperCase()}</text>

    <!-- Center Icon Symbol -->
    <text x="200" y="112" fill="#FFFFFF" font-family="sans-serif" font-size="44" text-anchor="middle" filter="url(#neon)">${iconSymbol}</text>
    
    <!-- Title banner -->
    <text x="200" y="190" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="800" text-anchor="middle" letter-spacing="0.5">${title}</text>
    <text x="200" y="212" fill="#94A3B8" font-family="sans-serif" font-size="12" font-weight="500" text-anchor="middle">PLAYZONE INSTANT BROWSER</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_GAMES: Game[] = [
  {
    id: 'game-snake',
    title: 'Cyber Snake Neon',
    description: 'Control the cyber serpent across a pulsing neon grid. Consume energy cubes, lengthen your serpent, activate speed bonuses, and avoid hitting the perimeter walls or your own tail!',
    shortDescription: 'Classic arcade snake with glowing neon visuals, combo multipliers, and on-screen controls.',
    category: 'Arcade',
    thumbnail: createNeonGameThumbnail('CYBER SNAKE', 'Arcade', '#8B5CF6', '#06B6D4', '🐍'),
    gameType: 'internal',
    internalId: 'snake',
    featured: true,
    popularity: 98,
    rating: 4.9,
    plays: 14250,
    createdAt: '2026-03-01T10:00:00Z',
    tags: ['Retro', 'Snake', 'Arcade', 'HighScore', 'Casual'],
    instructions: [
      'Use Arrow keys, WASD, or the on-screen D-Pad to steer the snake.',
      'Collect red energy orbs (+10 pts) and rare golden stars (+50 pts).',
      'The snake speeds up slightly as its length increases.',
      'Hitting the border or running into your body ends the game.',
      'Reach 200+ points to claim the top leaderboard rank!'
    ],
    controls: [
      { key: 'Arrow Keys / WASD', action: 'Move Up, Down, Left, Right' },
      { key: 'Spacebar', action: 'Pause / Resume game' },
      { key: 'On-Screen D-Pad', action: 'Touch controls for mobile & tablet' }
    ]
  },
  {
    id: 'game-breakout',
    title: 'Neon Brick Breaker',
    description: 'Smash through rows of fortified cyber bricks with your photon paddle. Experience realistic ball bounce mechanics, multi-hit durability bricks, score multipliers, and 3 challenge levels.',
    shortDescription: 'Modern arcade brick breaker with particle physics, glowing effects, and multi-tier stages.',
    category: 'Arcade',
    thumbnail: createNeonGameThumbnail('NEON BREAKOUT', 'Arcade', '#EC4899', '#8B5CF6', '🧱'),
    gameType: 'internal',
    internalId: 'breakout',
    featured: true,
    popularity: 96,
    rating: 4.8,
    plays: 11840,
    createdAt: '2026-03-05T12:00:00Z',
    tags: ['Breakout', 'Arcade', 'Physics', 'Action', 'Retro'],
    instructions: [
      'Move your paddle left and right using the mouse, Left/Right arrow keys, or touch dragging.',
      'Launch the ball with Space or tap to begin.',
      'Hit bricks to destroy them. Purple bricks require 2 hits, Gold bricks require 3 hits.',
      'Keep the ball in play. You have 3 lives per session.',
      'Destroy all bricks to advance to the next level!'
    ],
    controls: [
      { key: 'Left / Right Arrow', action: 'Move Paddle' },
      { key: 'Mouse / Touch Drag', action: 'Smooth paddle tracking' },
      { key: 'Spacebar', action: 'Launch Ball / Pause' }
    ]
  },
  {
    id: 'game-memory',
    title: 'Cyber Memory Matrix',
    description: 'Test and enhance your visual working memory in this high-tech card matching challenge. Flip digital cards, identify matching cyber weapon and relic pairs, and minimize your moves.',
    shortDescription: 'Brain-boosting card match with timer, moves counter, and 3D flip card animations.',
    category: 'Brain Training',
    thumbnail: createNeonGameThumbnail('MEMORY MATRIX', 'Brain', '#06B6D4', '#10B981', '🧠'),
    gameType: 'internal',
    internalId: 'memory',
    featured: true,
    popularity: 94,
    rating: 4.7,
    plays: 9630,
    createdAt: '2026-03-10T15:30:00Z',
    tags: ['Memory', 'Brain Training', 'Cards', 'Puzzle', 'Focus'],
    instructions: [
      'Click or tap any card to reveal its cyber icon.',
      'Select a second card to find its matching counterpart.',
      'If the cards match, they lock in place with a glowing aura.',
      'If they mismatch, they flip back after a brief pause.',
      'Complete the entire board in the fewest moves and fastest time!'
    ],
    controls: [
      { key: 'Mouse Click / Tap', action: 'Flip card' },
      { key: 'Restart Button', action: 'Shuffle new game deck' }
    ]
  },
  {
    id: 'game-puzzle15',
    title: 'Sliding 15 Puzzle',
    description: 'The definitive sliding block brain teaser. Slide numbered quantum tiles within a 4x4 or 3x3 matrix to restore ascending numerical order. Every generated shuffle is guaranteed 100% solvable.',
    shortDescription: 'Classic numerical sliding tile puzzle with solvable shuffler, move counter, and timer.',
    category: 'Puzzle',
    thumbnail: createNeonGameThumbnail('SLIDING 15', 'Puzzle', '#F59E0B', '#EF4444', '🔢'),
    gameType: 'internal',
    internalId: 'puzzle15',
    featured: false,
    popularity: 91,
    rating: 4.6,
    plays: 7850,
    createdAt: '2026-03-12T09:00:00Z',
    tags: ['Puzzle', 'Math', 'Brain Training', 'Logic', 'Strategy'],
    instructions: [
      'The objective is to order numbers 1 to 15 from left-to-right, top-to-bottom.',
      'Click or tap any tile adjacent to the empty slot to slide it into position.',
      'You can also use the Arrow keys to shift tiles.',
      'Choose between 3x3 (Fast) or 4x4 (Classic 15) difficulties.',
      'Use the Solve Preview hint if you get stuck.'
    ],
    controls: [
      { key: 'Click / Tap', action: 'Slide adjacent tile into blank spot' },
      { key: 'Arrow Keys', action: 'Push tile toward empty space' },
      { key: 'R / Shuffle', action: 'Generate fresh solvable layout' }
    ]
  },
  {
    id: 'game-tictactoe',
    title: 'Tic Tac Toe Neon AI',
    description: 'Engage in cyber-grid tactical warfare. Play against our heuristic Smart AI engine or switch to 2-Player Pass-and-Play mode for local face-to-face competition with friends.',
    shortDescription: 'Futuristic Tic Tac Toe with intelligent AI difficulty levels and 2-Player mode.',
    category: 'Brain Training',
    thumbnail: createNeonGameThumbnail('NEON TIC TAC TOE', 'Brain', '#8B5CF6', '#EC4899', '❌'),
    gameType: 'internal',
    internalId: 'tictactoe',
    featured: false,
    popularity: 95,
    rating: 4.8,
    plays: 13200,
    createdAt: '2026-03-15T18:00:00Z',
    tags: ['TicTacToe', 'AI', '2Player', 'Strategy', 'Casual'],
    instructions: [
      'Take turns marking a cell on the 3x3 grid.',
      'Align three of your marks (X or O) horizontally, vertically, or diagonally to win.',
      'Toggle between AI mode (with Easy/Hard difficulty) or 2-Player pass-and-play.',
      'Track win/loss/tie streaks across your gaming session.'
    ],
    controls: [
      { key: 'Click / Tap Cell', action: 'Place your mark' },
      { key: 'Difficulty Selector', action: 'Switch between Easy & Master AI' },
      { key: 'Mode Switch', action: 'Toggle vs AI or 2-Player mode' }
    ]
  },
  {
    id: 'game-speed-drift',
    title: 'Speed Drift Cyberway',
    description: 'Race through neon-lit futuristic highways at supersonic speeds. Dodge traffic barriers, slipstream behind rivals, and collect nitrous power-ups to beat your record lap times.',
    shortDescription: 'High-octane neon racing simulator with rapid reflex obstacles and turbo boosts.',
    category: 'Racing',
    thumbnail: createNeonGameThumbnail('SPEED DRIFT', 'Racing', '#F59E0B', '#EF4444', '🏎️'),
    gameType: 'internal',
    internalId: 'snake', // fallback or interactive canvas
    featured: true,
    popularity: 93,
    rating: 4.7,
    plays: 8900,
    createdAt: '2026-03-18T11:20:00Z',
    tags: ['Racing', 'Speed', 'Drift', 'Action', 'Nitro'],
    instructions: [
      'Steer through the high-speed cyber lane.',
      'Dodge barrier drones and road hazards.',
      'Maintain maximum velocity to earn points every second.'
    ],
    controls: [
      { key: 'A / D or Left/Right', action: 'Steer Vehicle' },
      { key: 'Shift / Space', action: 'Nitro Boost' }
    ]
  },
  {
    id: 'game-shadow-quest',
    title: 'Dungeon Quest Legends',
    description: 'Descend into subterranean dungeons filled with traps, guardians, and hidden loot chests. A retro fantasy dungeon crawler built for brave adventurers.',
    shortDescription: 'Retro dungeon crawler adventure with rooms, loot, and tactical puzzles.',
    category: 'Adventure',
    thumbnail: createNeonGameThumbnail('DUNGEON QUEST', 'Adventure', '#10B981', '#06B6D4', '⚔️'),
    gameType: 'internal',
    internalId: 'puzzle15', // or embed
    featured: false,
    popularity: 88,
    rating: 4.5,
    plays: 6420,
    createdAt: '2026-03-20T08:00:00Z',
    tags: ['Adventure', 'RPG', 'Dungeon', 'Quest', 'Fantasy'],
    instructions: [
      'Navigate room-by-room exploring ancient crypts.',
      'Collect keys to unlock secret chambers.',
      'Defeat boss monsters to recover the legendary artifact.'
    ],
    controls: [
      { key: 'WASD / Arrows', action: 'Hero Movement' },
      { key: 'E / Space', action: 'Interact / Attack' }
    ]
  },
  {
    id: 'game-quantum-maze',
    title: 'Quantum Maze 3D',
    description: 'Solve intricate labyrinth chambers where walls shift dimensions. Use your compass and analytical reasoning to discover the warp portal before oxygen drains.',
    shortDescription: 'Mind-bending puzzle maze with shifting portals and time-trial modes.',
    category: 'Puzzle',
    thumbnail: createNeonGameThumbnail('QUANTUM MAZE', 'Puzzle', '#06B6D4', '#8B5CF6', '🌀'),
    gameType: 'internal',
    internalId: 'memory',
    featured: false,
    popularity: 89,
    rating: 4.6,
    plays: 7100,
    createdAt: '2026-03-22T14:10:00Z',
    tags: ['Puzzle', 'Maze', 'Logic', 'Brain Training'],
    instructions: [
      'Locate the energy portal at the heart of the maze.',
      'Avoid dead ends and temporal distortion traps.',
      'Beat the target timer to earn three gold stars.'
    ],
    controls: [
      { key: 'Arrow Keys', action: 'Navigate paths' },
      { key: 'M', action: 'Toggle mini-map view' }
    ]
  }
];

export const INITIAL_LEADERBOARDS: LeaderboardEntry[] = [
  {
    id: 'lb-1',
    gameId: 'game-snake',
    gameTitle: 'Cyber Snake Neon',
    playerName: 'NeonViper_99',
    score: 380,
    date: '2026-10-20',
    note: 'Speed Level 8'
  },
  {
    id: 'lb-2',
    gameId: 'game-snake',
    gameTitle: 'Cyber Snake Neon',
    playerName: 'PixelMaster',
    score: 310,
    date: '2026-10-21'
  },
  {
    id: 'lb-3',
    gameId: 'game-snake',
    gameTitle: 'Cyber Snake Neon',
    playerName: 'CyberQueen',
    score: 260,
    date: '2026-10-22'
  },
  {
    id: 'lb-4',
    gameId: 'game-breakout',
    gameTitle: 'Neon Brick Breaker',
    playerName: 'BrickCrusher',
    score: 1240,
    date: '2026-10-19',
    note: 'Stage 3 Cleared'
  },
  {
    id: 'lb-5',
    gameId: 'game-breakout',
    gameTitle: 'Neon Brick Breaker',
    playerName: 'ArcadeAce',
    score: 980,
    date: '2026-10-22'
  },
  {
    id: 'lb-6',
    gameId: 'game-memory',
    gameTitle: 'Cyber Memory Matrix',
    playerName: 'MindHacker',
    score: 18,
    date: '2026-10-21',
    note: '18 moves / 34s'
  },
  {
    id: 'lb-7',
    gameId: 'game-puzzle15',
    gameTitle: 'Sliding 15 Puzzle',
    playerName: 'QuantumSolver',
    score: 42,
    date: '2026-10-23',
    note: '42 moves / 56s'
  },
  {
    id: 'lb-8',
    gameId: 'game-tictactoe',
    gameTitle: 'Tic Tac Toe Neon AI',
    playerName: 'GrandmasterBot',
    score: 15,
    date: '2026-10-22',
    note: '15 Wins Streak'
  }
];
