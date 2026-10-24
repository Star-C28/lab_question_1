import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Volume2, VolumeX, Timer, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface MemoryMatchGameProps {
  onScoreSubmit?: (score: number) => void;
}

interface CardItem {
  id: number;
  icon: string;
  name: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const CARD_SYMBOLS = [
  { icon: '⚔️', name: 'Swords', color: '#EF4444' },
  { icon: '🛡️', name: 'Shield', color: '#3B82F6' },
  { icon: '🎮', name: 'Gamepad', color: '#8B5CF6' },
  { icon: '👑', name: 'Crown', color: '#F59E0B' },
  { icon: '💎', name: 'Diamond', color: '#06B6D4' },
  { icon: '⚡', name: 'Lightning', color: '#EAB308' },
  { icon: '🚀', name: 'Rocket', color: '#EC4899' },
  { icon: '🔥', name: 'Fire', color: '#F97316' },
];

export const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onScoreSubmit }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Initialize and shuffle cards
  const initGame = useCallback(() => {
    const deck: CardItem[] = [];
    CARD_SYMBOLS.forEach((sym, index) => {
      // Add pair
      deck.push({
        id: index * 2,
        icon: sym.icon,
        name: sym.name,
        color: sym.color,
        isFlipped: false,
        isMatched: false,
      });
      deck.push({
        id: index * 2 + 1,
        icon: sym.icon,
        name: sym.name,
        color: sym.color,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setSeconds(0);
    setIsTimerActive(false);
    setIsGameWon(false);
    setSubmitted(false);
    sounds.playClick(400);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerActive && !isGameWon) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, isGameWon]);

  const handleCardClick = (index: number) => {
    // Prevent clicking matched or already flipped card or during pair evaluation
    if (
      cards[index].isMatched ||
      cards[index].isFlipped ||
      flippedIndices.length >= 2 ||
      isGameWon
    ) {
      return;
    }

    // Start timer on first move
    if (!isTimerActive) {
      setIsTimerActive(true);
    }

    sounds.playFlip();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If two cards flipped, check match
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const cardOne = newCards[firstIdx];
      const cardTwo = newCards[secondIdx];

      if (cardOne.name === cardTwo.name) {
        // Matched!
        setTimeout(() => {
          sounds.playScore();
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            )
          );
          setFlippedIndices([]);
          setMatchedPairs((p) => {
            const nextCount = p + 1;
            if (nextCount === CARD_SYMBOLS.length) {
              // Game Won!
              setIsGameWon(true);
              setIsTimerActive(false);
              sounds.playWin();
              try {
                confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
              } catch {}
            }
            return nextCount;
          });
        }, 300);
      } else {
        // Mismatch - flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Higher score = fewer moves and less time
  const calculatedScore = Math.max(
    100,
    Math.round(2000 - moves * 45 - seconds * 10)
  );

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-[#172033] border border-emerald-500/30 rounded-xl px-4 py-3 mb-4 shadow-lg">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-1.5">
            <Timer className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Time</span>
              <span className="text-xl font-mono font-bold text-slate-100">{formatTime(seconds)}</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Moves</span>
            <span className="text-xl font-mono font-bold text-cyan-400">{moves}</span>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Matched</span>
            <span className="text-xl font-mono font-bold text-purple-400">{matchedPairs} / {CARD_SYMBOLS.length}</span>
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

          <button
            onClick={initGame}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="relative w-full max-w-[440px] bg-[#0B1020] border-2 border-emerald-500/30 rounded-2xl p-4 shadow-2xl">
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card, idx) => {
            const isRevealed = card.isFlipped || card.isMatched;
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched}
                aria-label={isRevealed ? card.name : `Card ${idx + 1}`}
                className={`relative aspect-square rounded-xl flex items-center justify-center transition-all duration-300 transform perspective-1000 ${
                  card.isMatched
                    ? 'bg-emerald-950/60 border-2 border-emerald-500 shadow-md scale-95 opacity-80'
                    : isRevealed
                    ? 'bg-[#1E293B] border-2 border-cyan-400 shadow-lg scale-100'
                    : 'bg-[#172033] border border-slate-700 hover:border-purple-500 hover:scale-[1.03] active:scale-95'
                }`}
              >
                {isRevealed ? (
                  <div className="flex flex-col items-center justify-center animate-fade-in">
                    <span className="text-3xl filter drop-shadow-md">{card.icon}</span>
                    <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">
                      {card.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <Sparkles className="w-6 h-6 text-purple-400/60" />
                  </div>
                )}

                {card.isMatched && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute top-1 right-1" />
                )}
              </button>
            );
          })}
        </div>

        {/* Victory Modal */}
        {isGameWon && (
          <div className="absolute inset-0 bg-[#0B1020]/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mb-2 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Memory Cleared!</span>
            <h3 className="text-2xl font-black text-white mt-1">Excellent Recall!</h3>
            
            <div className="grid grid-cols-3 gap-3 my-4 w-full max-w-xs">
              <div className="bg-[#172033] p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">Time</span>
                <span className="text-lg font-mono font-bold text-white">{formatTime(seconds)}</span>
              </div>
              <div className="bg-[#172033] p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">Moves</span>
                <span className="text-lg font-mono font-bold text-cyan-400">{moves}</span>
              </div>
              <div className="bg-[#172033] p-2.5 rounded-lg border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase block">Score</span>
                <span className="text-lg font-mono font-bold text-amber-400">{calculatedScore}</span>
              </div>
            </div>

            {onScoreSubmit && !submitted && (
              <button
                onClick={() => {
                  onScoreSubmit(calculatedScore);
                  setSubmitted(true);
                  confetti({ particleCount: 30 });
                }}
                className="py-2 px-5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm mb-4"
              >
                Submit Score to Leaderboard
              </button>
            )}

            {submitted && (
              <p className="text-xs text-emerald-400 font-medium mb-4">✓ Score successfully submitted!</p>
            )}

            <button
              onClick={initGame}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold text-sm shadow-md active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Flip cards and match all 8 pairs in the fewest moves to earn the highest IQ score.
      </p>
    </div>
  );
};
