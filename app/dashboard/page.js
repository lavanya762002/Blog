"use client";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUserAndBlogs() {
      try {
        
        const resUser = await fetch("/api/me");
        const dataUser = await resUser.json();

        if (!dataUser.user) {
          setUser(null);
          setLoading(false);
          return; 
        }

        setUser(dataUser.user);

       
        const resBlogs = await fetch(`/api/user-blogs?userId=${dataUser.user.id}`);
        const dataBlogs = await resBlogs.json();

        setBlogs(dataBlogs);
        setLoading(false);
      } catch (error) {
        setUser(null);
        setLoading(false);
      }
    }

    fetchUserAndBlogs();
  }, []);

  if (loading) return <p>Loading your blogs...</p>;

  if (!user) return <p>Please log in to view your dashboard.</p>;

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
