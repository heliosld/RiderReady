'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, MapPin, BarChart3, Settings, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function VendorDashboard() {
  const { user, loading, createGuestSession } = useAuth();
  const [stats, setStats] = useState({
    inventoryCount: 0,
    locationCount: 0,
    pageViews: 0,
    inquiries: 0
  });

  // Create guest session if not logged in
  useEffect(() => {
    if (!loading && !user) {
      createGuestSession();
    }
  }, [loading, user, createGuestSession]);

  // For now, mock data - will connect to API later
  useEffect(() => {
    setStats({
      inventoryCount: 0,
      locationCount: 7,
      pageViews: 0,
      inquiries: 0
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Vendor Dashboard</h1>
              <p className="text-gray-400 mt-1">LightWorks Productions</p>
            </div>
            <Link
              href="/vendors/lightworks-productions"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              View Public Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-amber-500" />
              <h3 className="text-gray-400 text-sm font-medium">Fixtures Listed</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.inventoryCount}</p>
          </div>

          <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <h3 className="text-gray-400 text-sm font-medium">Locations</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.locationCount}</p>
          </div>

          <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <h3 className="text-gray-400 text-sm font-medium">Page Views</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats.pageViews}</p>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </div>

          <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-purple-500" />
              <h3 className="text-gray-400 text-sm font-medium">Profile</h3>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-sm text-gray-400">60%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Complete your profile</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-dark-secondary border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/vendor/inventory/add"
              className="flex items-center gap-3 p-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/50 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Plus className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-amber-500 transition-colors">
                  Add Fixtures
                </h3>
                <p className="text-sm text-gray-400">Build your inventory</p>
              </div>
            </Link>

            <Link
              href="/dashboard/vendor/profile/edit"
              className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-gray-600 rounded-lg">
                <Settings className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-gray-300 transition-colors">
                  Edit Profile
                </h3>
                <p className="text-sm text-gray-400">Company info & settings</p>
              </div>
            </Link>

            <Link
              href="/dashboard/vendor/locations"
              className="flex items-center gap-3 p-4 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded-lg transition-colors group"
            >
              <div className="p-2 bg-gray-600 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-gray-300 transition-colors">
                  Manage Locations
                </h3>
                <p className="text-sm text-gray-400">Update addresses & contact info</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        {stats.inventoryCount === 0 && (
          <div className="bg-gradient-to-br from-amber-900/20 to-amber-950/20 border border-amber-900/50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-3">Welcome to Your Vendor Dashboard!</h2>
            <p className="text-gray-300 mb-6">
              Start showcasing your inventory to production professionals. Add your fixtures to let customers know what you have available.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-white">Add your inventory</h4>
                  <p className="text-sm text-gray-400">Select fixtures you have in stock and specify quantity ranges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-white">Specify availability</h4>
                  <p className="text-sm text-gray-400">Mark fixtures as available for rental or purchase</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-black text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-white">Start receiving inquiries</h4>
                  <p className="text-sm text-gray-400">Customers will see your inventory on fixture pages</p>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard/vendor/inventory/add"
              className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
            >
              Add Your First Fixtures
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
