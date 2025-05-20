"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Load user on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for user changes (login/register/logout)
    const handleUserChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("userChanged", handleUserChange);

    return () => {
      window.removeEventListener("userChanged", handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userChanged")); // Trigger header re-render
    router.push("/"); // Redirect using Next.js router
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
