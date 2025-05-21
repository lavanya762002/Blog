"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      }
    }

    fetchUser();

    // Listen for user changes (login/logout)
    const handleUserChange = () => {
      fetchUser();
    };

    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    // Clear cookie on server - you might want to create a /api/logout route
    // For now, just dispatch event and reload
    window.dispatchEvent(new Event("userChanged"));
    router.push("/");
  };

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold">{user ? `Hi, ${user.username}` : "My Blog"}</h1>
        </Link>

        <nav className="space-x-4 flex items-center">
          <Link href="/" className="text-blue-500 hover:underline">Home</Link>
          <Link href="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>

          {user ? (
            <>
              <span className="text-gray-700">Hi, {user.username}</span>
              <Link href="/profile" className="text-blue-500 hover:underline">Profile</Link>
              <button
                onClick={handleLogout}
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
