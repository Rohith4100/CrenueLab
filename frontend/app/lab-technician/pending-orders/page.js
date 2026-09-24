"use client";

import ProtectedRoute from "../../../components/protectedRoute";
import PendingOrders from "@/components/pending-orders";

export default function PendingOrdersPage() {
  return (
    <ProtectedRoute role="Lab Technician">
      <PendingOrders />
    </ProtectedRoute>
  );
}