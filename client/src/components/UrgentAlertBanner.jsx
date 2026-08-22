import React, { useState } from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';

export default function UrgentAlertBanner({ alert, onOpenNotice }) {
  const [dismissed, setDismissed] = useState(false);

  if (!alert || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4 py-2.5 shadow-md relative overflow-hidden animate-in fade-in slide-in-from-top-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2.5">
          <span className="bg-white/20 p-1 rounded-md animate-pulse">
            <AlertTriangle className="w-4 h-4 text-white" />
          </span>
          <span className="font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded text-[11px]">
            URGENT CLASS ALERT
          </span>
          <span className="truncate max-w-xs sm:max-w-xl font-semibold">
            {alert.title}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onOpenNotice && onOpenNotice(alert)}
            className="hidden sm:inline-flex items-center gap-1 text-xs bg-white text-slate-900 px-2.5 py-1 rounded-md font-bold shadow-xs hover:bg-slate-100 transition"
          >
            Read Notice <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded transition text-white/80 hover:text-white"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
