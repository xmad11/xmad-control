/* ═══════════════════════════════════════════════════════════════════════════════
   PWA INSTALL PROMPT - Shows when app can be installed
   Glass morphism theme consistent with dashboard
   ═══════════════════════════════════════════════════════════════════════════════ */

'use client';

import { Download, RefreshCw, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GlassCard } from '@/components/glass/glass-card';
import { usePWAInstall } from '@/lib/pwa';

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after 5 seconds if installable and not dismissed
    if (isInstallable && !isInstalled && !hasDismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled, hasDismissed]);

  const handleInstall = async () => {
    await promptInstall();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setHasDismissed(true);
    // Remember dismissal for 7 days
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Check if previously dismissed within 7 days
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const daysSinceDismissal = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 7) {
        setHasDismissed(true);
      } else {
        // Reset after 7 days
        localStorage.removeItem('pwa-install-dismissed');
      }
    }
  }, []);

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:bottom-4 md:left-auto md:right-4 md:max-w-sm">
      <GlassCard className="p-4 relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4 text-slate-400" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 blur-xl rounded-full" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-3">
                <Download className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold mb-1">
              Install XMAD Control
            </h3>
            <p className="text-sm text-slate-400 mb-3">
              Add to home screen for quick access and offline support
            </p>

            {/* Action Button */}
            <button
              onClick={handleInstall}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] text-sm"
            >
              <Download className="w-4 h-4" />
              Install Now
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
