"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user && role && !authLoading) {
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }
  }, [user, role, authLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle redirect once role is fetched
    } catch (err: any) {
      setError(err.message || "Failed to login");
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-[#BBC2C9] font-sans antialiased p-4">
      <div className="w-full max-w-md rounded-[32px] md:rounded-[40px] bg-white p-8 md:p-12 shadow-2xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Exam Scheduler</h1>
          <p className="text-gray-500 font-medium mt-2">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 rounded-[16px] bg-red-50 p-4 text-sm font-bold text-[#EF4444] border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-[16px] bg-[#F5F6F8] px-4 py-3.5 text-gray-800 font-medium border-2 border-transparent focus:border-[#EF4444] focus:bg-white focus:outline-none transition-colors"
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 ml-1 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-[16px] bg-[#F5F6F8] px-4 py-3.5 text-gray-800 font-medium border-2 border-transparent focus:border-[#EF4444] focus:bg-white focus:outline-none transition-colors"
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#EF4444] px-6 py-4 text-sm font-bold text-white shadow-[0_4px_12px_-4px_rgba(239,68,68,0.6)] hover:bg-[#DC2626] transition-colors focus:outline-none focus:ring-2 focus:ring-[#EF4444] focus:ring-offset-2 disabled:opacity-50 mt-4"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
