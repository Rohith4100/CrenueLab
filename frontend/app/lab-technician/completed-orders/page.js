import CompletedOrders from "@/components/completed-orders";
import ProtectedRoute from "@/components/protectedRoute";
export default function Page() {
  return (
  <ProtectedRoute role="Lab Technician">
    <CompletedOrders />
  </ProtectedRoute>
  );
  
}