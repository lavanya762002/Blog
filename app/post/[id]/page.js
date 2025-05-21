"use client"

import { useParams, useRouter } from "next/navigation";

import { useEffect, useState } from "react"


export default function Post({params}) {
    const router = useRouter()
    const {id} = useParams();
    const [post,setPost] = useState(null);
    

    useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`)
    .then(res => res.json())
    .then(res => setPost(res));
}, [id]);



    return  <>
        {post &&  <main className="container mx-auto px-4 py-6">
        <h2 className="text-4xl font-bold mb-4">{post.title}</h2>
        <p className="text-gray-500">Published on January 1, 2022</p>
        <img src={post.image} alt="Post Image" className="my-4" />
        <p>{post.description}</p>
            </main>

        }
    </>
    
    
    
    

}