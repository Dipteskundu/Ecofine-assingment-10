import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { authFetch } from '../utils/apiClient';

export default function AllIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'All Issues | EcoFine';
  }, []);

  useEffect(() => {
    // Fetch issues from server API
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const res = await authFetch('/issues');
        if (!res.ok) {
          throw new Error(`Failed to fetch issues: ${res.status}`);
        }
        const data = await res.json();
        // Sort by date (newest first) if date exists
        const sorted = Array.isArray(data)
          ? data.sort((a, b) => new Date(b?.date || 0) - new Date(a?.date || 0))
          : [];
        setIssues(sorted);
      } catch (err) {
        console.error('Error fetching issues:', err);
        toast.error('Failed to load issues from server.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleSeeDetails = (issue) => {
    const issueId = issue?._id || issue?.id;
    if (!issueId) {
      toast.error('Invalid issue id');
      return;
    }
    if (user) {
      navigate(`/issue-details/${issueId}`);
    } else {
      navigate('/login', {
        state: {
          from: {
            pathname: `/issue-details/${issueId}`
          }
        }
      });
    }
  };

  const getCategoryColor = (category) => {
    const categoryMap = {
      'Garbage': 'bg-red-500',
      'Illegal Construction': 'bg-orange-500',
      'Broken Public Property': 'bg-yellow-500',
      'Road Damage': 'bg-blue-500',
      'Water Issues': 'bg-cyan-500',
      'Waste Management': 'bg-red-500',
      'Tree Plantation': 'bg-green-500',
      'Infrastructure': 'bg-yellow-500'
    };
    return categoryMap[category] || 'bg-gray-500';
  };

  const filteredIssues = issues
    .filter((issue) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return [issue.title, issue.category, issue.location, issue.description]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    })
    .sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b?.date || 0) - new Date(a?.date || 0);
      if (sortBy === 'date_asc') return new Date(a?.date || 0) - new Date(b?.date || 0);
      if (sortBy === 'title_asc') return String(a.title || '').localeCompare(String(b.title || ''));
      if (sortBy === 'title_desc') return String(b.title || '').localeCompare(String(a.title || ''));
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Issues
          </h1>
          <p className="text-gray-600 text-lg">
            Browse all issues reported by our community
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues"
            className="w-full sm:w-2/3 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-1/3 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="date_desc">Sort by: Newest</option>
            <option value="date_asc">Sort by: Oldest</option>
            <option value="title_asc">Title A→Z</option>
            <option value="title_desc">Title Z→A</option>
          </select>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading issues...</p>
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No issues found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map((issue, index) => (
              <div
                key={issue._id || index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`${getCategoryColor(issue.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {issue.category}
                    </span>
                    <span className="text-gray-500 text-sm">{issue.date}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {issue.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {issue.description}
                  </p>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <span>📍 {issue.location}</span>
                  </div>
                  <button
                    onClick={() => handleSeeDetails(issue)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>See Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


