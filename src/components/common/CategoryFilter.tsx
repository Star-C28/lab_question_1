import React from 'react';
import {
  Layers,
  Puzzle,
  Swords,
  Flame,
  Gamepad2,
  Compass,
  Brain,
  Tag,
} from 'lucide-react';
import { CategoryInfo } from '../../types/game';

export interface CategoryFilterProps {
  categories: CategoryInfo[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  gameCounts?: Record<string, number>;
  totalGamesCount?: number;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  gameCounts = {},
  totalGamesCount,
  className = '',
}) => {
  const getCategoryIcon = (name: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 shrink-0 transition-transform ${
      isSelected ? 'scale-110' : 'group-hover:scale-105'
    }`;

    switch (name.toLowerCase()) {
      case 'all':
        return <Layers className={iconClass} />;
      case 'puzzle':
        return <Puzzle className={iconClass} />;
      case 'action':
        return <Swords className={iconClass} />;
      case 'racing':
        return <Flame className={iconClass} />;
      case 'arcade':
        return <Gamepad2 className={iconClass} />;
      case 'adventure':
        return <Compass className={iconClass} />;
      case 'brain training':
      case 'brain':
        return <Brain className={iconClass} />;
      default:
        return <Tag className={iconClass} />;
    }
  };

  return (
    <div
      className={`w-full ${className}`}
      role="region"
      aria-label="Game Category and Tag Filters"
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar scroll-smooth">
        {/* All Games Pill */}
        <button
          type="button"
          onClick={() => onSelectCategory('All')}
          aria-pressed={selectedCategory === 'All'}
          className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all duration-200 active:scale-95 ${
            selectedCategory === 'All'
              ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg neon-glow-purple border border-purple-400/30'
              : 'bg-[#172033] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600'
          }`}
        >
          {getCategoryIcon('all', selectedCategory === 'All')}
          <span>All Games</span>
          {typeof totalGamesCount === 'number' && (
            <span
              className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                selectedCategory === 'All'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-900/80 text-slate-400 group-hover:text-slate-300'
              }`}
            >
              {totalGamesCount}
            </span>
          )}
        </button>

        {/* Dynamic Category / Tag Pills */}
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          const count = gameCounts[cat.name];

          return (
            <button
              key={cat.id || cat.name}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              aria-pressed={isSelected}
              className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-lg neon-glow-cyan border border-cyan-400/30'
                  : 'bg-[#172033] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <span
                style={{ color: isSelected ? '#FFFFFF' : cat.color || '#06B6D4' }}
                className="transition-colors"
              >
                {getCategoryIcon(cat.name, isSelected)}
              </span>
              <span>{cat.name}</span>

              {typeof count === 'number' && (
                <span
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-900/80 text-slate-400 group-hover:text-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
