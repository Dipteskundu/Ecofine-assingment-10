import React, { useState, useEffect } from 'react';
import { Download, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../Firebase/firebase.config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function MyContribution() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalContributed, setTotalContributed] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'My Contributions | EcoFine';
  }, []);

  // Fetch user's contributions from Firestore
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribe = null;
    let timeoutId = null;

    try {
      // Try Firestore first
      const contributionsRef = collection(db, 'contributions');
      const q = query(contributionsRef, where('userId', '==', user.uid));

      let hasReceivedData = false;

      // Set timeout to prevent infinite loading
      timeoutId = setTimeout(() => {
        if (!hasReceivedData && isMounted) {
          console.log('Firestore timeout, showing empty state');
          setContributions([]);
          setTotalContributed(0);
          setLoading(false);
        }
      }, 3000);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          hasReceivedData = true;
          if (timeoutId) clearTimeout(timeoutId);
          
          if (!isMounted) return;

          const contributionsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // Sort by date (newest first)
          contributionsData.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB - dateA;
          });
          
          setContributions(contributionsData);
          
          // Calculate total contributed
          const total = contributionsData.reduce((sum, contribution) => {
            return sum + (contribution.amount || 0);
          }, 0);
          setTotalContributed(total);
          setLoading(false);
        },
        (error) => {
          hasReceivedData = true;
          if (timeoutId) clearTimeout(timeoutId);
          
          console.error('Error fetching contributions:', error);
          if (isMounted) {
            // On error, just show empty state
            setContributions([]);
            setTotalContributed(0);
            setLoading(false);
            // Don't show error toast for empty results or permission errors
            if (error.code && error.code !== 'permission-denied') {
              console.log('Firestore query failed:', error.message);
            }
          }
        }
      );
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('Error setting up contributions listener:', error);
      if (isMounted) {
        setContributions([]);
        setTotalContributed(0);
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  // Download report as CSV
  const handleDownloadReport = () => {
    if (contributions.length === 0) {
      toast.error('No contributions to download');
      return;
    }

    // Create CSV content
    const headers = ['Issue Title', 'Category', 'Paid Amount', 'Date', 'Email', 'Phone', 'Address'];
    const rows = contributions.map((contribution) => [
      contribution.issueTitle || 'N/A',
      contribution.category || 'N/A',
      `$${contribution.amount?.toFixed(2) || '0.00'}`,
      contribution.date || new Date(contribution.createdAt).toLocaleDateString(),
      contribution.email || 'N/A',
      contribution.phone || 'N/A',
      contribution.address || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `my-contributions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Report downloaded successfully!');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your contributions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Contributions
          </h1>
          <p className="text-gray-600 text-lg">
              View all your cleanup contribution payments
            </p>
          </div>
          {contributions.length > 0 && (
            <button
              onClick={handleDownloadReport}
              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          )}
        </div>

        {/* Summary Card */}
        {contributions.length > 0 && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Contributions</p>
                <p className="text-3xl font-bold">${totalContributed.toFixed(2)}</p>
                <p className="text-green-100 text-sm mt-1">
                  {contributions.length} contribution{contributions.length > 1 ? 's' : ''}
                </p>
              </div>
              <DollarSign className="w-16 h-16 text-white opacity-20" />
            </div>
          </div>
        )}

        {contributions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-2">You haven't made any contributions yet.</p>
            <p className="text-gray-400">Start contributing to issues to help your community!</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Paid Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contributions.map((contribution) => (
                    <tr key={contribution.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div className="text-sm font-medium text-gray-900">
                            {contribution.issueTitle || 'N/A'}
          </div>
        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {contribution.category ? (
                          <span className={`${getCategoryColor(contribution.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                            {contribution.category}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">
                          ${contribution.amount?.toFixed(2) || '0.00'}
                    </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          {contribution.date || new Date(contribution.createdAt).toLocaleDateString()}
                  </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900" colSpan="2">
                      Total Contributed:
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">
                      ${totalContributed.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
