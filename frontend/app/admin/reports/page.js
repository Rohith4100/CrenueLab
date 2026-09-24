"use client";

import ProtectedRoute from "@/components/protectedRoute";
import Reports from "@/components/test-reports";

export default function ReportsPage() {
  return (
    <ProtectedRoute role="Administrator">
      <Reports role="admin"/>
    </ProtectedRoute>
  );
}