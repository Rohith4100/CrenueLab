import ManagePatients from "@/components/manage-patients";
import styles from "@/components/manage.module.css";
import ProtectedRoute from "../../../components/protectedRoute";
export default function AdminManagePatients() {
  return (
    <>
    <ProtectedRoute role="Administrator">
      <ManagePatients />
    </ProtectedRoute>
      
    </>
  );
}