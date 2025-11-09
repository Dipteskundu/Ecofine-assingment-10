import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../Firebase/firebase.config';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import UpdateIssueModal from '../components/UpdateIssueModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import toast from 'react-hot-toast';

export default function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'My Issues | EcoFine';
  }, []);

  // Fetch issues from Firestore with fallback to JSON
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribe = null;
    let timeoutId = null;

    // Fallback to JSON file
    const loadFromJSON = async () => {
      try {
        const response = await fetch('/issues.json');
        const data = await response.json();
        // Filter by user email
          const userIssues = data.filter(issue => issue.email === user.email);
        // Add mock IDs for JSON data
        const issuesWithIds = userIssues.map((issue, index) => ({
          id: `json-${index}-${Date.now()}`,
          ...issue,
          status: issue.status || 'ongoing'
        }));
          // Sort by date (newest first)
        issuesWithIds.sort((a, b) => {
          const dateA = new Date(a.date || 0);
          const dateB = new Date(b.date || 0);
          return dateB - dateA;
        });
        if (isMounted) {
          setIssues(issuesWithIds);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading from JSON:', error);
        if (isMounted) {
          setLoading(false);
          setIssues([]);
        }
      }
    };

    try {
      // Try Firestore first
      const issuesRef = collection(db, 'issues');
      const q = query(issuesRef, where('email', '==', user.email));

      let hasReceivedData = false;

      // Set timeout to prevent infinite loading (fallback to JSON after 3 seconds)
      timeoutId = setTimeout(() => {
        if (!hasReceivedData && isMounted) {
          console.log('Firestore timeout, loading from JSON');
          if (unsubscribe) unsubscribe();
          loadFromJSON();
        }
      }, 3000);

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          hasReceivedData = true;
          if (timeoutId) clearTimeout(timeoutId);
          
          if (!isMounted) return;
          
          const issuesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          
          // If Firestore has data, use it
          if (issuesData.length > 0) {
            issuesData.sort((a, b) => {
              const dateA = new Date(a.date || a.createdAt || 0);
              const dateB = new Date(b.date || b.createdAt || 0);
              return dateB - dateA;
            });
            setIssues(issuesData);
            setLoading(false);
          } else {
            // If Firestore is empty, try JSON fallback for demo data
            // This helps users see the page working even if they haven't created issues yet
            if (isMounted) {
              loadFromJSON();
            }
          }
        },
        (error) => {
          hasReceivedData = true;
          if (timeoutId) clearTimeout(timeoutId);
          
          console.error('Firestore error:', error);
          // On error, try JSON fallback
          if (isMounted) {
            loadFromJSON();
          }
        }
      );
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      console.error('Error setting up Firestore listener:', error);
      if (isMounted) {
        loadFromJSON();
      }
    }

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [user]);

  const handleUpdate = (issue) => {
    setSelectedIssue(issue);
    setUpdateModalOpen(true);
  };

  const handleDelete = (issue) => {
    setSelectedIssue(issue);
    setDeleteModalOpen(true);
  };

  const handleUpdateSubmit = async (updatedData) => {
    try {
      // Check if it's a Firestore document (starts with firestore ID pattern) or JSON data
      if (selectedIssue.id && !selectedIssue.id.startsWith('json-')) {
        const issueRef = doc(db, 'issues', selectedIssue.id);
        await updateDoc(issueRef, {
          ...updatedData,
          updatedAt: new Date().toISOString()
        });
        toast.success('Issue updated successfully!');
      } else {
        // For JSON data, just update local state
        setIssues(prevIssues => 
          prevIssues.map(issue => 
            issue.id === selectedIssue.id 
              ? { ...issue, ...updatedData }
              : issue
          )
        );
        toast.success('Issue updated successfully! (Note: JSON data changes are temporary)');
      }
      setUpdateModalOpen(false);
      setSelectedIssue(null);
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue. Please try again.');
      throw error;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      // Check if it's a Firestore document or JSON data
      if (selectedIssue.id && !selectedIssue.id.startsWith('json-')) {
        const issueRef = doc(db, 'issues', selectedIssue.id);
        await deleteDoc(issueRef);
        toast.success('Issue deleted successfully!');
      } else {
        // For JSON data, just update local state
        setIssues(prevIssues => 
          prevIssues.filter(issue => issue.id !== selectedIssue.id)
        );
        toast.success('Issue deleted successfully! (Note: JSON data changes are temporary)');
      }
      setDeleteModalOpen(false);
      setSelectedIssue(null);
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast.error('Failed to delete issue. Please try again.');
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

  const getStatusBadge = (status) => {
    if (status === 'ongoing') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Ongoing
        </span>
      );
    } else if (status === 'ended') {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Ended
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        {status || 'Ongoing'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your issues...</p>
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
            My Issues
          </h1>
          <p className="text-gray-600 text-lg">
              Manage all issues you have reported
            </p>
          </div>
          <button
            onClick={() => navigate('/addIssues')}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Issue</span>
          </button>
        </div>
        
        {issues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">You haven't reported any issues yet.</p>
            <button
              onClick={() => navigate('/addIssues')}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Add New Issue
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {issues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {issue.image && (
                            <img
                              className="h-12 w-12 rounded-lg object-cover mr-4"
                    src={issue.image}
                    alt={issue.title}
                    onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {issue.title}
                            </div>
                            <div className="text-sm text-gray-500 line-clamp-1">
                              {issue.description}
                            </div>
                          </div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`${getCategoryColor(issue.category)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                      {issue.category}
                    </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${issue.amount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(issue.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {issue.date || new Date(issue.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => navigate('/issue-details', { state: { issue } })}
                            className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleUpdate(issue)}
                            className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors"
                            title="Update Issue"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                  <button
                            onClick={() => handleDelete(issue)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete Issue"
                  >
                            <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <UpdateIssueModal
        isOpen={updateModalOpen}
        onClose={() => {
          setUpdateModalOpen(false);
          setSelectedIssue(null);
        }}
        issue={selectedIssue}
        onUpdate={handleUpdateSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedIssue(null);
        }}
        onConfirm={handleDeleteConfirm}
        itemName={selectedIssue?.title || 'this issue'}
        loading={false}
      />
    </div>
  );
}
