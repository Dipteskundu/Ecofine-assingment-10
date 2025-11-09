import React, { useState, useEffect } from "react";

const AddIssues = () => {
  // simulate a logged-in user (replace with your auth state)
  const [user, setUser] = useState({ email: "user@example.com" });

  const [issue, setIssue] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    image: "",
    amount: "",
    status: "ongoing",
    date: new Date(),
    email: user.email,
  });

  const categories = ["Pollution", "Waste Management", "Tree Plantation", "Water Issues"];

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssue({ ...issue, [name]: value });
  };

  // handle image upload (if using file input)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIssue({ ...issue, image: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("New Issue Submitted:", issue);

    // TODO: Send data to backend or Firebase
    // fetch('/api/issues', { method: 'POST', body: JSON.stringify(issue) })
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

          {/* Image */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
            {issue.image && (
              <img
                src={issue.image}
                alt="Preview"
                className="mt-3 h-32 w-32 object-cover rounded-lg border"
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

          {/* Status & Email (readonly) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                name="status"
                value={issue.status}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                User Email
              </label>
              <input
                type="email"
                name="email"
                value={issue.email}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Submit Issue
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddIssues;
