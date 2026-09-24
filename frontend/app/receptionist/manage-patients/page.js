import ManagePatients from "@/components/manage-patients";
import ProtectedRoute from "../../../components/protectedRoute";
export default function ReceptionistManagePatients() {
  return (
    <ProtectedRoute role="Receptionist">
      <ManagePatients />
    </ProtectedRoute>
  );
}