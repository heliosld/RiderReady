'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, GitCompare } from 'lucide-react';
import Link from 'next/link';

interface ComparisonQuickAddProps {
  fixtureId: string;
  fixtureName: string;
  onAdd?: () => void;
}

export default function ComparisonQuickAdd({ fixtureId, fixtureName, onAdd }: ComparisonQuickAddProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [comparisonCount, setComparisonCount] = useState(0);

  useEffect(() => {
    // Check if already in comparison list
    const comparison = JSON.parse(localStorage.getItem('riderready-comparison') || '[]');
    setIsAdded(comparison.some((item: any) => item.id === fixtureId));
    setComparisonCount(comparison.length);
  }, [fixtureId]);

  const handleToggle = () => {
    const comparison = JSON.parse(localStorage.getItem('riderready-comparison') || '[]');
    
    if (isAdded) {
      // Remove from comparison
      const updated = comparison.filter((item: any) => item.id !== fixtureId);
      localStorage.setItem('riderready-comparison', JSON.stringify(updated));
      setIsAdded(false);
      setComparisonCount(updated.length);
    } else {
      // Add to comparison
      const updated = [...comparison, { id: fixtureId, name: fixtureName, addedAt: Date.now() }];
      localStorage.setItem('riderready-comparison', JSON.stringify(updated));
      setIsAdded(true);
      setComparisonCount(updated.length);
      
      if (onAdd) onAdd();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
          isAdded
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-amber-500 hover:bg-amber-600 text-black'
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5" />
            <span>Added to Compare</span>
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            <span>Add to Compare</span>
          </>
        )}
      </button>

      {comparisonCount > 0 && (
        <Link
          href="/compare"
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-500 bg-dark-secondary hover:bg-dark-tertiary text-amber-400 font-semibold transition-all"
        >
          <GitCompare className="w-5 h-5" />
          <span>Compare ({comparisonCount})</span>
        </Link>
      )}
    </div>
  );
}
