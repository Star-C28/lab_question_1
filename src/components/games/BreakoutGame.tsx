import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Heart, Trophy, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface BreakoutGameProps {
  onScoreSubmit?: (score: number) => void;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  hits: number;
  maxHits: number;
  points: number;
  color: string;
}

const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 420;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 6;

export const BreakoutGame: React.FC<BreakoutGameProps> = ({ onScoreSubmit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [level, setLevel] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameWon, setGameWon] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Mutable refs for high performance animation
  const paddleXRef = useRef<number>((CANVAS_WIDTH - PADDLE_WIDTH) / 2);
  const ballXRef = useRef<number>(CANVAS_WIDTH / 2);
  const ballYRef = useRef<number>(CANVAS_HEIGHT - 40);
  const ballSpeedXRef = useRef<number>(3.5);
  const ballSpeedYRef = useRef<number>(-3.5);
  const bricksRef = useRef<Brick[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  const initBricks = useCallback((currentLevel: number) => {
    const rows = 4 + Math.min(currentLevel, 3);
    const cols = 7;
    const padding = 8;
    const offsetTop = 40;
    const offsetLeft = 16;
    const brickWidth = (CANVAS_WIDTH - offsetLeft * 2 - (cols - 1) * padding) / cols;
    const brickHeight = 16;

    const newBricks: Brick[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let maxHits = 1;
        let color = '#10B981'; // Green
        let points = 10;

        if (r === 0 || (currentLevel > 1 && r === 1)) {
          maxHits = 3;
          color = '#F59E0B'; // Gold
          points = 30;
        } else if (r === 1 || (currentLevel > 1 && r === 2)) {
          maxHits = 2;
          color = '#8B5CF6'; // Purple
          points = 20;
        }

        newBricks.push({
          x: offsetLeft + c * (brickWidth + padding),
          y: offsetTop + r * (brickHeight + padding),
          width: brickWidth,
          height: brickHeight,
          hits: 0,
          maxHits,
          points,
          color,
        });
      }
    }
    bricksRef.current = newBricks;
  }, []);

  const resetBallAndPaddle = () => {
    paddleXRef.current = (CANVAS_WIDTH - PADDLE_WIDTH) / 2;
    ballXRef.current = CANVAS_WIDTH / 2;
    ballYRef.current = CANVAS_HEIGHT - 35;
    const angle = (Math.random() * 0.6 - 0.3); // slight random angle
    const speed = 4 + (level - 1) * 0.5;
    ballSpeedXRef.current = speed * Math.sin(angle);
    ballSpeedYRef.current = -speed * Math.cos(angle);
  };

  const startNewGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameOver(false);
    setGameWon(false);
    setIsPaused(false);
    setSubmitted(false);
    initBricks(1);
    resetBallAndPaddle();
    setIsPlaying(true);
    sounds.playClick(440);
  };

  const handleNextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    initBricks(nextLvl);
    resetBallAndPaddle();
    sounds.playWin();
    try {
      confetti({ particleCount: 60, spread: 70 });
    } catch {}
  };

  // Main render and physics loop
  const updateGame = useCallback(() => {
    if (!isPlaying || isPaused || gameOver || gameWon) return;

    // Ball movement
    let bx = ballXRef.current + ballSpeedXRef.current;
    let by = ballYRef.current + ballSpeedYRef.current;

    // Wall collision (Left & Right)
    if (bx - BALL_RADIUS <= 0) {
      bx = BALL_RADIUS;
      ballSpeedXRef.current = -ballSpeedXRef.current;
      sounds.playBounce(300);
    } else if (bx + BALL_RADIUS >= CANVAS_WIDTH) {
      bx = CANVAS_WIDTH - BALL_RADIUS;
      ballSpeedXRef.current = -ballSpeedXRef.current;
      sounds.playBounce(300);
    }

    // Top wall collision
    if (by - BALL_RADIUS <= 0) {
      by = BALL_RADIUS;
      ballSpeedYRef.current = -ballSpeedYRef.current;
      sounds.playBounce(320);
    }

    // Paddle collision
    const px = paddleXRef.current;
    const py = CANVAS_HEIGHT - 20;

    if (
      by + BALL_RADIUS >= py &&
      by - BALL_RADIUS <= py + PADDLE_HEIGHT &&
      bx >= px &&
      bx <= px + PADDLE_WIDTH
    ) {
      // Calculate hit position relative to center of paddle for directional reflection
      const hitPoint = (bx - (px + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
      const speed = Math.sqrt(
        ballSpeedXRef.current * ballSpeedXRef.current +
        ballSpeedYRef.current * ballSpeedYRef.current
      );
      const maxBounceAngle = Math.PI / 3; // 60 degrees
      const bounceAngle = hitPoint * maxBounceAngle;

      ballSpeedXRef.current = speed * Math.sin(bounceAngle);
      ballSpeedYRef.current = -Math.abs(speed * Math.cos(bounceAngle));
      by = py - BALL_RADIUS - 1;
      sounds.playBounce(450);
    }

    // Bottom loss collision
    if (by + BALL_RADIUS >= CANVAS_HEIGHT) {
      sounds.playGameOver();
      setLives((prevLives) => {
        const remaining = prevLives - 1;
        if (remaining <= 0) {
          setGameOver(true);
          setIsPlaying(false);
          return 0;
        } else {
          resetBallAndPaddle();
          return remaining;
        }
      });
      return;
    }

    // Brick collisions
    let remainingBricks = 0;
    for (let i = 0; i < bricksRef.current.length; i++) {
      const b = bricksRef.current[i];
      if (b.hits >= b.maxHits) continue;

      remainingBricks++;

      // Check ball-brick collision
      if (
        bx + BALL_RADIUS >= b.x &&
        bx - BALL_RADIUS <= b.x + b.width &&
        by + BALL_RADIUS >= b.y &&
        by - BALL_RADIUS <= b.y + b.height
      ) {
        // Hit detected
        b.hits += 1;
        sounds.playBrickHit();

        // Bounce ball based on impact face
        const prevBallX = ballXRef.current;
        const prevBallY = ballYRef.current;

        if (prevBallX < b.x || prevBallX > b.x + b.width) {
          ballSpeedXRef.current = -ballSpeedXRef.current;
        } else {
          ballSpeedYRef.current = -ballSpeedYRef.current;
        }

        if (b.hits >= b.maxHits) {
          setScore((s) => s + b.points);
          remainingBricks--;
        } else {
          setScore((s) => s + 5);
        }
        break;
      }
    }

    // Level complete check
    if (remainingBricks === 0 && bricksRef.current.length > 0) {
      if (level >= 3) {
        setGameWon(true);
        setIsPlaying(false);
        sounds.playWin();
        try {
          confetti({ particleCount: 100, spread: 80 });
        } catch {}
      } else {
        handleNextLevel();
      }
      return;
    }

    ballXRef.current = bx;
    ballYRef.current = by;

    // Render Canvas Frame
    renderCanvas();

    animationFrameIdRef.current = requestAnimationFrame(updateGame);
  }, [isPlaying, isPaused, gameOver, gameWon, level, initBricks]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#0B1020';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid accent
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Draw Bricks
    bricksRef.current.forEach((b) => {
      if (b.hits >= b.maxHits) return;

      const healthRatio = 1 - b.hits / b.maxHits;
      ctx.fillStyle = b.color;
      ctx.globalAlpha = Math.max(0.5, healthRatio);
      ctx.shadowBlur = 6;
      ctx.shadowColor = b.color;

      ctx.beginPath();
      ctx.roundRect(b.x, b.y, b.width, b.height, 4);
      ctx.fill();

      // Brick shine highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(b.x + 2, b.y + 2, b.width - 4, 3);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // Draw Paddle
    const px = paddleXRef.current;
    const py = CANVAS_HEIGHT - 20;
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#06B6D4';
    ctx.fillStyle = '#06B6D4';
    ctx.beginPath();
    ctx.roundRect(px, py, PADDLE_WIDTH, PADDLE_HEIGHT, 6);
    ctx.fill();

    // Paddle Center Accent
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px + PADDLE_WIDTH / 2 - 10, py + 2, 20, 3);

    // Draw Ball
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#EC4899';
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(ballXRef.current, ballYRef.current, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver && !gameWon) {
      animationFrameIdRef.current = requestAnimationFrame(updateGame);
    }
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isPlaying, isPaused, gameOver, gameWon, updateGame]);

  useEffect(() => {
    initBricks(1);
    renderCanvas();
  }, [initBricks]);

  // Mouse & Touch movement tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS_WIDTH / rect.width;
    const clientX = (e.clientX - rect.left) * scale;
    paddleXRef.current = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, clientX - PADDLE_WIDTH / 2));
    renderCanvas();
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const scale = CANVAS_WIDTH / rect.width;
    const clientX = (e.touches[0].clientX - rect.left) * scale;
    paddleXRef.current = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, clientX - PADDLE_WIDTH / 2));
    renderCanvas();
  };

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        paddleXRef.current = Math.max(0, paddleXRef.current - 24);
        renderCanvas();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        paddleXRef.current = Math.min(CANVAS_WIDTH - PADDLE_WIDTH, paddleXRef.current + 24);
        renderCanvas();
      } else if (e.key === ' ') {
        if (!isPlaying) startNewGame();
        else setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-cyan-500/30 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center space-x-5">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Score</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">{score}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Level</span>
            <span className="text-2xl font-extrabold text-purple-400 font-mono">{level} / 3</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Lives</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3].map((heart) => (
                <Heart
                  key={heart}
                  className={`w-5 h-5 ${
                    heart <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(sounds.toggleMute())}
            aria-label="Toggle sound"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>

          {isPlaying && (
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-amber-400" />}
            </button>
          )}

          <button
            onClick={startNewGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isPlaying ? 'Restart' : 'Start'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative border-2 border-cyan-500/40 rounded-2xl overflow-hidden shadow-2xl bg-[#0B1020]">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          className="block w-full max-w-[480px] h-auto cursor-ew-resize"
        />

        {/* Start Game Overlay */}
        {!isPlaying && !gameOver && !gameWon && (
          <div className="absolute inset-0 bg-[#0B1020]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-black text-white tracking-wide mb-1">Neon Brick Breaker</h3>
            <p className="text-sm text-slate-300 max-w-xs mb-6">
              Move your paddle to shatter bricks and clear all 3 challenge levels!
            </p>
            <button
              onClick={startNewGame}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-bold text-base shadow-lg transition-transform active:scale-95"
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

        {/* Game Over / Won Overlay */}
        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <span
              className={`text-xs uppercase tracking-widest font-bold mb-1 ${
                gameWon ? 'text-emerald-400' : 'text-rose-500'
              }`}
            >
              {gameWon ? 'Victory Cleared!' : 'All Lives Lost'}
            </span>
            <h3 className="text-3xl font-black text-white mb-2">
              {gameWon ? 'Champion of Neon Grid!' : 'Game Over'}
            </h3>
            <div className="text-center my-3">
              <span className="text-xs text-slate-400 block">Final Score</span>
              <span className="text-3xl font-extrabold text-cyan-400 font-mono">{score}</span>
            </div>

            {score > 0 && !submitted && onScoreSubmit && (
              <button
                onClick={() => {
                  onScoreSubmit(score);
                  setSubmitted(true);
                  confetti({ particleCount: 40 });
                }}
                className="py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm mb-4"
              >
                Submit Score to Leaderboard
              </button>
            )}

            {submitted && (
              <p className="text-xs text-emerald-400 font-medium mb-4">✓ Score saved to leaderboard!</p>
            )}

            <button
              onClick={startNewGame}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-lg active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Tip: Drag mouse/touch horizontally or press Left/Right Arrow keys to steer paddle.
      </p>
    </div>
  );
};
