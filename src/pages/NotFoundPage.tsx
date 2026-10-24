import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
        <Gamepad2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">
          ERROR 404 · LEVEL NOT FOUND
        </span>
        <h1 className="text-4xl font-black text-white">Game Over!</h1>
        <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
          The requested level or portal page does not exist or has been warped to another dimension.
        </p>
      </div>

      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to PlayZone Home</span>
        </Link>
      </div>
    </div>
  );
};
