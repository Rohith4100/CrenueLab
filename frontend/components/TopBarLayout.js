"use client";

import TopBar from "./topbar";

export default function DashboardLayout({
  children,
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
      }}
    >
      <TopBar />

      <main
        style={{
          padding: "24px",
        }}
      >
        {children}
      </main>
    </div>
  );
}