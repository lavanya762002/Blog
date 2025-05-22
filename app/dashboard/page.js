"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Fix: correct import
 
export default function DashboardPage() {
  const router = useRouter();  // useRouter hook
 
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
 
  const handleCreatePost = () => {
    router.push("/create-post");
  };
 
  if (loading) return <p>Loading your blogs...</p>;
  if (!user) return <p>Please log in to view your dashboard.</p>;
 
  return (
  <div className="max-w-2xl mx-auto py-10">
    <h2 className="text-2xl font-bold mb-4">Your Blog Posts</h2>
 
    {blogs.length === 0 ? (
      <div className="flex items-center justify-between gap-4">
        <p className="text-gray-600">You haven't posted anything yet.</p>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleCreatePost}
        >
          Post
        </button>
      </div>
    ) : (
      <>
        <div className="mb-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleCreatePost}
          >
            Create New Post
          </button>
        </div>
 
        <div className="grid grid-cols-1 gap-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="border border-gray-300 p-4 rounded">
              <h3 className="text-lg font-semibold">{blog.title}</h3>
              <p className="text-gray-600 mt-1">{blog.description}</p>
              {blog.image && (
                <img
                  src={blog.image}
                  alt="Blog Image"
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);
 
}