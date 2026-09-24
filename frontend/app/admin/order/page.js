"use client";

import ProtectedRoute from "@/components/protectedRoute";
import AdminOrders from "@/components/admin-orders";

export default function OrdersPage() {
  return (
    <ProtectedRoute role="Administrator">
      <AdminOrders />
    </ProtectedRoute>
  );
}