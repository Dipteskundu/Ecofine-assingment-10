import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
// Posting to server instead of Firestore
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const AddIssues = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Removed unfinished "handelSubmit" block and local POST; using the
  // validated handleSubmit function further below that posts to the server

  useEffect(() => {
    document.title = 'Add New Issue | EcoFine';
  }, []);

  const [issue, setIssue] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    image: "",
    amount: "",
    status: "ongoing",
    date: new Date().toISOString().split('T')[0],
    email: user?.email || "",
  });

  const categories = [
    'Garbage',
    'Illegal Construction',
    'Broken Public Property',
    'Road Damage',
    'Water Issues',
    'Waste Management',
    'Tree Plantation',
    'Infrastructure'
  ];

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssue({ ...issue, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to add an issue');
      navigate('/login');
      return;
    }

    // Validation
    if (!issue.title || !issue.category || !issue.location || !issue.description || !issue.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...issue,
        amount: parseFloat(issue.amount),
        email: user.email,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        status: issue.status || 'ongoing'
      };

      const res = await fetch('http://localhost:3000/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed to add issue: ${res.status}`);
      }

      const created = await res.json();
      toast.success('Issue added successfully!');
      // Reset form
      setIssue({
        title: "",
        category: "",
        location: "",
        description: "",
        image: "",
        amount: "",
        status: "ongoing",
        date: new Date().toISOString().split('T')[0],
        email: user.email,
      });
      // Navigate to My Issues page
      navigate('/my-issues');
    } catch (error) {
      console.error('Error adding issue:', error);
      toast.error('Failed to add issue on server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mt-30 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
          Add New Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Issue Title */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Issue Title
            </label>
            <input
              type="text"
              name="title"
              value={issue.title}
              onChange={handleChange}
              required
              placeholder="Enter issue title"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={issue.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={issue.location}
              onChange={handleChange}
              required
              placeholder="Enter issue location"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={issue.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the issue..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            ></textarea>
          </div>

          {/* Image URL */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={issue.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {issue.image && (
              <img
                src={issue.image}
                alt="Preview"
                className="mt-3 h-32 w-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Suggested Fix Budget (Amount)
            </label>
            <input
              type="number"
              name="amount"
              value={issue.amount}
              onChange={handleChange}
              required
              placeholder="Enter estimated amount"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          {/* Date & Email (readonly) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={issue.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                name="email"
                value={user?.email || ''}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Issue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIssues;
