'use client';

import Link from 'next/link';
import { Lightbulb, Speaker, Monitor, Guitar, Boxes, Users, Construction, Zap } from 'lucide-react';

export default function HubsPage() {
  const hubs = [
    {
      id: 'lighting',
      name: 'Lighting Hub',
      icon: Lightbulb,
      description: 'Automated lights, conventionals, consoles, dimmers, and control systems',
      available: true,
      color: 'amber',
      link: '/fixtures'
    },
    {
      id: 'audio',
      name: 'Audio Hub',
      icon: Speaker,
      description: 'Consoles, line arrays, speakers, microphones, amplifiers, and processors',
      available: false,
      color: 'blue',
      link: '/audio'
    },
    {
      id: 'video',
      name: 'Video Hub',
      icon: Monitor,
      description: 'LED walls, projectors, cameras, media servers, and switchers',
      available: false,
      color: 'purple',
      link: '/video'
    },
    {
      id: 'backline',
      name: 'Backline Hub',
      icon: Guitar,
      description: 'Amplifiers, drums, keyboards, guitars, and specialty instruments',
      available: false,
      color: 'red',
      link: '/backline'
    },
    {
      id: 'staging',
      name: 'Staging & Rigging Hub',
      icon: Construction,
      description: 'Staging platforms, truss, motors, rigging hardware, and lifts',
      available: false,
      color: 'gray',
      link: '/staging'
    },
    {
      id: 'power',
      name: 'Power & Distribution Hub',
      icon: Zap,
      description: 'Generators, distros, cable, breakout boxes, and power management',
      available: false,
      color: 'yellow',
      link: '/power'
    },
    {
      id: 'crew',
      name: 'Crew & Labor Hub',
      icon: Users,
      description: 'Technicians, engineers, riggers, and production staff',
      available: false,
      color: 'green',
      link: '/crew'
    },
    {
      id: 'services',
      name: 'Production Services Hub',
      icon: Boxes,
      description: 'Trucking, warehousing, freight, and logistics services',
      available: false,
      color: 'indigo',
      link: '/services'
    }
  ];

  const getColorClasses = (color: string, available: boolean) => {
    if (!available) {
      return {
        border: 'border-gray-700',
        bg: 'bg-gray-900/30',
        icon: 'text-gray-500',
        badge: 'bg-gray-800 text-gray-400'
      };
    }
    
    const colors: any = {
      amber: {
        border: 'border-amber-700 hover:border-amber-500',
        bg: 'bg-amber-950/30 hover:bg-amber-950/50',
        icon: 'text-amber-500',
        badge: 'bg-amber-900 text-amber-300'
      },
      blue: {
        border: 'border-blue-700 hover:border-blue-500',
        bg: 'bg-blue-950/30 hover:bg-blue-950/50',
        icon: 'text-blue-500',
        badge: 'bg-blue-900 text-blue-300'
      },
      purple: {
        border: 'border-purple-700 hover:border-purple-500',
        bg: 'bg-purple-950/30 hover:bg-purple-950/50',
        icon: 'text-purple-500',
        badge: 'bg-purple-900 text-purple-300'
      },
      red: {
        border: 'border-red-700 hover:border-red-500',
        bg: 'bg-red-950/30 hover:bg-red-950/50',
        icon: 'text-red-500',
        badge: 'bg-red-900 text-red-300'
      },
      gray: {
        border: 'border-gray-700 hover:border-gray-500',
        bg: 'bg-gray-900/30 hover:bg-gray-900/50',
        icon: 'text-gray-400',
        badge: 'bg-gray-800 text-gray-300'
      },
      yellow: {
        border: 'border-yellow-700 hover:border-yellow-500',
        bg: 'bg-yellow-950/30 hover:bg-yellow-950/50',
        icon: 'text-yellow-500',
        badge: 'bg-yellow-900 text-yellow-300'
      },
      green: {
        border: 'border-green-700 hover:border-green-500',
        bg: 'bg-green-950/30 hover:bg-green-950/50',
        icon: 'text-green-500',
        badge: 'bg-green-900 text-green-300'
      },
      indigo: {
        border: 'border-indigo-700 hover:border-indigo-500',
        bg: 'bg-indigo-950/30 hover:bg-indigo-950/50',
        icon: 'text-indigo-500',
        badge: 'bg-indigo-900 text-indigo-300'
      }
    };
    
    return colors[color] || colors.gray;
  };

  return (
    <div className="page-wrapper">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Equipment Hubs
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Specialized databases for every department in live production. Search, compare, and source equipment across all technical disciplines.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
            {hubs.map((hub) => {
              const Icon = hub.icon;
              const colors = getColorClasses(hub.color, hub.available);
              
              const cardContent = (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <Icon className={`w-12 h-12 ${colors.icon}`} />
                    {!hub.available && (
                      <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}>
                        Coming Soon
                      </span>
                    )}
                    {hub.available && (
                      <span className="bg-green-900 text-green-300 px-3 py-1 rounded-full text-xs font-semibold">
                        Beta Test Now
                      </span>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-3 text-white">
                    {hub.name}
                  </h2>
                  
                  <p className="text-gray-400 text-sm">
                    {hub.description}
                  </p>
                </>
              );

              if (hub.available) {
                return (
                  <Link
                    key={hub.id}
                    href={hub.link}
                    className={`block border-2 ${colors.border} ${colors.bg} rounded-lg p-6 transition-all`}
                  >
                    {cardContent}
                  </Link>
                );
              }

              return (
                <div
                  key={hub.id}
                  className={`border-2 ${colors.border} ${colors.bg} rounded-lg p-6 cursor-not-allowed opacity-60`}
                >
                  {cardContent}
                </div>
              );
            })}
          </div>

          <div className="mt-12 p-6 bg-dark-secondary rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold mb-3 text-white">Building the Future of Production Planning</h3>
            <p className="text-gray-400 mb-4">
              We're actively developing hubs for every production department. Each hub will feature comprehensive equipment databases, 
              advanced filtering, vendor sourcing, and community-driven feedback.
            </p>
            <p className="text-sm text-gray-500">
              Want to help shape a specific hub? Reach out to let us know what equipment databases and features would be most valuable for your department.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
