"use client";

import ProtectedRoute from "../../../components/protectedRoute"; 
import ManageOrders from "@/components/manage-orders";

export default function CreateOrderPage() {
  return (
    <ProtectedRoute role="Physician">
      <ManageOrders />
    </ProtectedRoute>
  );
}


// added comment to test the branch functionality