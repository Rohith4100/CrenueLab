"use client";

import ProtectedRoute from "../../../components/protectedRoute"; 
import ManageOrders from "@/components/manage-orders";

export default function CreateOrderPage() {
  return (
    <ProtectedRoute role="Administrator">
      <ManageOrders />
    </ProtectedRoute>
  );
}