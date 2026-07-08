"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import CalendarGrid from "../../components/Calendar/CalendarGrid";

export default function AdminPage() {
  const { role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role !== "admin") {
      router.push("/login");
    }
  }, [role, loading, router]);

  if (loading || role !== "admin") {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return <CalendarGrid />;
}
