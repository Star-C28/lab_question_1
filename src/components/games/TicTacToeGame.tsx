import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Volume2, VolumeX, Bot, Users, Sparkles, Trophy } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface TicTacToeProps {
  onScoreSubmit?: (score: number) => void;
}

type Player = 'X' | 'O' | null;
type GameMode = 'ai' | 'pvp';
type Difficulty = 'easy' | 'master';

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export const TicTacToeGame: React.FC<TicTacToeProps> = ({ onScoreSubmit }) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('master');
  const [winner, setWinner] = useState<Player | 'DRAW' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState<{ x: number; o: number; draws: number }>({
    x: 0,
    o: 0,
    draws: 0,
  });
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Check winner on current board
  const checkWinner = (squares: Player[]) => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return { winner: 'DRAW' as const, line: null };
    }
    return null;
  };

  // Minimax algorithm for Master AI
  const minimax = (squares: Player[], depth: number, isMaximizing: boolean): { score: number; index?: number } => {
    const outcome = checkWinner(squares);
    if (outcome) {
      if (outcome.winner === 'O') return { score: 10 - depth };
      if (outcome.winner === 'X') return { score: depth - 10 };
      if (outcome.winner === 'DRAW') return { score: 0 };
    }

    const availableMoves = squares
      .map((val, idx) => (val === null ? idx : null))
      .filter((val): val is number => val !== null);

    if (isMaximizing) {
      let maxScore = -Infinity;
      let bestMove = availableMoves[0];

      for (const move of availableMoves) {
        squares[move] = 'O';
        const result = minimax(squares, depth + 1, false);
        squares[move] = null;

        if (result.score > maxScore) {
          maxScore = result.score;
          bestMove = move;
        }
      }
      return { score: maxScore, index: bestMove };
    } else {
      let minScore = Infinity;
      let bestMove = availableMoves[0];

      for (const move of availableMoves) {
        squares[move] = 'X';
        const result = minimax(squares, depth + 1, true);
        squares[move] = null;

        if (result.score < minScore) {
          minScore = result.score;
          bestMove = move;
        }
      }
      return { score: minScore, index: bestMove };
    }
  };

  const resetRound = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setSubmitted(false);
    sounds.playClick(440);
  };

  const resetAllStats = () => {
    resetRound();
    setScores({ x: 0, o: 0, draws: 0 });
  };

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;

    sounds.playFlip();

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const outcome = checkWinner(newBoard);
    if (outcome) {
      setWinner(outcome.winner);
      setWinningLine(outcome.line);
      handleGameOver(outcome.winner);
      return;
    }

    // Switch turns
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
  };

  // AI turn trigger
  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 'O' && !winner) {
      const availableIndices = board
        .map((v, i) => (v === null ? i : null))
        .filter((v): v is number => v !== null);

      if (availableIndices.length === 0) return;

      const timer = setTimeout(() => {
        let chosenMove: number;

        if (difficulty === 'easy' && Math.random() < 0.6) {
          // Random casual move
          chosenMove = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        } else {
          // Minimax move
          const result = minimax([...board], 0, true);
          chosenMove = result.index !== undefined ? result.index : availableIndices[0];
        }

        sounds.playFlip();

        const newBoard = [...board];
        newBoard[chosenMove] = 'O';
        setBoard(newBoard);

        const outcome = checkWinner(newBoard);
        if (outcome) {
          setWinner(outcome.winner);
          setWinningLine(outcome.line);
          handleGameOver(outcome.winner);
        } else {
          setCurrentPlayer('X');
        }
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [board, currentPlayer, gameMode, difficulty, winner]);

  const handleGameOver = (winState: Player | 'DRAW') => {
    if (winState === 'X') {
      sounds.playWin();
      setScores((s) => ({ ...s, x: s.x + 1 }));
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}
    } else if (winState === 'O') {
      sounds.playGameOver();
      setScores((s) => ({ ...s, o: s.o + 1 }));
    } else {
      sounds.playClick(300);
      setScores((s) => ({ ...s, draws: s.draws + 1 }));
    }
  };

  const getStatusMessage = () => {
    if (winner === 'DRAW') return "It's a Stalemate Draw!";
    if (winner) {
      if (gameMode === 'ai') {
        return winner === 'X' ? 'Victory! You defeated the AI!' : 'AI won this round!';
      }
      return `Player ${winner} Victorious!`;
    }
    if (gameMode === 'ai' && currentPlayer === 'O') {
      return 'AI is computing best move...';
    }
    return `Player ${currentPlayer}'s Turn`;
  };

  return (
    <div className="flex flex-col items-center select-none w-full max-w-xl mx-auto">
      {/* Top Controls & Scoreboard */}
      <div className="w-full bg-[#172033] border border-purple-500/30 rounded-xl p-4 mb-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          {/* Mode Switch */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => {
                setGameMode('ai');
                resetRound();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                gameMode === 'ai' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>vs AI</span>
            </button>
            <button
              onClick={() => {
                setGameMode('pvp');
                resetRound();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                gameMode === 'pvp' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>2 Players</span>
            </button>
          </div>

          {/* AI Difficulty */}
          {gameMode === 'ai' && (
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium">Difficulty:</span>
              <button
                onClick={() => setDifficulty('easy')}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  difficulty === 'easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'text-slate-400'
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setDifficulty('master')}
                className={`px-2 py-1 rounded text-xs font-semibold ${
                  difficulty === 'master' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'text-slate-400'
                }`}
              >
                Master AI
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(sounds.toggleMute())}
              aria-label="Toggle sound"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={resetRound}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        {/* Score Tally */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-700/60">
          <div className="bg-[#0B1020] p-2 rounded-lg border border-purple-500/20">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block">
              {gameMode === 'ai' ? 'You (X)' : 'Player X'}
            </span>
            <span className="text-xl font-mono font-bold text-white">{scores.x}</span>
          </div>
          <div className="bg-[#0B1020] p-2 rounded-lg border border-slate-700">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Ties</span>
            <span className="text-xl font-mono font-bold text-slate-300">{scores.draws}</span>
          </div>
          <div className="bg-[#0B1020] p-2 rounded-lg border border-pink-500/20">
            <span className="text-[10px] uppercase font-bold text-pink-400 block">
              {gameMode === 'ai' ? 'AI (O)' : 'Player O'}
            </span>
            <span className="text-xl font-mono font-bold text-white">{scores.o}</span>
          </div>
        </div>
      </div>

      {/* Turn indicator banner */}
      <div className="w-full text-center py-2 px-4 rounded-xl bg-[#172033]/60 border border-slate-800 mb-3">
        <span
          className={`font-bold text-sm tracking-wide ${
            winner === 'X'
              ? 'text-cyan-400'
              : winner === 'O'
              ? 'text-pink-400'
              : winner === 'DRAW'
              ? 'text-amber-400'
              : 'text-slate-200'
          }`}
        >
          {getStatusMessage()}
        </span>
      </div>

      {/* 3x3 Grid Board */}
      <div className="relative w-full max-w-[360px] aspect-square bg-[#0B1020] border-2 border-purple-500/30 rounded-2xl p-3 shadow-2xl">
        <div className="grid grid-cols-3 gap-3 w-full h-full">
          {board.map((cell, idx) => {
            const isWinningCell = winningLine?.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={Boolean(cell || winner || (gameMode === 'ai' && currentPlayer === 'O'))}
                aria-label={`Cell ${idx + 1}`}
                className={`relative rounded-xl flex items-center justify-center font-black text-5xl transition-all duration-200 ${
                  cell === null
                    ? 'bg-[#172033] hover:bg-slate-800/80 border border-slate-700 hover:border-purple-400/50 cursor-pointer active:scale-95'
                    : isWinningCell
                    ? cell === 'X'
                      ? 'bg-cyan-950/80 border-2 border-cyan-400 text-cyan-300 shadow-lg scale-100'
                      : 'bg-pink-950/80 border-2 border-pink-400 text-pink-300 shadow-lg scale-100'
                    : cell === 'X'
                    ? 'bg-[#172033] border border-cyan-500/40 text-cyan-400 shadow'
                    : 'bg-[#172033] border border-pink-500/40 text-pink-400 shadow'
                }`}
              >
                {cell === 'X' && (
                  <span className="drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] animate-fade-in">
                    ✕
                  </span>
                )}
                {cell === 'O' && (
                  <span className="drop-shadow-[0_0_12px_rgba(236,72,153,0.8)] animate-fade-in">
                    ◯
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Round Over Modal / Actions */}
        {winner && (
          <div className="absolute inset-0 bg-[#0B1020]/85 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-fade-in z-10">
            <h3 className="text-2xl font-black text-white mb-2">
              {winner === 'X' ? 'X Triumphs!' : winner === 'O' ? 'O Takes the Match!' : 'Draw Match!'}
            </h3>
            <p className="text-xs text-slate-300 mb-4">{getStatusMessage()}</p>

            {winner === 'X' && onScoreSubmit && !submitted && (
              <button
                onClick={() => {
                  onScoreSubmit(scores.x * 100);
                  setSubmitted(true);
                  confetti({ particleCount: 25 });
                }}
                className="py-1.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs mb-3"
              >
                Save Win Streak to Leaderboard
              </button>
            )}

            <button
              onClick={resetRound}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold text-sm shadow-md active:scale-95"
            >
              Play Next Round
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        {gameMode === 'ai' ? 'Challenge our unbeatable Minimax AI.' : 'Take turns with a friend locally.'}
      </p>
    </div>
  );
};
