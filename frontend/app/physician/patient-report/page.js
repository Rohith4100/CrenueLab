import PatientReports from "@/components/patient-report";
import ProtectedRoute from "../../../components/protectedRoute";
export default function Page() {
  return (
    <ProtectedRoute role="Physician">
        <PatientReports />
    </ProtectedRoute>
  
  )
}