'use client';

import { CheckCircle2, Shield } from 'lucide-react';

interface CertifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function CertifiedBadge({ 
  size = 'md', 
  showLabel = true,
  className = '' 
}: CertifiedBadgeProps) {
  const sizes = {
    sm: { icon: 'w-4 h-4', text: 'text-xs', padding: 'px-2 py-1' },
    md: { icon: 'w-5 h-5', text: 'text-sm', padding: 'px-3 py-1.5' },
    lg: { icon: 'w-6 h-6', text: 'text-base', padding: 'px-4 py-2' }
  };

  const config = sizes[size];

  if (!showLabel) {
    return (
      <div className={`inline-flex items-center ${className}`} title="Rider Ready Certified">
        <Shield className={`${config.icon} text-green-500`} />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${config.padding} bg-green-500/10 border border-green-500/30 rounded-lg ${className}`}>
      <Shield className={`${config.icon} text-green-500`} />
      <span className={`${config.text} font-semibold text-green-500`}>
        Rider Ready Certified
      </span>
    </div>
  );
}

export function CertifiedTooltip() {
  return (
    <div className="text-sm text-gray-300 max-w-xs">
      <p className="font-semibold text-white mb-2 flex items-center gap-2">
        <Shield className="w-4 h-4 text-green-500" />
        Rider Ready Certified
      </p>
      <p className="mb-2">
        This fixture has maintained a <strong>90%+ approval rating</strong> across all endorsement categories from verified professionals.
      </p>
      <p className="text-xs text-gray-400">
        Certification indicates consistent performance and reliability in professional touring production environments.
      </p>
    </div>
  );
}
