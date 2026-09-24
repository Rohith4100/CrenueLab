"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  role,
  children,
}) {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const userRole =
      localStorage.getItem("role");

    if (!token || userRole !== role) {
      router.push("/login");
    }
  }, []);

  return children;
}