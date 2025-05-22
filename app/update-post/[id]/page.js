"use client";
 
import { useParams } from "next/navigation";
import PostForm from "@/components/PostForm";
 
export default function EditPostPage() {
  const { id } = useParams();
  return <PostForm postId={id} isEdit={true} />;
}
 

