import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { DollarSign, Calendar, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { authFetch } from '../utils/apiClient';

export default function MyContribution() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await authFetch('/my-contribution', {}, true);
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            toast.error('Please log in');
            return;
          }
          throw new Error('Failed to load contributions');
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.result || []);
        const mine = list.filter((c) => c.email === user?.email);
        mine.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        if (active) setContributions(mine);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load contributions');
      } finally {
        if (active) setLoading(false);
      }
    };
    if (user) load(); else setLoading(false);
    return () => { active = false; };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
        <p className="text-gray-600">Login required to view your contributions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-2xl mb-10">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-emerald-500/20"></div>
          <img
            src="https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?q=80&w=1600&auto=format&fit=crop"
            alt="Community action"
            className="w-full h-56 object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 flex items-center">
            <div className="px-8">
              <div className="flex items-center space-x-3 mb-2 text-green-600">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-semibold">Eco-Modernist</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Contributions</h1>
              <p className="mt-2 text-gray-700 dark:text-gray-300">Only your own contributions are listed.</p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contributions"
            className="w-full sm:w-2/3 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-1/3 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="date_desc">Sort by: Newest</option>
            <option value="date_asc">Sort by: Oldest</option>
            <option value="amount_desc">Amount High→Low</option>
            <option value="amount_asc">Amount Low→High</option>
            <option value="title_asc">Title A→Z</option>
            <option value="title_desc">Title Z→A</option>
          </select>
        </div>

        {/* Loading / Empty / Data Sections */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading contributions...</p>
          </div>
        ) : contributions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No contributions yet.</p>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">{contributions.length}</span> items
              </div>
              <div className="text-green-600 font-bold">
                ${contributions.reduce((s, c) => s + (Number(c.amount) || 0), 0).toFixed(2)} total
              </div>
            </div>

            {/* Contribution Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributions
                .filter((c) => {
                  const q = search.trim().toLowerCase();
                  if (!q) return true;
                  return [c.issueTitle, c.category]
                    .filter(Boolean)
                    .some((v) => String(v).toLowerCase().includes(q));
                })
                .sort((a, b) => {
                  if (sortBy === 'date_desc') return new Date(b?.date || 0) - new Date(a?.date || 0);
                  if (sortBy === 'date_asc') return new Date(a?.date || 0) - new Date(b?.date || 0);
                  if (sortBy === 'amount_desc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
                  if (sortBy === 'amount_asc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
                  if (sortBy === 'title_asc') return String(a.issueTitle || '').localeCompare(String(b.issueTitle || ''));
                  if (sortBy === 'title_desc') return String(b.issueTitle || '').localeCompare(String(a.issueTitle || ''));
                  return 0;
                })
                .map((c, idx) => {
                  const imageUrl =
                    c.image ||
                    c.imageUrl ||
                    `https://source.unsplash.com/600x400/?${encodeURIComponent(c.issueTitle || 'nature')}`;
                  return (
                    <div
                      key={c._id || idx}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition overflow-hidden"
                    >
                      <div className="h-36 overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={c.issueTitle || 'Contribution'}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Contribution'; }}
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 text-gray-500">
                            <FileText className="w-4 h-4" />
                            <span className="text-sm">{c.issueTitle}</span>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                            {c.category}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-green-600 font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span>${(Number(c.amount) || 0).toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {c.date ? new Date(c.date).toLocaleDateString() : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
