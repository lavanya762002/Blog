"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRole } from "../app/providers/RoleProvider";


export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { role } = useRole();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        if (res.status === 401) {
          setUser(null);
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
    }

    fetchUser();

    const handleUserChange = () => {
      fetchUser();
    };

    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  // Replace your `logout` function with this:
const logout = async () => {
  try {
    await signOut({ callbackUrl: "/" }); // Redirect after logout
    window.dispatchEvent(new Event("userChanged")); // Optional, if you want to refetch user
  } catch (error) {
    console.error("Logout error:", error.message);
  }
};

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">
            {user  ? `Hi, ${user.username}` : "Blogs"}
          </h1>
           {role === "admin" && (
        <p className="text-sm text-green-600 mt-1">👋 Hello Admin</p>
      )}
        </Link>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="text-blue-500 hover:underline">Home</Link>
          <Link href="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>

          {user ? (
            <>
              <span className="text-gray-700">Hi, {user.username}</span>
              <Link href="/profile" className="text-blue-500 hover:underline">Profile</Link>
              <button
                onClick={logout}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
              <Link href="/register" className="text-blue-500 hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
