'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface InventoryItem {
  id: number;
  fixture_id: string;
  fixture_name: string;
  fixture_slug: string;
  manufacturer_name: string;
  fixture_type_name: string;
  primary_image_url: string | null;
  quantity_range: string;
  available_for_rental: boolean;
  available_for_purchase: boolean;
  show_on_vendor_page: boolean;
  created_at: string;
}

export default function VendorInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      // TODO: Get actual vendor ID from auth context
      const vendorId = 'lightworks-productions';
      const response = await fetch(`http://localhost:3001/api/v1/vendor-inventory/${vendorId}/inventory`);
      const data = await response.json();
      setInventory(data.inventory || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inventoryId: number) => {
    if (!confirm('Are you sure you want to remove this fixture from your inventory?')) {
      return;
    }

    try {
      // TODO: Get actual vendor ID and auth token
      const vendorId = 'lightworks-productions';
      const response = await fetch(
        `http://localhost:3001/api/v1/vendor-inventory/${vendorId}/inventory/${inventoryId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('session_token')}`
          }
        }
      );

      if (response.ok) {
        setInventory(inventory.filter(item => item.id !== inventoryId));
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const toggleVisibility = async (item: InventoryItem) => {
    try {
      const vendorId = 'lightworks-productions';
      const response = await fetch(
        `http://localhost:3001/api/v1/vendor-inventory/${vendorId}/inventory/${item.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('session_token')}`
          },
          body: JSON.stringify({
            showOnVendorPage: !item.show_on_vendor_page
          })
        }
      );

      if (response.ok) {
        setInventory(inventory.map(i => 
          i.id === item.id ? { ...i, show_on_vendor_page: !i.show_on_vendor_page } : i
        ));
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="/dashboard/vendor" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">My Inventory</h1>
            <p className="text-gray-600 mt-1">{inventory.length} fixtures in inventory</p>
          </div>
          <Link
            href="/dashboard/vendor/inventory/add"
            className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            + Add Fixtures
          </Link>
        </div>

        {/* Empty State */}
        {inventory.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No inventory yet</h3>
            <p className="mt-2 text-gray-600">Get started by adding fixtures to your inventory.</p>
            <Link
              href="/dashboard/vendor/inventory/add"
              className="mt-6 inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Add Your First Fixtures
            </Link>
          </div>
        )}

        {/* Inventory List */}
        {inventory.length > 0 && (
          <div className="space-y-4">
            {inventory.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-6">
                  {/* Fixture Image */}
                  <div className="flex-shrink-0">
                    {item.primary_image_url ? (
                      <Image
                        src={item.primary_image_url}
                        alt={item.fixture_name}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Fixture Info */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link 
                          href={`/fixtures/${item.fixture_slug}`}
                          className="text-xl font-semibold text-gray-900 hover:text-amber-600 transition-colors"
                        >
                          {item.fixture_name}
                        </Link>
                        <p className="text-gray-600 mt-1">
                          {item.manufacturer_name} • {item.fixture_type_name}
                        </p>
                      </div>
                      
                      {/* Visibility Toggle */}
                      <button
                        onClick={() => toggleVisibility(item)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          item.show_on_vendor_page
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {item.show_on_vendor_page ? '👁️ Visible' : '👁️‍🗨️ Hidden'}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center gap-6 text-sm">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium text-gray-900">{item.quantity_range}</span>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-3">
                        {item.available_for_rental && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            For Rental
                          </span>
                        )}
                        {item.available_for_purchase && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                            For Purchase
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/dashboard/vendor/inventory/${item.id}/edit`}
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                      >
                        Edit Details
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
