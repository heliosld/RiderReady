'use client';

import { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, X, Building2, Store, Package } from 'lucide-react';
import axios from 'axios';

interface DemoRequestModalProps {
  fixtureId: string;
  fixtureName: string;
  manufacturerName: string;
  manufacturerId: string;
  vendors?: Array<{
    id: string;
    name: string;
    city?: string;
    state_province?: string;
    country?: string;
  }>;
  distributors?: Array<{
    id: string;
    name: string;
    city?: string;
    state_province?: string;
  }>;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  sessionId: string;
  useCase?: string;
}

export default function DemoRequestModal({
  fixtureId,
  fixtureName,
  manufacturerName,
  manufacturerId,
  vendors = [],
  distributors = [],
  isOpen,
  onClose,
  onSuccess,
  sessionId,
  useCase
}: DemoRequestModalProps) {
  const [recipientType, setRecipientType] = useState<'manufacturer' | 'vendor' | 'distributor'>('manufacturer');
  const [selectedRecipient, setSelectedRecipient] = useState<string>('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    message: '',
    preferredContactMethod: 'email',
    locationPreference: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Determine recipient ID and name
      let recipientId = '';
      let recipientName = '';

      if (recipientType === 'manufacturer') {
        recipientId = manufacturerId;
        recipientName = manufacturerName;
      } else if (recipientType === 'vendor') {
        recipientId = selectedRecipient;
        const vendor = vendors.find(v => v.id === selectedRecipient);
        recipientName = vendor?.name || '';
      } else if (recipientType === 'distributor') {
        recipientId = selectedRecipient;
        const distributor = distributors.find(d => d.id === selectedRecipient);
        recipientName = distributor?.name || '';
      }

      await axios.post(`http://localhost:3001/api/v1/tracking/fixtures/${fixtureId}/demo-request`, {
        sessionId,
        ...formData,
        useCase,
        recipientType,
        recipientId,
        recipientName
      });

      setSubmitted(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        setSubmitted(false);
        setRecipientType('manufacturer');
        setSelectedRecipient('');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          company: '',
          role: '',
          message: '',
          preferredContactMethod: 'email',
          locationPreference: ''
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting demo request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-dark-secondary border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-[10000]">
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Request Sent!</h3>
            <p className="text-gray-300">
              {manufacturerName} will be in touch soon to schedule your demo.
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Request a Demo</h2>
                <p className="text-gray-400 mt-1">
                  {fixtureName} by {manufacturerName}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Recipient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Who would you like to contact?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => {
                      setRecipientType('manufacturer');
                      setSelectedRecipient('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      recipientType === 'manufacturer'
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-gray-700 bg-dark-tertiary hover:border-gray-600'
                    }`}
                  >
                    <Building2 className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                    <div className="text-center">
                      <p className="font-semibold text-white text-sm">Manufacturer</p>
                      <p className="text-xs text-gray-400 mt-1">{manufacturerName}</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecipientType('vendor');
                      setSelectedRecipient('');
                    }}
                    disabled={vendors.length === 0}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      recipientType === 'vendor'
                        ? 'border-amber-500 bg-amber-500/10'
                        : vendors.length === 0
                        ? 'border-gray-800 bg-dark-tertiary opacity-50 cursor-not-allowed'
                        : 'border-gray-700 bg-dark-tertiary hover:border-gray-600'
                    }`}
                  >
                    <Store className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <div className="text-center">
                      <p className="font-semibold text-white text-sm">Vendor/Rental</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {vendors.length > 0 ? `${vendors.length} available` : 'None available'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRecipientType('distributor');
                      setSelectedRecipient('');
                    }}
                    disabled={distributors.length === 0}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      recipientType === 'distributor'
                        ? 'border-amber-500 bg-amber-500/10'
                        : distributors.length === 0
                        ? 'border-gray-800 bg-dark-tertiary opacity-50 cursor-not-allowed'
                        : 'border-gray-700 bg-dark-tertiary hover:border-gray-600'
                    }`}
                  >
                    <Package className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <div className="text-center">
                      <p className="font-semibold text-white text-sm">Distributor</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {distributors.length > 0 ? `${distributors.length} available` : 'None available'}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Vendor/Distributor Selection Dropdown */}
                {recipientType === 'vendor' && vendors.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Vendor *
                    </label>
                    <select
                      required
                      value={selectedRecipient}
                      onChange={(e) => setSelectedRecipient(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">Choose a vendor...</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.id}>
                          {vendor.name}
                          {(vendor.city || vendor.state_province) && 
                            ` - ${[vendor.city, vendor.state_province, vendor.country].filter(Boolean).join(', ')}`
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {recipientType === 'distributor' && distributors.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Distributor *
                    </label>
                    <select
                      required
                      value={selectedRecipient}
                      onChange={(e) => setSelectedRecipient(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">Choose a distributor...</option>
                      {distributors.map((distributor) => (
                        <option key={distributor.id} value={distributor.id}>
                          {distributor.name}
                          {(distributor.city || distributor.state_province) && 
                            ` - ${[distributor.city, distributor.state_province].filter(Boolean).join(', ')}`
                          }
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="">Select a role</option>
                  <option value="lighting_designer">Lighting Designer</option>
                  <option value="rental_company">Rental Company</option>
                  <option value="venue_manager">Venue Manager</option>
                  <option value="production_company">Production Company</option>
                  <option value="student">Student</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      checked={formData.preferredContactMethod === 'email'}
                      onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="phone"
                      checked={formData.preferredContactMethod === 'phone'}
                      onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Phone</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="either"
                      checked={formData.preferredContactMethod === 'either'}
                      onChange={(e) => setFormData({ ...formData, preferredContactMethod: e.target.value })}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-gray-300">Either</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:outline-none resize-none"
                  placeholder="Tell us about your demo needs, timeline, or any specific questions..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Request Demo</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-700 rounded-lg text-gray-300 hover:bg-dark-tertiary transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
