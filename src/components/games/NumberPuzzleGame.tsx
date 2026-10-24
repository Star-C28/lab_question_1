import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Volume2, VolumeX, Eye, Trophy, Sparkles, Check } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface NumberPuzzleProps {
  onScoreSubmit?: (score: number) => void;
}

export const NumberPuzzleGame: React.FC<NumberPuzzleProps> = ({ onScoreSubmit }) => {
  const [gridSize, setGridSize] = useState<number>(4); // 4x4 (15 puzzle) or 3x3 (8 puzzle)
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [showHint, setShowHint] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Check if puzzle is solved
  const checkWin = useCallback((currentTiles: number[], size: number): boolean => {
    const total = size * size;
    for (let i = 0; i < total - 1; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[total - 1] === 0; // Empty tile at the very end
  }, []);

  // Ensure parity inversion is solvable
  const isSolvable = (arr: number[], size: number): boolean => {
    let inversions = 0;
    const clean = arr.filter((x) => x !== 0);

    for (let i = 0; i < clean.length - 1; i++) {
      for (let j = i + 1; j < clean.length; j++) {
        if (clean[i] > clean[j]) inversions++;
      }
    }

    if (size % 2 === 1) {
      // Odd grid (3x3): solvable if inversion count is even
      return inversions % 2 === 0;
    } else {
      // Even grid (4x4): solvable if (inversions + blankRowFromBottom) is odd
      const blankIndex = arr.indexOf(0);
      const blankRowFromBottom = size - Math.floor(blankIndex / size);
      return (inversions + blankRowFromBottom) % 2 === 1;
    }
  };

  const shuffleTiles = useCallback((size: number) => {
    const total = size * size;
    let newTiles: number[] = [];

    do {
      newTiles = Array.from({ length: total }, (_, i) => (i + 1 < total ? i + 1 : 0));
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
    } while (!isSolvable(newTiles, size) || checkWin(newTiles, size));

    setTiles(newTiles);
    setMoves(0);
    setSeconds(0);
    setIsActive(false);
    setIsWon(false);
    setSubmitted(false);
    sounds.playClick(400);
  }, [checkWin]);

  useEffect(() => {
    shuffleTiles(gridSize);
  }, [gridSize, shuffleTiles]);

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isActive && !isWon) {
      timer = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isActive, isWon]);

  const handleTileClick = (index: number) => {
    if (isWon) return;

    const blankIndex = tiles.indexOf(0);
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const blankRow = Math.floor(blankIndex / gridSize);
    const blankCol = blankIndex % gridSize;

    // Check if adjacent horizontally or vertically
    const isAdjacent =
      (Math.abs(row - blankRow) === 1 && col === blankCol) ||
      (Math.abs(col - blankCol) === 1 && row === blankRow);

    if (isAdjacent) {
      if (!isActive) setIsActive(true);

      sounds.playFlip();

      const newTiles = [...tiles];
      newTiles[blankIndex] = newTiles[index];
      newTiles[index] = 0;

      setTiles(newTiles);
      setMoves((m) => m + 1);

      if (checkWin(newTiles, gridSize)) {
        setIsWon(true);
        setIsActive(false);
        sounds.playWin();
        try {
          confetti({ particleCount: 90, spread: 70 });
        } catch {}
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const blankIndex = tiles.indexOf(0);
        if (blankIndex === -1) return;

        const blankRow = Math.floor(blankIndex / gridSize);
        const blankCol = blankIndex % gridSize;
        let targetIndex = -1;

        if (e.key === 'ArrowUp' && blankRow < gridSize - 1) {
          targetIndex = blankIndex + gridSize;
        } else if (e.key === 'ArrowDown' && blankRow > 0) {
          targetIndex = blankIndex - gridSize;
        } else if (e.key === 'ArrowLeft' && blankCol < gridSize - 1) {
          targetIndex = blankIndex + 1;
        } else if (e.key === 'ArrowRight' && blankCol > 0) {
          targetIndex = blankIndex - 1;
        }

        if (targetIndex !== -1) {
          handleTileClick(targetIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [tiles, gridSize, handleTileClick]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculatedScore = Math.max(100, Math.round(1500 - moves * 15 - seconds * 5));

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-amber-500/30 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center space-x-6">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Moves</span>
            <span className="text-xl font-mono font-bold text-amber-400">{moves}</span>
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Time</span>
            <span className="text-xl font-mono font-bold text-slate-100">{formatTime(seconds)}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setGridSize(3)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                gridSize === 3 ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              3×3
            </button>
            <button
              onClick={() => setGridSize(4)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                gridSize === 4 ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              4×4
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint((h) => !h)}
            className={`p-2 rounded-lg border transition-colors ${
              showHint
                ? 'bg-amber-500/20 border-amber-400 text-amber-400'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="Toggle Solution Preview Hint"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(sounds.toggleMute())}
            aria-label="Toggle sound"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={() => shuffleTiles(gridSize)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative w-full max-w-[400px] aspect-square bg-[#0B1020] border-2 border-amber-500/30 rounded-2xl p-3 shadow-2xl">
        <div
          className={`grid gap-2.5 w-full h-full`}
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {tiles.map((val, idx) => {
            const isBlank = val === 0;
            const isCorrect = val === idx + 1;

            if (isBlank) {
              return (
                <div
                  key="blank"
                  className="rounded-xl bg-[#0F172A]/40 border border-dashed border-slate-800 flex items-center justify-center"
                />
              );
            }

            return (
              <button
                key={val}
                onClick={() => handleTileClick(idx)}
                className={`relative rounded-xl flex items-center justify-center font-bold text-2xl font-mono shadow-md transition-all duration-150 active:scale-90 ${
                  isCorrect
                    ? 'bg-gradient-to-br from-amber-500/25 to-orange-600/30 border-2 border-amber-400 text-amber-200'
                    : 'bg-[#172033] border border-slate-700 hover:border-amber-400/60 text-white'
                }`}
              >
                <span>{val}</span>
                {showHint && isCorrect && (
                  <Check className="w-3.5 h-3.5 text-emerald-400 absolute top-1.5 right-1.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Win Overlay */}
        {isWon && (
          <div className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-2 shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">Puzzle Solved!</span>
            <h3 className="text-2xl font-black text-white mt-1">Numerical Master!</h3>

            <div className="flex gap-4 my-4">
              <div className="bg-[#172033] px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">Moves</span>
                <span className="text-xl font-mono font-bold text-amber-400">{moves}</span>
              </div>
              <div className="bg-[#172033] px-4 py-2 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">Time</span>
                <span className="text-xl font-mono font-bold text-white">{formatTime(seconds)}</span>
              </div>
            </div>

            {onScoreSubmit && !submitted && (
              <button
                onClick={() => {
                  onScoreSubmit(calculatedScore);
                  setSubmitted(true);
                  confetti({ particleCount: 30 });
                }}
                className="py-2 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm mb-4"
              >
                Submit Score to Leaderboard
              </button>
            )}

            {submitted && (
              <p className="text-xs text-emerald-400 font-medium mb-4">✓ Score saved!</p>
            )}

            <button
              onClick={() => shuffleTiles(gridSize)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-sm shadow-md active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Slide tiles into ascending numerical order (1, 2, 3...). Click an adjacent tile or use Arrow keys.
      </p>
    </div>
  );
};
