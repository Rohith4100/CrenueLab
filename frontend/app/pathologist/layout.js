"use client";
import DashboardLayout from "@/components/SideBarLayout";
import { useRouter } from "next/navigation";
export default function PathologistLayout({ children }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    router.push("/login");
  };

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}