import React, { useState, useEffect } from 'react';
import { Heart, Users, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function MyContribution() {
  const [stats, setStats] = useState({
    issuesReported: 0,
    issuesResolved: 0,
    issuesPending: 0,
    contributions: []
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Fetch issues from JSON file and calculate user contributions
      fetch('/issues.json')
        .then(res => res.json())
        .then(data => {
          // Filter issues by current user's email
          const userIssues = data.filter(issue => issue.email === user.email);
          
          // Calculate stats
          const resolved = userIssues.filter(issue => issue.status === 'resolved').length;
          const pending = userIssues.filter(issue => issue.status === 'ongoing' || issue.status === 'pending').length;
          
          setStats({
            issuesReported: userIssues.length,
            issuesResolved: resolved,
            issuesPending: pending,
            contributions: userIssues
          });
        })
        .catch(err => console.error('Error fetching issues:', err));
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My Contribution
          </h1>
          <p className="text-gray-600 text-lg">
            Track your contributions to the community
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.issuesReported}</h3>
            <p className="text-gray-600">Issues Reported</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.issuesResolved}</h3>
            <p className="text-gray-600">Issues Resolved</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.issuesPending}</h3>
            <p className="text-gray-600">Issues Pending</p>
          </div>
        </div>

        {/* Contribution Message */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-8 text-center text-white mb-8">
          <Heart className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Thank You for Your Contribution!
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your efforts are making a difference in our community. Keep up the great work!
          </p>
        </div>

        {/* Recent Contributions */}
        {stats.contributions.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Contributions</h2>
            <div className="space-y-4">
              {stats.contributions.slice(0, 5).map((contribution, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{contribution.title}</h3>
                      <p className="text-sm text-gray-600">{contribution.location}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      contribution.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {contribution.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-500 text-lg mb-4">You haven't made any contributions yet.</p>
            <p className="text-gray-400">Start by reporting an issue to contribute to the community!</p>
          </div>
        )}
      </div>
    </div>
  );
}


