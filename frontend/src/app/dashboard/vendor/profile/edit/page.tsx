'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

interface Certification {
  name: string;
  issuer: string;
  year?: number;
  description?: string;
}

export default function VendorProfileEditPage() {
  const [formData, setFormData] = useState({
    about: '',
    services: [] as string[],
    specialties: [] as string[],
    certifications: [] as Certification[],
    years_in_business: '',
    team_size: '',
    response_time: '',
    service_area: '',
    hours_of_operation: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
      notes: ''
    },
    social_media: {
      website: '',
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: ''
    }
  });

  const [newService, setNewService] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCert, setNewCert] = useState<Certification>({
    name: '',
    issuer: '',
    year: undefined,
    description: ''
  });

  const commonServices = [
    'Equipment Rental',
    'Equipment Sales',
    'Installation',
    'Design & Consultation',
    'Technical Support',
    '24/7 Emergency Service',
    'Training',
    'Maintenance & Repair',
    'Tour Support',
    'Event Production'
  ];

  const commonSpecialties = [
    'Concerts & Festivals',
    'Theater & Performing Arts',
    'Corporate Events',
    'Broadcast & Film',
    'Houses of Worship',
    'Architectural Lighting',
    'Theme Parks',
    'Museums & Exhibitions',
    'Nightclubs & Venues',
    'Outdoor Events'
  ];

  const teamSizeOptions = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const responseTimeOptions = [
    'Within 1 hour',
    'Within 2-4 hours',
    'Same business day',
    'Within 24 hours',
    'Within 48 hours'
  ];

  const addService = (service: string) => {
    if (service && !formData.services.includes(service)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addCertification = () => {
    if (newCert.name && newCert.issuer) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCert]
      }));
      setNewCert({ name: '', issuer: '', year: undefined, description: '' });
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      // TODO: Get actual vendor ID from auth context
      const vendorId = 'e87d0df0-6fe7-4e25-8a55-6b7206dcf10f'; // LightWorks Productions
      const sessionToken = localStorage.getItem('session_token');

      const response = await fetch(`http://localhost:3001/api/v1/vendors/${vendorId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Profile updated successfully!');
        window.location.href = '/dashboard/vendor';
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/vendor" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Vendor Profile</h1>
              <p className="text-gray-600 mt-1">Update your company information</p>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">About Your Company</h2>
            <textarea
              value={formData.about}
              onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              placeholder="Describe your company, history, mission, and what makes you unique..."
            />
            <p className="text-sm text-gray-500 mt-2">
              This will appear prominently on your public profile page
            </p>
          </div>

          {/* Services */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
            
            {/* Quick Add Common Services */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {commonServices.filter(s => !formData.services.includes(s)).map(service => (
                  <button
                    key={service}
                    onClick={() => addService(service)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 rounded-lg text-sm transition-colors"
                  >
                    + {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Service Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addService(newService)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Add custom service..."
              />
              <button
                onClick={() => addService(newService)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Services */}
            <div className="flex flex-wrap gap-2">
              {formData.services.map(service => (
                <span
                  key={service}
                  className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  {service}
                  <button
                    onClick={() => removeService(service)}
                    className="hover:text-amber-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Specialties & Industries</h2>
            
            {/* Quick Add Common Specialties */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Quick add:</p>
              <div className="flex flex-wrap gap-2">
                {commonSpecialties.filter(s => !formData.specialties.includes(s)).map(specialty => (
                  <button
                    key={specialty}
                    onClick={() => addSpecialty(specialty)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 rounded-lg text-sm transition-colors"
                  >
                    + {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Specialty Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSpecialty(newSpecialty)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="Add custom specialty..."
              />
              <button
                onClick={() => addSpecialty(newSpecialty)}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Specialties */}
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map(specialty => (
                <span
                  key={specialty}
                  className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  {specialty}
                  <button
                    onClick={() => removeSpecialty(specialty)}
                    className="hover:text-amber-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Certifications & Credentials</h2>
            
            {/* Add Certification Form */}
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  value={newCert.name}
                  onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Certification name *"
                />
                <input
                  type="text"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert(prev => ({ ...prev, issuer: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Issuing organization *"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <input
                  type="number"
                  value={newCert.year || ''}
                  onChange={(e) => setNewCert(prev => ({ ...prev, year: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Year (optional)"
                  min="1900"
                  max={new Date().getFullYear()}
                />
                <div className="md:col-span-2"></div>
              </div>
              <textarea
                value={newCert.description}
                onChange={(e) => setNewCert(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 mb-3"
                placeholder="Description (optional)"
              />
              <button
                onClick={addCertification}
                disabled={!newCert.name || !newCert.issuer}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Certification
              </button>
            </div>

            {/* Certification List */}
            <div className="space-y-3">
              {formData.certifications.map((cert, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-600">
                        {cert.issuer}{cert.year ? ` • ${cert.year}` : ''}
                      </p>
                      {cert.description && (
                        <p className="text-sm text-gray-500 mt-1">{cert.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeCertification(idx)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Company Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years in Business
                </label>
                <input
                  type="number"
                  value={formData.years_in_business}
                  onChange={(e) => setFormData(prev => ({ ...prev, years_in_business: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="25"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size
                </label>
                <select
                  value={formData.team_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, team_size: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select...</option>
                  {teamSizeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typical Response Time
                </label>
                <select
                  value={formData.response_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, response_time: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select...</option>
                  {responseTimeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Area
                </label>
                <input
                  type="text"
                  value={formData.service_area}
                  onChange={(e) => setFormData(prev => ({ ...prev, service_area: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="North America, Worldwide, etc."
                />
              </div>
            </div>
          </div>

          {/* Hours of Operation */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Hours of Operation</h2>
            <div className="space-y-3">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <div key={day} className="flex items-center gap-4">
                  <label className="w-24 text-sm font-medium text-gray-700 capitalize">{day}</label>
                  <input
                    type="text"
                    value={formData.hours_of_operation[day as keyof typeof formData.hours_of_operation] as string}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      hours_of_operation: {
                        ...prev.hours_of_operation,
                        [day]: e.target.value
                      }
                    }))}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="9:00 AM - 5:00 PM, Closed, etc."
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <input
                  type="text"
                  value={formData.hours_of_operation.notes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    hours_of_operation: {
                      ...prev.hours_of_operation,
                      notes: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="24/7 emergency service available, etc."
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Social Media & Online Presence</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="url"
                  value={formData.social_media.website}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social_media: { ...prev.social_media, website: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={formData.social_media.facebook}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social_media: { ...prev.social_media, facebook: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://facebook.com/yourcompany"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="text"
                  value={formData.social_media.instagram}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social_media: { ...prev.social_media, instagram: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="@yourcompany or https://instagram.com/yourcompany"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={formData.social_media.linkedin}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social_media: { ...prev.social_media, linkedin: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter/X</label>
                <input
                  type="text"
                  value={formData.social_media.twitter}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    social_media: { ...prev.social_media, twitter: e.target.value }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="@yourcompany or https://twitter.com/yourcompany"
                />
              </div>
            </div>
          </div>

          {/* Save Button (Bottom) */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 text-lg font-semibold"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
