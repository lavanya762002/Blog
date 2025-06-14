"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const resUser = await fetch("/api/me");
      const dataUser = await resUser.json();

      if (dataUser.user) {
        setUser(dataUser.user);
      } else {
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  if (!user) return <p className="p-4">Please login to view profile.</p>;

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </main>
  );
}
