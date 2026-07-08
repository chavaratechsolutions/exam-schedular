"use client";

import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { User, Lock } from "lucide-react";
import carmelBg from "../../../images/carmel.JPG";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    return (
      <div className="flex h-screen items-center justify-center bg-[#BBC2C9]">
        <div className="text-[#EF4444] font-bold animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#BBC2C9] p-4 font-sans antialiased">

      {/* Main Card Container */}
      <div className="relative w-[75vw] h-[75vh] bg-white rounded-[24px] shadow-2xl overflow-hidden flex">

        {/* Abstract Blue Circles Background (Left Side) */}
        {/* 1. Largest background circle with the Carmel image */}
        <div className="absolute -top-[30%] -left-[15%] w-[65%] h-[160%] rounded-[100%] md:block hidden overflow-hidden">
          <div
            className="absolute inset-[-20px] bg-cover bg-center blur-sm"
            style={{ backgroundImage: `url(${carmelBg.src})` }}
          />
          <div className="absolute inset-0 rounded-[100%] shadow-[inset_-15px_-15px_40px_rgba(0,0,0,0.5)] pointer-events-none" />
        </div>



        {/* 4. Bottom-right small decorative circle */}
        <div className="absolute -bottom-16 -right-12 w-40 h-40 rounded-full bg-gradient-to-tl from-[#EF4444] to-[#DC2626] shadow-inner" />

        {/* Left Content (Text) */}
        <div className="absolute top-0 left-0 w-1/2 h-full z-10 hidden md:flex flex-col justify-center items-center p-12">
          <div className="text-center -mt-10 mr-12">
            <h1 className="text-5xl font-black tracking-widest text-white uppercase mb-2 drop-shadow-md">Welcome</h1>
            <h2 className="text-sm font-bold tracking-widest text-white uppercase mb-6 drop-shadow-sm">Exam Scheduler</h2>
            <p className="text-[11px] font-medium leading-relaxed text-red-50 max-w-[320px] text-center mx-auto drop-shadow-sm">
              Web application for efficiently scheduling, managing, and organizing system examinations across multiple dates using an interactive calendar interface.
            </p>
          </div>
        </div>

        {/* Right Content (Form) */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-20 flex flex-col justify-center items-center p-8 sm:p-12">
          <div className="w-full max-w-[400px]">

            {/* Form Header */}
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-gray-800 tracking-tight mb-2">Sign in</h2>
              <p className="text-xs font-semibold text-gray-400">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-[8px] bg-red-50 p-4 text-[13px] font-bold text-[#EF4444] border border-red-100 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">

              {/* Username Input */}
              <div className="flex items-center rounded-lg bg-[#F4F5F7] px-4 py-4 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all">
                <User className="h-5 w-5 text-gray-800 shrink-0" strokeWidth={2.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-4 w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="User Name"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="flex items-center rounded-lg bg-[#F4F5F7] px-4 py-4 focus-within:bg-white focus-within:ring-1 focus-within:ring-gray-300 transition-all">
                <Lock className="h-5 w-5 text-gray-800 shrink-0" strokeWidth={2.5} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-4 w-full bg-transparent text-sm font-bold text-gray-800 placeholder-gray-400 focus:outline-none"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-xs font-bold text-[#DC2626] hover:text-[#EF4444] focus:outline-none shrink-0 uppercase tracking-wide"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Sign In Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#EF4444] py-4 text-base font-bold tracking-wide text-white shadow-md hover:bg-[#DC2626] focus:outline-none disabled:opacity-50 transition-all mt-4"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
