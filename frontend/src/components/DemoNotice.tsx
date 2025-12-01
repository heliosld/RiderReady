'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function DemoNotice() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenNotice, setHasSeenNotice] = useState(false);

  useEffect(() => {
    // Check last time the notice was shown (show every 10 minutes)
    const lastShown = localStorage.getItem('riderready-demo-notice-last-shown');
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;

    if (!lastShown || now - parseInt(lastShown) > tenMinutes) {
      setIsVisible(true);
    } else {
      setHasSeenNotice(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('riderready-demo-notice-last-shown', Date.now().toString());
    setIsVisible(false);
    setHasSeenNotice(true);
  };

  if (!isVisible || hasSeenNotice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-dark-secondary border-2 border-amber-600 rounded-lg shadow-2xl max-w-md mx-4 p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-3">Demo Prototype</h2>
            <p className="text-gray-300 mb-4">
              This is a demonstration version of RiderReady with limited fixtures and data. 
              Information may be incomplete or inaccurate.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              This platform is under active development. Features and data will expand over time.
            </p>
            <button
              onClick={handleDismiss}
              className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Got It</span>
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
