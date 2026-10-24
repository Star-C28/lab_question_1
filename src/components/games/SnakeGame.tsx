import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Trophy, Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface SnakeGameProps {
  onScoreSubmit?: (score: number) => void;
  gameId?: string;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
interface Point {
  x: number;
  y: number;
}
interface BonusFood extends Point {
  timer: number;
}

const GRID_SIZE = 20;
const TILE_COUNT = 20; // 400x400 canvas virtual resolution

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('playzone_snake_highscore') || '0');
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>('');

  // Game state refs for fluid requestAnimationFrame / interval loop
  const snakeRef = useRef<Point[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const directionRef = useRef<Direction>('UP');
  const nextDirectionRef = useRef<Direction>('UP');
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const bonusFoodRef = useRef<BonusFood | null>(null);
  const speedRef = useRef<number>(115); // ms per step
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const spawnFood = useCallback((): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * TILE_COUNT),
        y: Math.floor(Math.random() * TILE_COUNT),
      };
      // Check collision with snake
      const collides = snakeRef.current.some(
        (part) => part.x === newFood.x && part.y === newFood.y
      );
      if (!collides) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
    ];
    directionRef.current = 'UP';
    nextDirectionRef.current = 'UP';
    speedRef.current = 115;
    foodRef.current = spawnFood();
    bonusFoodRef.current = null;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSubmitted(false);
    setIsPlaying(true);
    sounds.playClick(500);
  };

  const handleGameOver = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setGameOver(true);
    sounds.playGameOver();

    setHighScore((prev) => {
      if (score > prev) {
        localStorage.setItem('playzone_snake_highscore', String(score));
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        } catch {}
        return score;
      }
      return prev;
    });
  }, [score]);

  // Main game loop tick
  const gameStep = useCallback(() => {
    if (isPaused || gameOver) return;

    directionRef.current = nextDirectionRef.current;
    const head = { ...snakeRef.current[0] };

    switch (directionRef.current) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      handleGameOver();
      return;
    }

    // Self collision
    if (snakeRef.current.some((part) => part.x === head.x && part.y === head.y)) {
      handleGameOver();
      return;
    }

    // Add new head
    const newSnake = [head, ...snakeRef.current];

    // Check regular food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore((prev) => prev + 10);
      sounds.playScore();
      foodRef.current = spawnFood();

      // Occasionally spawn bonus golden star
      if (Math.random() < 0.25 && !bonusFoodRef.current) {
        bonusFoodRef.current = { ...spawnFood(), timer: 35 };
      }

      // Slightly increase speed as snake grows
      if (speedRef.current > 65) {
        speedRef.current -= 1.5;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = setInterval(gameStep, speedRef.current);
        }
      }
    } else if (
      bonusFoodRef.current &&
      head.x === bonusFoodRef.current.x &&
      head.y === bonusFoodRef.current.y
    ) {
      setScore((prev) => prev + 50);
      sounds.playWin();
      bonusFoodRef.current = null;
    } else {
      newSnake.pop(); // Remove tail
    }

    // Decrement bonus food timer
    if (bonusFoodRef.current) {
      bonusFoodRef.current.timer -= 1;
      if (bonusFoodRef.current.timer <= 0) {
        bonusFoodRef.current = null;
      }
    }

    snakeRef.current = newSnake;
    drawCanvas();
  }, [isPaused, gameOver, handleGameOver, spawnFood]);

  // Canvas render function
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = '#0B1020';
    ctx.fillRect(0, 0, width, height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw regular food (Glowing Red/Pink orb)
    const fx = foodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
    const fy = foodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#F43F5E';
    ctx.fillStyle = '#FB7185';
    ctx.beginPath();
    ctx.arc(fx, fy, GRID_SIZE / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Bonus Golden Star if active
    if (bonusFoodRef.current) {
      const bx = bonusFoodRef.current.x * GRID_SIZE + GRID_SIZE / 2;
      const by = bonusFoodRef.current.y * GRID_SIZE + GRID_SIZE / 2;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#F59E0B';
      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.arc(bx, by, GRID_SIZE / 2 - 1, 0, Math.PI * 2);
      ctx.fill();

      // Bonus star mini indicator
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★', bx, by + 4);
    }

    // Draw Snake
    snakeRef.current.forEach((part, index) => {
      const px = part.x * GRID_SIZE;
      const py = part.y * GRID_SIZE;

      if (index === 0) {
        // Snake Head (Bright Cyan with glow)
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#06B6D4';
        ctx.fillStyle = '#22D3EE';
        ctx.fillRect(px + 1, py + 1, GRID_SIZE - 2, GRID_SIZE - 2);

        // Eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#0B1020';
        ctx.fillRect(px + 4, py + 4, 3, 3);
        ctx.fillRect(px + 13, py + 4, 3, 3);
      } else {
        // Snake Body (Gradient Purple)
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#8B5CF6';
        const alpha = Math.max(0.4, 1 - index / (snakeRef.current.length + 5));
        ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
        ctx.fillRect(px + 2, py + 2, GRID_SIZE - 4, GRID_SIZE - 4);
      }
    });

    // Reset shadow
    ctx.shadowBlur = 0;
  }, []);

  // Interval loop
  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver) {
      timerRef.current = setInterval(gameStep, speedRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isPaused, gameOver, gameStep]);

  // Initial draw
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Spacebar') {
        if (!isPlaying) {
          resetGame();
        } else {
          setIsPaused((p) => !p);
        }
        return;
      }

      const cur = directionRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && cur !== 'DOWN') {
        nextDirectionRef.current = 'UP';
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && cur !== 'UP') {
        nextDirectionRef.current = 'DOWN';
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && cur !== 'RIGHT') {
        nextDirectionRef.current = 'LEFT';
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && cur !== 'LEFT') {
        nextDirectionRef.current = 'RIGHT';
      }
    },
    [isPlaying]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const changeDirectionTouch = (dir: Direction) => {
    const cur = directionRef.current;
    if (dir === 'UP' && cur !== 'DOWN') nextDirectionRef.current = 'UP';
    if (dir === 'DOWN' && cur !== 'UP') nextDirectionRef.current = 'DOWN';
    if (dir === 'LEFT' && cur !== 'RIGHT') nextDirectionRef.current = 'LEFT';
    if (dir === 'RIGHT' && cur !== 'LEFT') nextDirectionRef.current = 'RIGHT';
    sounds.playClick(300);
  };

  const handleToggleMute = () => {
    const next = sounds.toggleMute();
    setIsMuted(next);
  };

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (onScoreSubmit && score > 0) {
      onScoreSubmit(score);
      setSubmitted(true);
      confetti({ particleCount: 40 });
    }
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-purple-500/30 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Score</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{score}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Best
            </span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            aria-label="Toggle sound"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {isPlaying && (
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-amber-400" />}
            </button>
          )}

          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isPlaying ? 'Restart' : 'Start'}</span>
          </button>
        </div>
      </div>

      {/* Game Canvas Container */}
      <div className="relative border-2 border-purple-500/40 rounded-2xl overflow-hidden shadow-2xl bg-[#0B1020]">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * TILE_COUNT}
          height={GRID_SIZE * TILE_COUNT}
          className="block w-full max-w-[400px] h-auto aspect-square"
        />

        {/* Start Game Overlay */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 bg-[#0B1020]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide mb-1">Cyber Snake</h3>
            <p className="text-sm text-slate-300 max-w-xs mb-6">
              Collect neon energy orbs & golden stars. Don't crash into walls or yourself!
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold text-base shadow-lg transition-transform active:scale-95"
            >
              Play Now (Press Space)
            </button>
          </div>
        )}

        {/* Paused Overlay */}
        {isPlaying && isPaused && (
          <div className="absolute inset-0 bg-[#0B1020]/80 backdrop-blur-xs flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-amber-400 tracking-wider mb-3">GAME PAUSED</span>
            <button
              onClick={() => setIsPaused(false)}
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-md"
            >
              Resume Game
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <span className="text-xs uppercase tracking-widest font-bold text-rose-500 mb-1">Session Ended</span>
            <h3 className="text-3xl font-black text-white mb-2">Game Over!</h3>
            <div className="flex items-center gap-6 my-3">
              <div className="text-center">
                <span className="text-xs text-slate-400 block">Final Score</span>
                <span className="text-2xl font-extrabold text-cyan-400 font-mono">{score}</span>
              </div>
              <div className="text-center">
                <span className="text-xs text-slate-400 block">High Score</span>
                <span className="text-2xl font-extrabold text-amber-400 font-mono">{highScore}</span>
              </div>
            </div>

            {/* Submit to Leaderboard section */}
            {score > 0 && !submitted && onScoreSubmit && (
              <form onSubmit={handleSubmitScore} className="w-full max-w-xs mb-4">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all"
                >
                  Save Score to Leaderboard
                </button>
              </form>
            )}

            {submitted && (
              <p className="text-xs text-emerald-400 font-medium mb-4 flex items-center gap-1">
                ✓ Score saved to PlayZone Leaderboard!
              </p>
            )}

            <button
              onClick={resetGame}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 text-white font-bold text-sm shadow-lg transition-transform active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch D-Pad */}
      <div className="mt-5 flex flex-col items-center">
        <span className="text-xs text-slate-400 font-medium mb-2">Mobile & Touch Controls</span>
        <div className="grid grid-cols-3 gap-2 w-48">
          <div />
          <button
            onClick={() => changeDirectionTouch('UP')}
            aria-label="Up"
            className="w-14 h-14 rounded-xl bg-[#172033] active:bg-purple-600 border border-slate-700 active:border-purple-400 flex items-center justify-center text-slate-200 transition-colors shadow-md"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div />
          <button
            onClick={() => changeDirectionTouch('LEFT')}
            aria-label="Left"
            className="w-14 h-14 rounded-xl bg-[#172033] active:bg-purple-600 border border-slate-700 active:border-purple-400 flex items-center justify-center text-slate-200 transition-colors shadow-md"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => changeDirectionTouch('DOWN')}
            aria-label="Down"
            className="w-14 h-14 rounded-xl bg-[#172033] active:bg-purple-600 border border-slate-700 active:border-purple-400 flex items-center justify-center text-slate-200 transition-colors shadow-md"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            onClick={() => changeDirectionTouch('RIGHT')}
            aria-label="Right"
            className="w-14 h-14 rounded-xl bg-[#172033] active:bg-purple-600 border border-slate-700 active:border-purple-400 flex items-center justify-center text-slate-200 transition-colors shadow-md"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
