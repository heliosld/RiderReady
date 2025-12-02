'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

interface IssueTag {
  id: string;
  name: string;
  category: string;
  description: string;
}

interface IssueReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  endorsementId: string;
  categoryName: string;
  onReportSuccess: () => void;
}

export default function IssueReportModal({
  isOpen,
  onClose,
  endorsementId,
  categoryName,
  onReportSuccess
}: IssueReportModalProps) {
  const [tags, setTags] = useState<IssueTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen]);

  const fetchTags = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/v1/endorsement-issues/tags');
      setTags(res.data.tags);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load issue options');
    }
  };

  const handleSubmit = async () => {
    if (!selectedTag) {
      setError('Please select an issue type');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sessionId = localStorage.getItem('session-id');
      await axios.post('http://localhost:3001/api/v1/endorsement-issues/report', {
        endorsement_id: endorsementId,
        issue_tag_id: selectedTag,
        session_id: sessionId
      });

      onReportSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error reporting issue:', err);
      setError(err.response?.data?.error || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // Group tags by category
  const groupedTags = tags.reduce((acc: any, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  const categoryLabels: any = {
    mechanical: '⚙️ Mechanical',
    electrical: '⚡ Electrical',
    software: '💻 Software/Firmware',
    thermal: '🔥 Thermal',
    optical: '🔍 Optical',
    other: '📋 Other'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Report Issue: {categoryName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-6">
            Help others by specifying what went wrong. Select the most specific issue that matches your experience:
          </p>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {Object.keys(groupedTags).map((category) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-400 mb-2">
                  {categoryLabels[category] || category}
                </h3>
                <div className="space-y-2">
                  {groupedTags[category].map((tag: IssueTag) => (
                    <label
                      key={tag.id}
                      className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedTag === tag.id
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="issue"
                        value={tag.id}
                        checked={selectedTag === tag.id}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <div className="text-white font-medium">{tag.name}</div>
                        {tag.description && (
                          <div className="text-sm text-gray-400 mt-1">{tag.description}</div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !selectedTag}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-700 disabled:text-gray-500 text-white font-medium rounded-lg transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
