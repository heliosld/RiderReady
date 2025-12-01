'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MessageSquare, Github, Mail, Heart, Share2, Trophy, Star } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const [vendorCount, setVendorCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/v1/vendors?limit=1');
        if (res.data && res.data.pagination) {
          setVendorCount(res.data.pagination.total);
        }
      } catch (e) {
        console.error('Error fetching stats:', e);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">
            RiderReady Community
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join the network of production professionals building the industry's most trusted equipment and vendor database.
          </p>
        </div>

        {/* Hero Stats / Gamification Teaser */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-900/50 rounded-xl p-6 text-center">
            <div className="bg-amber-900/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {vendorCount !== null ? vendorCount : '...'}
            </h3>
            <p className="text-amber-200/70 text-sm">Vendors Listed</p>
          </div>
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-900/50 rounded-xl p-6 text-center">
            <div className="bg-amber-900/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Active</h3>
            <p className="text-amber-200/70 text-sm">Vendor Endorsements</p>
          </div>
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-950/40 border border-amber-900/50 rounded-xl p-6 text-center">
            <div className="bg-amber-900/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">Open</h3>
            <p className="text-amber-200/70 text-sm">Source Contributions</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Ways to Contribute */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500" />
              Ways to Contribute
            </h2>
            
            <div className="card-dark p-6 space-y-6">
              <div className="flex gap-4">
                <div className="bg-blue-900/30 p-3 rounded-lg h-fit">
                  <Share2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Submit Data</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Help us grow the database. If you see missing fixtures, incorrect specs, or want to add a new vendor, let us know.
                  </p>
                  <a href="mailto:contribute@riderready.com" className="text-blue-400 hover:text-blue-300 text-sm font-semibold flex items-center gap-1">
                    Send Submission <Share2 className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex gap-4">
                <div className="bg-green-900/30 p-3 rounded-lg h-fit">
                  <Trophy className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Endorse Vendors</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    Your experience matters. Vote on vendor strengths and weaknesses to help other professionals make informed decisions.
                  </p>
                  <Link href="/vendors" className="text-green-400 hover:text-green-300 text-sm font-semibold flex items-center gap-1">
                    Browse Vendors <Users className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex gap-4">
                <div className="bg-purple-900/30 p-3 rounded-lg h-fit">
                  <Github className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Code & Issues</h3>
                  <p className="text-gray-400 text-sm mb-3">
                    RiderReady is open to feedback. Report bugs, request features, or contribute code to our repository.
                  </p>
                  <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-1">
                    View on GitHub <Github className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Connect & Discuss */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-amber-500" />
              Connect & Discuss
            </h2>

            <div className="grid gap-4">
              <a href="#" className="group block card-dark p-6 hover:border-amber-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Discord Server</h3>
                  <div className="bg-[#5865F2]/20 p-2 rounded">
                    <MessageSquare className="w-5 h-5 text-[#5865F2]" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Join our real-time chat for quick questions, gear talk, and community announcements.
                </p>
              </a>

              <a href="#" className="group block card-dark p-6 hover:border-amber-500/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Production Forum</h3>
                  <div className="bg-orange-900/20 p-2 rounded">
                    <Users className="w-5 h-5 text-orange-500" />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">
                  Deep dives into technical topics, rider reviews, and long-form discussions.
                </p>
              </a>

              <div className="card-dark p-6 bg-gradient-to-r from-dark-secondary to-dark-tertiary">
                <h3 className="text-lg font-bold text-white mb-2">Stay Updated</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Get the latest updates on new features, database additions, and community highlights.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-dark-primary border border-gray-700 rounded px-3 py-2 text-sm text-white flex-1 focus:outline-none focus:border-amber-500"
                  />
                  <button className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="border border-gray-800 rounded-xl p-8 text-center bg-dark-secondary/50">
          <h2 className="text-xl font-bold text-white mb-4">Community Guidelines</h2>
          <p className="text-gray-400 max-w-3xl mx-auto mb-6">
            RiderReady is built on trust and professional respect. When endorsing vendors or submitting data, please ensure accuracy and fairness. We verify all major data submissions to maintain the integrity of the platform.
          </p>
          <Link href="/about" className="text-amber-500 hover:text-amber-400 text-sm font-semibold">
            Read more about our mission &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
