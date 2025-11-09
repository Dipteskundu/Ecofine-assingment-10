import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, Calendar, User, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ContributionModal from '../components/ContributionModal';
import { db } from '../Firebase/firebase.config';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function IssueDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const issue = location.state?.issue;
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (issue) {
      document.title = `${issue.title} | Issue Details | EcoFine`;
    } else {
      document.title = 'Issue Details | EcoFine';
    }
  }, [issue]);

  // Fetch contributions for this issue
  useEffect(() => {
    if (!issue) return;

    const issueId = issue.title; // Using title as identifier
    const contributionsRef = collection(db, 'contributions');
    
    // Try to fetch with orderBy, fallback to without if index doesn't exist
    const q = query(
      contributionsRef,
      where('issueId', '==', issueId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const contributionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort by createdAt in descending order (newest first)
        contributionsData.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.timestamp || 0);
          const dateB = new Date(b.createdAt || b.timestamp || 0);
          return dateB - dateA;
        });
        setContributions(contributionsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching contributions:', error);
        setLoading(false);
        // If there's an error, set empty array instead of crashing
        setContributions([]);
      }
    );

    return () => unsubscribe();
  }, [issue]);

  // Calculate total collected amount
  const totalCollected = contributions.reduce((sum, contribution) => sum + (contribution.amount || 0), 0);
  const targetAmount = issue?.amount || 0;
  const progressPercentage = targetAmount > 0 ? Math.min((totalCollected / targetAmount) * 100, 100) : 0;

  // Handle contribution submission
  const handleContributionSubmit = async (contributionData) => {
    try {
      await addDoc(collection(db, 'contributions'), {
        ...contributionData,
        category: issue?.category || '', // Include category from issue
        userId: user?.uid || '',
        userPhotoURL: user?.photoURL || '',
        createdAt: new Date().toISOString()
      });
      toast.success('Contribution submitted successfully!');
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast.error('Failed to submit contribution. Please try again.');
      throw error;
    }
  };

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Issue not found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 overflow-hidden">
            <img
              src={issue.image}
              alt={issue.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
              }}
            />
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                {issue.category}
              </span>
              <span className="text-gray-500 text-sm flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{issue.date}</span>
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {issue.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-6 space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{issue.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{issue.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>${issue.amount} (Suggested Budget)</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Fundraising Progress</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  ${totalCollected.toFixed(2)} / ${targetAmount.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {progressPercentage.toFixed(1)}% of goal reached
              </p>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {issue.description}
              </p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Pay Clean-Up Contribution
              </button>
            </div>
          </div>
        </div>

        {/* Contributors Table Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Contributors</h2>
            </div>
            <p className="text-gray-600">
              {contributions.length > 0 
                ? `${contributions.length} contributor${contributions.length > 1 ? 's' : ''} have contributed to this issue`
                : 'No contributions yet. Be the first to contribute!'
              }
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading contributions...</p>
            </div>
          ) : contributions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contributor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contributions.map((contribution) => (
                    <tr key={contribution.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {contribution.userPhotoURL ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={contribution.userPhotoURL}
                                alt={contribution.contributorName}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(contribution.contributorName)}&background=10b981&color=fff`;
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                                {contribution.contributorName?.charAt(0).toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {contribution.contributorName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {contribution.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">
                          ${contribution.amount?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contribution.date || new Date(contribution.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan="2">
                      Total Collected:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      ${totalCollected.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No contributions yet. Be the first to contribute!</p>
            </div>
          )}
        </div>
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        issue={issue}
        onSubmit={handleContributionSubmit}
        user={user}
      />
    </div>
  );
}

