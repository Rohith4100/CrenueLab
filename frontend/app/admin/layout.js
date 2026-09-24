"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardLayout from "@/components/SideBarLayout"
export default function AdminLayout({
  children,
}) {
   return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}