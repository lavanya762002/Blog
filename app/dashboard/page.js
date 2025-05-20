// app/dashboard/page.js
"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const fetchBlogs = async () => {
      const res = await fetch(`/api/user-blogs?userId=${user._id}`);
      const data = await res.json();
      setBlogs(data);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  if (loading) return <p>Loading your blogs...</p>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Your Blog Posts</h2>

      {blogs.length === 0 ? (
        <p className="text-gray-600">You haven't posted anything yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="border p-4 mb-4 rounded shadow">
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="text-gray-700">{blog.content}</p>
            <span className="text-sm text-gray-500">
              {blog.isPublic ? "Public" : "Private"}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
