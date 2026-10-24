# PlayZone – Free Online Games
> **Web Engineering University Lab Examination Project**

PlayZone is a modern, responsive, fully functional online gaming portal website built with React, TypeScript, HTML5 2D Canvas, and Tailwind CSS. It features five real playable games, local high-score leaderboards, advertisement placeholders, a promotional VIP membership tier, and a full-featured Admin Dashboard with complete game management CRUD operations.

---

## 🎮 Five Fully Playable Browser Games

All games run entirely within the web browser using native HTML5 Canvas, React state, and a Web Audio API 8-bit retro sound synthesizer (with global mute support). No external plugins or downloads required:

1. **Cyber Snake Neon** (`/game/game-snake`)
   - Directional controls (Arrow keys, WASD, and responsive on-screen touch D-Pad for mobile)
   - Red energy cubes (+10 pts) and rare Golden Stars (+50 pts)
   - Dynamic speed acceleration as the snake lengthens
   - Wall and self-collision detection, high-score tracking, and direct leaderboard submission

2. **Neon Brick Breaker** (`/game/game-breakout`)
   - Canvas-based ball physics, paddle angle deflection, and ball acceleration
   - Steer via mouse, touch drag, or Left/Right keyboard arrows
   - Multi-hit fortified bricks (Gold = 3 hits, Purple = 2 hits, Emerald = 1 hit)
   - 3 lives system, level clear progression (3 challenge stages), victory fanfare, and sound effects

3. **Cyber Memory Matrix** (`/game/game-memory`)
   - Visual working memory training with 16 cyber relic cards (8 unique pairs)
   - 3D card flipping animations, move counter, and live stopwatch timer
   - Sound effects for flip, match, and completion with victory confetti

4. **Sliding 15 Puzzle** (`/game/game-puzzle15`)
   - Classic sliding number block puzzle with 4x4 (15 tiles) and 3x3 (8 tiles) modes
   - Inversion parity algorithm ensures **100% solvable layouts** on every shuffle
   - Slide via mouse/touch or Arrow keys, move counter, timer, and solution preview hint

5. **Tic Tac Toe Neon AI** (`/game/game-tictactoe`)
   - Heuristic AI engine with **Easy** mode (casual) and **Master** mode (Minimax unbeatable algorithm)
   - 2-Player Pass-and-Play mode for local friend matches
   - Match statistics tracker (X wins, O wins, Stalemate draws) and victory celebration

---

## 🛠️ Key Portal Features

- **Dark Cyber Gaming Theme**: Custom palette matching `#0B1020` (background), `#172033` (cards), `#8B5CF6` (primary purple), `#06B6D4` (secondary cyan), with glowing borders and smooth hover effects.
- **Dynamic Catalog & Filtering**:
  - Full-text search by title, category, and tags
  - Filter by category: Puzzle, Action, Racing, Arcade, Adventure, Brain Training
  - Sort by Popularity, Date Added, Rating, and Alphabetical order
  - Favorites bookmarking system stored in `localStorage`
- **Game Details Page**:
  - Fullscreen mode toggle via HTML5 Fullscreen API
  - Quick game restart and audio mute toggle
  - Key controls guide and objectives
  - High-score board specific to each game
  - Related game recommendations
- **Admin Dashboard** (`/admin`):
  - Overview statistics: Total games, total plays, categories, featured titles
  - Add New Game modal with built-in Neon SVG thumbnail generator
  - Edit and Delete games with confirmation
  - Toggle featured spotlight on homepage
  - Database JSON Export & Import
  - One-click "Reset Database to Default Seed" for university lab demonstrations
- **Leaderboard** (`/leaderboard`):
  - Filter scores by game or view global rankings
  - 1st 🥇, 2nd 🥈, and 3rd 🥉 place medals
  - Search by player nickname
- **Advertisement & Premium**:
  - Standardized Google AdSense placeholders (`728x90` Leaderboard, `300x250` Sidebar, `320x50` Banner)
  - PlayZone Premium VIP showcase (`/premium`) with plan comparison and beta notification waitlist
- **Static & Legal Pages**:
  - About Us (`/about`)
  - Contact Us with validation and FAQ accordion (`/contact`)
  - Privacy Policy (`/privacy`)
  - Terms and Conditions (`/terms`)
  - 404 Not Found (`/404`)

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```
