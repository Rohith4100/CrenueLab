"use client"
import Results from "../../../components/pathalogist-result"
import ProtectedRoute from "../../../components/protectedRoute"
export default function PendingOrders(){
  return(
  <ProtectedRoute role="Pathologist">
    <Results
    status="Rejected"
    head="Rejected List"
    />
  </ProtectedRoute>
  );
}