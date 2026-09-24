"use client";

import ManageCatalog from "@/components/manage-catalog";
import ProtectedRoute from "../../../components/protectedRoute";

export default function AdminCatalog() {

  return (
    <ProtectedRoute role="Administrator">
      <ManageCatalog />
    </ProtectedRoute>
  );
}