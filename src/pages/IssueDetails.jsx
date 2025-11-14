import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ContributionModal from '../components/ContributionModal';
 
import toast from 'react-hot-toast';
import { authFetch, API_BASE } from '../utils/apiClient';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loadingIssue, setLoadingIssue] = useState(true);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  

  // Update document title
  useEffect(() => {
    document.title = issue ? `${issue.title} | Issue Details | EcoFine` : 'Issue Details | EcoFine';
  }, [issue]);

  // ✅ Fetch issue details by ID from backend
  useEffect(() => {
    let isMounted = true;
    const fetchIssue = async () => {
      try {
        if (!id) return;
        const res = await authFetch(`/issues/${id}`);
        if (!res.ok) throw new Error('Failed to fetch issue');
        const data = await res.json();
        if (isMounted) setIssue(data.result || data);
        console.log('Fetched issue:', data);
      } catch (err) {
        console.error('Error loading issue:', err);
        toast.error('Failed to load issue details');
      } finally {
        if (isMounted) setLoadingIssue(false);
      }
    };
    fetchIssue();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        if (!id) return;
        const res = await authFetch(`/my-contribution`, {}, true);
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            toast.error('Please log in again');
            navigate('/login');
            return;
          }
          throw new Error('Failed to load contributions');
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.result || []);
        const filtered = list.filter((c) => c.issueId === id);
        filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        if (active) {
          setContributions(filtered);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setLoading(false);
          setContributions([]);
        }
      }
    };
    load();
    return () => { active = false; };
  }, [id, navigate]);

  // ✅ Calculate total collected
  const totalCollected = contributions.reduce((sum, contribution) => sum + (Number(contribution.amount) || 0), 0);
  const targetAmount = issue?.amount || 0;
  const progressPercentage = targetAmount > 0 ? Math.min((totalCollected / targetAmount) * 100, 100) : 0;
  const isGoalReached = progressPercentage >= 100 || totalCollected >= targetAmount;

  // ✅ Handle contribution submission
  const handleContributionSubmit = async (contributionData) => {
    try {
      if (!user) {
        toast.error('Please log in to contribute');
        navigate('/login');
        return;
      }

      const payload = {
        email: user?.email || contributionData.email,
        issueId: id,
        issueTitle: issue?.title || '',
        category: issue?.category || '',
        amount: contributionData.amount,
        date: contributionData.date || new Date().toISOString(),
      };

      const res = await authFetch(`/my-contribution`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }, true);

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error('Please log in again');
          navigate('/login');
          return;
        }
        throw new Error('Failed to submit contribution');
      }

      const data = await res.json();
      if (data?.success === false) throw new Error(data?.message || 'Failed to submit contribution');

      toast.success('Contribution submitted successfully!');
    } catch (error) {
      console.error('Error submitting contribution:', error);
      toast.error(error.message || 'Failed to submit contribution. Please try again.');
      throw error;
    }
  };

  if (loadingIssue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading issue details...</p>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Issue Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-96 overflow-hidden">
            <img
              src={issue.image}
              alt={issue.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/800x400?text=No+Image'; }}
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

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{issue.title}</h1>

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
                  {isGoalReached && (
                    <span className="ml-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Badget is Reached</span>
                  )}
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
              <p className="text-xs text-gray-500">{progressPercentage.toFixed(1)}% of goal reached</p>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{issue.description}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isGoalReached}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${isGoalReached ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
              >
                Pay Clean-Up Contribution
              </button>
            </div>
          </div>
        </div>

        {/* Contributors Section */}
        <div className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900">Contributors</h2>
            </div>
            <p className="text-gray-600">
              {contributions.length > 0
                ? `${contributions.length} contributor${contributions.length > 1 ? 's' : ''} have contributed to this issue`
                : 'No contributions yet. Be the first to contribute!'}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contributor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
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
                            <div className="text-sm font-medium text-gray-900">{contribution.contributorName}</div>
                            <div className="text-sm text-gray-500">{contribution.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">${contribution.amount?.toFixed(2) || '0.00'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contribution.date || new Date(contribution.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan="2">Total Collected:</td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">${totalCollected.toFixed(2)}</td>
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


