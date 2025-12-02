'use client';

import { useState } from 'react';
import { Briefcase, Users, Building2, Radio, Mountain, Church, Music, Camera } from 'lucide-react';

interface UseCaseSelectorProps {
  onSelect: (useCase: string, userRole?: string) => void;
  currentSelection?: string;
}

const USE_CASES = [
  { id: 'concert_touring', label: 'Concert Touring', icon: Music, color: 'from-purple-500 to-pink-500' },
  { id: 'theater', label: 'Theater', icon: Camera, color: 'from-red-500 to-orange-500' },
  { id: 'corporate_events', label: 'Corporate Events', icon: Building2, color: 'from-blue-500 to-cyan-500' },
  { id: 'broadcast', label: 'Broadcast/TV', icon: Radio, color: 'from-green-500 to-emerald-500' },
  { id: 'architectural', label: 'Architectural', icon: Mountain, color: 'from-amber-500 to-yellow-500' },
  { id: 'worship', label: 'Houses of Worship', icon: Church, color: 'from-indigo-500 to-purple-500' },
  { id: 'club_dj', label: 'Club/DJ', icon: Music, color: 'from-pink-500 to-rose-500' },
  { id: 'outdoor_events', label: 'Outdoor Events', icon: Mountain, color: 'from-teal-500 to-green-500' },
];

const USER_ROLES = [
  { id: 'lighting_designer', label: 'Lighting Designer' },
  { id: 'rental_company', label: 'Rental Company' },
  { id: 'venue_manager', label: 'Venue Manager' },
  { id: 'production_company', label: 'Production Company' },
  { id: 'student', label: 'Student' },
  { id: 'other', label: 'Other' },
];

export default function UseCaseSelector({ onSelect, currentSelection }: UseCaseSelectorProps) {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedUseCase, setSelectedUseCase] = useState<string | null>(currentSelection || null);

  const handleUseCaseClick = (useCaseId: string) => {
    setSelectedUseCase(useCaseId);
    setShowRoleSelector(true);
  };

  const handleRoleSelect = (roleId: string) => {
    if (selectedUseCase) {
      onSelect(selectedUseCase, roleId);
      setShowRoleSelector(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <Briefcase className="w-6 h-6 text-amber-400" />
        <div>
          <h3 className="text-lg font-bold text-white">What's your use case?</h3>
          <p className="text-sm text-gray-300">Help us show you the most relevant information</p>
        </div>
      </div>

      {!showRoleSelector ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {USE_CASES.map((useCase) => {
            const Icon = useCase.icon;
            const isSelected = selectedUseCase === useCase.id;
            
            return (
              <button
                key={useCase.id}
                onClick={() => handleUseCaseClick(useCase.id)}
                className={`relative overflow-hidden p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/20 scale-105'
                    : 'border-gray-700 bg-dark-secondary hover:border-amber-500/50 hover:bg-dark-tertiary'
                }`}
              >
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${useCase.color} bg-opacity-20`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-200">{useCase.label}</span>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-300">And what's your role?</p>
            <button
              onClick={() => setShowRoleSelector(false)}
              className="text-xs text-amber-400 hover:text-amber-300"
            >
              ← Change use case
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {USER_ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="p-3 rounded-lg border border-gray-700 bg-dark-secondary hover:border-amber-500 hover:bg-dark-tertiary transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-gray-200">{role.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
