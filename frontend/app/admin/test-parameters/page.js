"use client";

import ProtectedRoute from "../../../components/protectedRoute";
import ManageTestParameters from "@/components/manage-test-parameters";

export default function TestParametersPage() {
  return (
    <ProtectedRoute role="Administrator">
      <ManageTestParameters />
    </ProtectedRoute>
  );
}