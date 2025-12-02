'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Check, Plus } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface Fixture {
  id: string;
  name: string;
  slug: string;
  manufacturer: {
    name: string;
  };
  fixture_type: {
    name: string;
  };
  primary_image_url?: string;
  total_lumens?: number;
}

export default function AddInventoryPage() {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [filteredFixtures, setFilteredFixtures] = useState<Fixture[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFixtures, setSelectedFixtures] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fixture settings for selected items
  const [fixtureSettings, setFixtureSettings] = useState<Record<string, {
    quantityRange: string;
    forRental: boolean;
    forPurchase: boolean;
  }>>({});

  useEffect(() => {
    loadFixtures();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = fixtures.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFixtures(filtered);
    } else {
      setFilteredFixtures(fixtures);
    }
  }, [searchTerm, fixtures]);

  const loadFixtures = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/fixtures?limit=100');
      const data = await response.json();
      setFixtures(data.data);
      setFilteredFixtures(data.data);
    } catch (error) {
      console.error('Error loading fixtures:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFixture = (fixtureId: string) => {
    const newSelected = new Set(selectedFixtures);
    if (newSelected.has(fixtureId)) {
      newSelected.delete(fixtureId);
      const newSettings = { ...fixtureSettings };
      delete newSettings[fixtureId];
      setFixtureSettings(newSettings);
    } else {
      newSelected.add(fixtureId);
      setFixtureSettings({
        ...fixtureSettings,
        [fixtureId]: {
          quantityRange: 'in-stock',
          forRental: true,
          forPurchase: false
        }
      });
    }
    setSelectedFixtures(newSelected);
  };

  const updateSettings = (fixtureId: string, key: string, value: any) => {
    setFixtureSettings({
      ...fixtureSettings,
      [fixtureId]: {
        ...fixtureSettings[fixtureId],
        [key]: value
      }
    });
  };

  const handleSave = async () => {
    const inventoryData = Array.from(selectedFixtures).map(id => ({
      fixtureId: id,
      quantityRange: fixtureSettings[id]?.quantityRange || 'in-stock',
      forRental: fixtureSettings[id]?.forRental || false,
      forPurchase: fixtureSettings[id]?.forPurchase || false
    }));
    
    try {
      // TODO: Get actual vendor ID from auth context
      const vendorId = 'lightworks-productions';
      const sessionToken = localStorage.getItem('session_token');
      
      const response = await fetch(`http://localhost:3001/api/v1/vendor-inventory/${vendorId}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ fixtures: inventoryData })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Successfully added ${result.added} fixtures to inventory!`);
        window.location.href = '/dashboard/vendor/inventory';
      } else {
        alert('Failed to save inventory. Please try again.');
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert('An error occurred while saving. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-gray-400">Loading fixtures...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link
            href="/dashboard/vendor"
            className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Add Fixtures to Inventory</h1>
              <p className="text-gray-400 mt-1">Select fixtures you have in stock</p>
            </div>
            {selectedFixtures.size > 0 && (
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors"
              >
                Save {selectedFixtures.size} Fixture{selectedFixtures.size !== 1 ? 's' : ''}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fixtures by name or manufacturer..."
            className="w-full pl-10 pr-4 py-3 bg-dark-secondary border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Selected count */}
        {selectedFixtures.size > 0 && (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/50 rounded-lg">
            <p className="text-amber-500 font-medium">
              {selectedFixtures.size} fixture{selectedFixtures.size !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Fixtures Grid */}
        <div className="space-y-3">
          {filteredFixtures.map(fixture => {
            const isSelected = selectedFixtures.has(fixture.id);
            const settings = fixtureSettings[fixture.id];

            return (
              <div
                key={fixture.id}
                className={`bg-dark-secondary border rounded-lg p-4 transition-all ${
                  isSelected ? 'border-amber-500 shadow-lg shadow-amber-500/10' : 'border-gray-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleFixture(fixture.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-500 border-amber-500'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4 text-black" />}
                  </button>

                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-20 bg-white rounded overflow-hidden">
                      {fixture.primary_image_url ? (
                        <ImageWithFallback
                          src={fixture.primary_image_url}
                          alt={fixture.name}
                          fill
                          className="object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white">{fixture.name}</h3>
                    <p className="text-sm text-gray-400">{fixture.manufacturer.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{fixture.fixture_type.name}</p>
                  </div>

                  {/* Settings (shown when selected) */}
                  {isSelected && settings && (
                    <div className="flex-shrink-0 flex gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Quantity</label>
                        <select
                          value={settings.quantityRange}
                          onChange={(e) => updateSettings(fixture.id, 'quantityRange', e.target.value)}
                          className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        >
                          <option value="in-stock">In Stock</option>
                          <option value="1-10">1-10</option>
                          <option value="10-50">10-50</option>
                          <option value="50-100">50-100</option>
                          <option value="100+">100+</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <input
                            type="checkbox"
                            checked={settings.forRental}
                            onChange={(e) => updateSettings(fixture.id, 'forRental', e.target.checked)}
                            className="rounded"
                          />
                          For Rental
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                          <input
                            type="checkbox"
                            checked={settings.forPurchase}
                            onChange={(e) => updateSettings(fixture.id, 'forPurchase', e.target.checked)}
                            className="rounded"
                          />
                          For Purchase
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredFixtures.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No fixtures found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
