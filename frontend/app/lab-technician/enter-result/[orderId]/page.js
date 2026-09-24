

import ProtectedRoute from "../../../../components/protectedRoute";
import EnterResult from "@/components/enter-result";

export default async function Page({
  params,
}) {
  const { orderId } = await params;

  return (
    <ProtectedRoute role="Lab Technician">
      <EnterResult orderId={orderId} />
    </ProtectedRoute>
  );
}