'use client';

import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

interface UseCaseInsightsProps {
  useCase: string;
  fixture: any;
}

const USE_CASE_INSIGHTS = {
  concert_touring: {
    label: 'Concert Touring',
    importantSpecs: ['brightness', 'zoom_range', 'color_mixing', 'beam_effects', 'weight', 'durability'],
    priorities: [
      { spec: 'brightness', label: 'High Output', reason: 'Needs to cut through ambient light in large venues' },
      { spec: 'weight', label: 'Portability', reason: 'Frequent load-ins and transport' },
      { spec: 'zoom_range', label: 'Versatility', reason: 'Different venue sizes require flexible beam angles' },
      { spec: 'durability', label: 'Road-Worthy', reason: 'Must withstand constant touring wear and tear' }
    ],
    recommendations: [
      'Look for fixtures with flight case options',
      'Consider power consumption for generator shows',
      'Check DMX channel modes for complexity vs speed'
    ]
  },
  theater: {
    label: 'Theater',
    importantSpecs: ['color_mixing', 'zoom_range', 'noise_level', 'dimming_curve', 'color_temperature'],
    priorities: [
      { spec: 'noise_level', label: 'Quiet Operation', reason: 'Cannot interfere with live performances' },
      { spec: 'color_mixing', label: 'Color Accuracy', reason: 'Skin tones and scenic consistency critical' },
      { spec: 'dimming_curve', label: 'Smooth Dimming', reason: 'Theatrical fades require precise control' },
      { spec: 'zoom_range', label: 'Flexible Shaping', reason: 'Various throw distances and spot sizes needed' }
    ],
    recommendations: [
      'Prioritize low noise levels (under 40dB)',
      'Check for tungsten-style dimming curves',
      'Verify smooth color transitions at all intensities'
    ]
  },
  corporate_events: {
    label: 'Corporate Events',
    importantSpecs: ['reliability', 'ease_of_use', 'color_mixing', 'zoom_range', 'weight'],
    priorities: [
      { spec: 'reliability', label: 'Dependability', reason: 'Zero tolerance for failures during presentations' },
      { spec: 'ease_of_use', label: 'Quick Setup', reason: 'Tight load-in windows and non-technical staff' },
      { spec: 'color_mixing', label: 'Brand Colors', reason: 'Must match corporate color schemes precisely' },
      { spec: 'weight', label: 'Portability', reason: 'Frequent venue changes and temporary installations' }
    ],
    recommendations: [
      'Look for preset color libraries',
      'Consider fixtures with built-in effects for easy wow factor',
      'Check for RDM support for quick troubleshooting'
    ]
  },
  broadcast: {
    label: 'Broadcast/TV',
    importantSpecs: ['color_temperature', 'cri_rating', 'flicker_free', 'dimming_curve', 'noise_level'],
    priorities: [
      { spec: 'cri_rating', label: 'High CRI', reason: 'Camera color accuracy is critical (95+ ideal)' },
      { spec: 'flicker_free', label: 'Flicker-Free', reason: 'High frame rate cameras reveal PWM flickering' },
      { spec: 'color_temperature', label: 'Tunable White', reason: 'Must match daylight or tungsten sources' },
      { spec: 'noise_level', label: 'Silent Operation', reason: 'Microphones will pick up fan noise' }
    ],
    recommendations: [
      'Verify high-speed dimming (>1200Hz PWM)',
      'Check TLCI ratings in addition to CRI',
      'Look for fanless or ultra-quiet models'
    ]
  },
  architectural: {
    label: 'Architectural',
    importantSpecs: ['ip_rating', 'longevity', 'color_consistency', 'dimming_curve', 'mounting_options'],
    priorities: [
      { spec: 'ip_rating', label: 'Weather Protection', reason: 'Outdoor installations require high IP ratings' },
      { spec: 'longevity', label: 'Long Life', reason: 'Difficult to service permanently installed fixtures' },
      { spec: 'color_consistency', label: 'Consistency', reason: 'Multiple units must match over years' },
      { spec: 'dimming_curve', label: 'Smooth Dimming', reason: 'Architectural fades are highly visible' }
    ],
    recommendations: [
      'Look for IP65+ for outdoor use',
      'Check LED lifespan and lumen maintenance',
      'Verify warranty period and replacement part availability'
    ]
  },
  worship: {
    label: 'Houses of Worship',
    importantSpecs: ['value', 'reliability', 'ease_of_use', 'color_mixing', 'zoom_range'],
    priorities: [
      { spec: 'value', label: 'Cost-Effective', reason: 'Budget-conscious with volunteer operators' },
      { spec: 'ease_of_use', label: 'User-Friendly', reason: 'Must be operable by volunteers with varying skill' },
      { spec: 'reliability', label: 'Dependable', reason: 'Weekly services cannot have technical issues' },
      { spec: 'color_mixing', label: 'Mood Creation', reason: 'Different worship styles need flexible colors' }
    ],
    recommendations: [
      'Consider packages with multiple fixtures',
      'Look for good manufacturer support and training',
      'Check for preset programs and simple control modes'
    ]
  },
  club_dj: {
    label: 'Club/DJ',
    importantSpecs: ['beam_effects', 'speed', 'color_mixing', 'brightness', 'built_in_effects'],
    priorities: [
      { spec: 'beam_effects', label: 'Visual Impact', reason: 'Beam looks and aerial effects are key' },
      { spec: 'speed', label: 'Fast Movement', reason: 'Quick pan/tilt for energetic looks' },
      { spec: 'built_in_effects', label: 'Built-in FX', reason: 'Standalone operation without complex programming' },
      { spec: 'brightness', label: 'Punch', reason: 'Must cut through haze and compete with other lights' }
    ],
    recommendations: [
      'Look for prism, gobo, and animation wheel options',
      'Check for sound-activated modes',
      'Verify compatibility with DMX software like Freestyler or QLC+'
    ]
  },
  outdoor_events: {
    label: 'Outdoor Events',
    importantSpecs: ['ip_rating', 'brightness', 'weight', 'durability', 'power_consumption'],
    priorities: [
      { spec: 'ip_rating', label: 'Weather Resistance', reason: 'Must withstand rain, dust, and temperature swings' },
      { spec: 'brightness', label: 'Daylight Punch', reason: 'Outdoor ambient light requires high output' },
      { spec: 'weight', label: 'Portability', reason: 'Often set up in remote locations' },
      { spec: 'power_consumption', label: 'Efficiency', reason: 'Generator power is expensive and limited' }
    ],
    recommendations: [
      'Look for IP65 or higher rating',
      'Consider battery-powered options for remote areas',
      'Check for temperature operating range'
    ]
  }
};

export default function UseCaseInsights({ useCase, fixture }: UseCaseInsightsProps) {
  const insights = USE_CASE_INSIGHTS[useCase as keyof typeof USE_CASE_INSIGHTS];
  
  if (!insights) return null;

  return (
    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Lightbulb className="w-6 h-6 text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">
            {insights.label} Insights
          </h3>
          <p className="text-sm text-gray-300">
            Here's what matters most for your application
          </p>
        </div>
      </div>

      {/* Priority Specs */}
      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          Key Priorities for {insights.label}
        </h4>
        <div className="grid md:grid-cols-2 gap-3">
          {insights.priorities.map((priority, idx) => (
            <div
              key={idx}
              className="bg-dark-secondary border border-gray-700 rounded-lg p-3"
            >
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-blue-400">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-white text-sm mb-1">{priority.label}</h5>
                  <p className="text-xs text-gray-400">{priority.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-dark-secondary/50 border border-amber-500/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4" />
          Pro Tips
        </h4>
        <ul className="space-y-2">
          {insights.recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-amber-400 mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
