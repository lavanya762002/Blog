"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function PostForm({ isEdit = false }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [post, setPost] = useState({
    title: "",
    description: "",
    isPublic: true,
    image: ""
  });

  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    async function fetchPost() {
      if (!isEdit || !id) return;

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`;
      console.log("Fetching post from:", apiUrl);

      try {
        const res = await fetch(apiUrl);

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API returned error:", res.status, errorText);
          throw new Error(`Failed to fetch post (status ${res.status})`);
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error("Error loading post:", err);
        alert("Failed to load post. Please check the console for more details.");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resUser = await fetch("/api/me");
      const dataUser = await resUser.json();
      const userId = dataUser?.user?.id;

      if (!userId) throw new Error("User not logged in");

      const payload = {
        ...post,
        userId,
      };

      const endpoint = isEdit
        ? `${process.env.NEXT_PUBLIC_API_URL}/posts/${id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/posts`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save post");
      }

      const data = await res.json();
      router.push(`/post/${data._id}`);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        {isEdit ? "Edit Post" : "Create New Blog Post"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={post.title}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={post.description}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Description"
          rows={6}
          required
        />
        <input
          type="text"
          name="image"
          value={post.image}
          onChange={handleChange}
          className="w-full border p-2"
          placeholder="Paste image URL here"
        />
        <label className="block">
          <input
            type="checkbox"
            name="isPublic"
            checked={post.isPublic}
            onChange={handleChange}
            className="mr-2"
          />
          Public
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isEdit ? "Save Changes" : "Create Post"}
        </button>
      </form>
    </main>
  );
}
