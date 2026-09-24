"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/SideBarLayout";
export default function ReceptionistLayout({
  children,
}) {
  const router = useRouter();

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    if (
      !token ||
      role !== "Receptionist"
    ) {
      router.push("/login");
    }
  }, [router]);

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}