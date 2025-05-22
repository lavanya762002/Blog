"use client";
 
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
 
export default function Post() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
 
  const [post, setPost] = useState(null);
 
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    }
 
    if (id) fetchPost();
  }, [id]);
 
 
  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;
 
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
        method: "DELETE",
      });
 
      if (!res.ok) throw new Error("Failed to delete post");
 
      alert("Post deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };
 
  // ✅ Update Handler
  const handleUpdate = () => {
    router.push(`/update-post/${id}`);
  };
 
  return (
    <>
      {post && (
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <h2 className="text-4xl font-bold">{post.title}</h2>
            <div className="ml-auto space-x-2">
              <Button onClick={handleUpdate}>Update</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </div>
          </div>
 
          <p className="text-gray-500">
            Published on {new Date(post.createdAt).toDateString()}
          </p>
 
          {post.image && (
            <img src={post.image} alt="Post Image" className="my-4" />
          )}
          <p>{post.description}</p>
        </main>
      )}
    </>
  );
}
 