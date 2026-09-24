
"use client";

import DashboardLayout from "@/components/TopBarLayout";
import TopBar from "@/components/topbar";

export default function PhysicianLayout({
  children,
}) {
  return (
    <DashboardLayout>
      {/* <TopBar /> */}
      {children}
    </DashboardLayout>
  );
}