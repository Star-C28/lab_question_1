import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface EmbedGamePlayerProps {
  embedUrl?: string;
  title: string;
}

export const EmbedGamePlayer: React.FC<EmbedGamePlayerProps> = ({ embedUrl, title }) => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  if (!embedUrl) {
    return (
      <div className="w-full h-96 rounded-2xl bg-[#172033] border border-slate-700 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
        <h4 className="text-lg font-bold text-white mb-1">No Game Source URL Configured</h4>
        <p className="text-sm text-slate-400 max-w-md">
          This game was registered as an embedded title, but no valid URL was provided. The administrator can update the game URL in the Admin Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Security sandbox banner */}
      <div className="w-full flex items-center justify-between bg-slate-900/90 border border-slate-700/60 rounded-t-xl px-4 py-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5 text-cyan-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sandboxed HTML5 Player</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setKey((k) => k + 1)}
            className="flex items-center gap-1 text-slate-300 hover:text-white"
            title="Reload frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload</span>
          </button>
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300"
          >
            <span>Open Source</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Frame wrapper */}
      <div className="relative w-full aspect-video min-h-[420px] bg-black rounded-b-xl border border-t-0 border-slate-800 overflow-hidden shadow-2xl">
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0B1020]">
            <AlertCircle className="w-12 h-12 text-rose-400 mb-2" />
            <h4 className="text-base font-bold text-white">External Game Stream Blocked</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
              The external host may have X-Frame-Options or CSP headers that prevent embedding directly inside an iframe.
            </p>
            <a
              href={embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-1.5"
            >
              <span>Play on Official Host</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <iframe
            key={key}
            src={embedUrl}
            title={title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
            allow="fullscreen; autoplay; gamepad"
            onError={() => setHasError(true)}
          />
        )}
      </div>
    </div>
  );
};
