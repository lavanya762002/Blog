"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const res = await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.message === "User registered") {
      alert("Registration successful. Please log in.");
      router.push("/login");
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input
        name="username"
        placeholder="Username"
        className="border p-2 w-full mb-4"
        value={form.username}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-4"
        value={form.email}
        onChange={handleChange}
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={form.password}
        onChange={handleChange}
      />
      <button onClick={handleRegister} className="bg-blue-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </div>
  );
}
