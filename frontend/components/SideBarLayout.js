"use client";

import Sidebar from "./Sidebar";

export default function DashboardLayout({
  children,
}) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          padding: "20px",
          width: "calc(100%-250px)",
          marginLeft: "250px",
          minWidth: 0
        }}
      >
        {children}
      </div>
    </div>
  );
}