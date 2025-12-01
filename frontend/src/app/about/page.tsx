'use client';

import { Lightbulb, Users, Target, Rocket, CheckCircle2, Circle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-white">
          About RiderReady
        </h1>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white rounded-lg p-8 mb-8 shadow-xl shadow-amber-900/20">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="w-10 h-10 text-white" />
          <h2 className="text-3xl font-bold text-white">The Future of Production Planning</h2>
        </div>
        <p className="text-lg text-white">
          RiderReady is the comprehensive equipment database and planning platform for touring production professionals across lighting, audio, video, backline, and all technical departments.
        </p>
        </div>

        {/* What It Is */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl font-bold text-white">What RiderReady Is</h2>
          </div>
          <div className="card-dark p-6 space-y-4">
          <p className="text-gray-400">
            RiderReady is a specialized database and search platform built for production professionals across all departments—lighting, audio, video, backline, and beyond. We're solving the age-old problem of "Where can I get X equipment in Y city?" and making it easier to build accurate technical riders, source gear, and plan productions with confidence.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-white">For Lighting Designers</h3>
              <p className="text-sm text-gray-400">
                Search fixtures by beam angle, output, color mixing, and effects. Compare specs across manufacturers and find local vendors with specific gear in your tour markets.
              </p>
            </div>
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-white">For Production Managers</h3>
              <p className="text-sm text-gray-400">
                Verify equipment availability, coordinate multi-department gear sourcing, and manage vendor relationships across all tour stops efficiently.
              </p>
            </div>
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-white">For Audio Engineers</h3>
              <p className="text-sm text-gray-400">
                Find consoles, line arrays, and processing gear by I/O count, power handling, and connectivity. Locate vendors with compatible systems in every market.
              </p>
            </div>
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-white">For Backline Techs</h3>
              <p className="text-sm text-gray-400">
                Source amps, drums, keyboards, and specialty instruments. Connect with backline vendors who stock artist-specific gear and vintage equipment.
              </p>
            </div>
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-white">For Video Engineers</h3>
              <p className="text-sm text-gray-400">
                Search LED walls by pixel pitch and resolution, compare camera systems, and find media servers. Build riders for touring video packages.
              </p>
            </div>
            <div className="border border-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2 text-white">For Tour Managers</h3>
              <p className="text-sm text-gray-400">
                Oversee all technical departments from one platform. Verify vendor capabilities, manage advance logistics, and ensure seamless show-day operations.
              </p>
            </div>
          </div>
        </div>
        </section>

        {/* The Vision */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl font-bold text-white">Where We're Going</h2>
          </div>
          <div className="bg-dark-secondary border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 mb-6">
            RiderReady aims to become the industry's most comprehensive production equipment database and planning platform. Our vision extends far beyond lighting fixtures to encompass every aspect of live production, with community-driven vendor feedback and intelligent planning tools.
          </p>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-6 p-4 bg-dark-tertiary rounded-lg border border-gray-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              <span className="text-sm text-gray-300">Complete</span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <span className="text-sm text-gray-300">Beta / Sample Data</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-300">Planned</span>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                <span className="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm">Phase 1</span>
                Foundation & Research
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Core architecture and tech stack (Next.js, PostgreSQL, TypeScript)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Database schema design and optimization</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Industry research and requirements gathering</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Data collection workflows and automation</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                <span className="bg-amber-900 text-amber-200 px-3 py-1 rounded-full text-sm">Phase 2</span>
                Automated Lights MVP
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Comprehensive automated lighting fixtures database</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Advanced filtering by features, specifications, weight, and power</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Rocket className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Vendor database with location mapping (sample data)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Rocket className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Community vendor endorsements (beta - strengths & weaknesses voting)</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Fixture comparison tools</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">Phase 3</span>
                Lighting Expansion
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Conventional lighting fixtures</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Lighting consoles and control systems</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Dimming and power distribution</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Cable, rigging, and support equipment</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">Phase 4</span>
                Multi-Department Coverage
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Audio equipment: Consoles, speakers, microphones, processors</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Video/LED: LED walls, projectors, cameras, media servers</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Backline: Amplifiers, instruments, DJ equipment</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Staging: Decks, risers, barricades, scenic elements</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">Phase 5</span>
                Advanced Platform Features
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>User accounts with saved lists and project management</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Rider Builder: Drag-and-drop technical rider creation with PDF export</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Equipment comparison tools and substitution suggestions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Power and weight calculators for tour planning</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Mobile app for on-site equipment verification</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">Phase 6</span>
                Community & Collaboration
              </h3>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Community equipment reviews and ratings</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>User-submitted equipment database contributions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Best practices knowledge base and tutorials</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <Circle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                  <span>Equipment marketplace and job board</span>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </section>

        {/* Community */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl font-bold text-white">Built for the Community</h2>
          </div>
          <div className="bg-dark-secondary border border-gray-800 rounded-lg p-6">
          <p className="text-gray-400 mb-4">
            RiderReady is being built by production professionals, for production professionals. We understand the challenges of touring, the pressure of tight deadlines, and the importance of having accurate equipment information at your fingertips.
          </p>
          <p className="text-gray-400">
            Our goal is to save you time, reduce stress, and help you make better-informed decisions about equipment selection and sourcing. Whether you're planning a world tour or a single show, RiderReady will be your trusted companion.
          </p>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-dark-secondary border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">
            Start Exploring
          </h2>
          <p className="text-gray-400 mb-6">
            Browse our growing database of automated lighting fixtures and discover vendors near you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/fixtures"
              className="bg-amber-600 hover:bg-amber-700 text-black px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              Browse Fixtures
            </Link>
            <Link
              href="/vendors"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
            >
              Find Vendors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
