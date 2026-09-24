"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./topbar.module.css";

export default function TopBar() {
  const [role, setRole] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("user_id");

    router.push("/login");
  };

  const menus = {
    // Administrator: [
    //   {
    //     label: "Dashboard",
    //     path: "/admin",
    //   },
    //   {
    //     label: "Manage Staff",
    //     path: "/admin/manage-staff",
    //   },
    //   {
    //     label: "Manage Patients",
    //     path: "/admin/manage-patients",
    //   },
    //   {
    //     label: "Catalog",
    //     path: "/admin/catalog",
    //   },
    //   {
    //     label: "Parameters",
    //     path: "/admin/test-parameters",
    //   },
    //   {
    //     label: "Reports",
    //     path: "/admin/reports",
    //   },
    //   {
    //     label: "Orders",
    //     path: "/admin/order",
    //   },
    //   {
    //     label: "Patient Reports",
    //     path: "/admin/patient-reports",
    //   },
    // ],

    Receptionist: [
      {
        label: "Dashboard",
        path: "/receptionist",
      },
      {
        label: "Patients",
        path: "/receptionist/manage-patients",
      },
      // {
      //   label: "Create Order",
      //   path: "/receptionist/create-order",
      // },
      {
        label: "Patient Reports",
        path: "/receptionist/patient-reports",
      },
    ],

    Physician: [
      {
        label: "Dashboard",
        path: "/physician",
      },
      // {
      //   label: "Create Orders",
      //   path: "/physician/create-order",
      // },
      {
        label: "Test Reports",
        path: "/physician/reports",
      },
      {
        label: "Patient Reports",
        path: "/physician/patient-report",
      },
      
    ],

    // Pathologist: [
    //   {
    //     label: "Dashboard",
    //     path: "/pathologist",
    //   },
    //   {
    //     label: "Pending",
    //     path: "/pathologist/pending-results",
    //   },
    //   {
    //     label: "Verified",
    //     path: "/pathologist/verified-results",
    //   },
    //   {
    //     label: "Rejected",
    //     path: "/pathologist/rejected-results",
    //   },
    // ],

    "Lab Technician": [
      {
        label: "Dashboard",
        path: "/lab-technician",
      },
      {
        label: "Pending Orders",
        path: "/lab-technician/pending-orders",
      },
      {
        label: "Completed Orders",
        path: "/lab-technician/completed-orders"
      }
    ],
  };

  return (
    <div className={styles.topbar}>
      <div className={styles.logo}>
        CrenueLab
      </div>
      {/* <div className={styles.logo}>
        <Image
          src="/crenuelab.png"
          alt="CrenueLab"
          width={180}
          height={60}
          priority
        />
      </div> */}
      <div className={styles.menuContainer}>
        {menus[role]?.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={
              pathname === item.path
                ? styles.activeLink
                : styles.link
            }
          >
            {item.label}
          </Link>
        ))}
      </div>

      <button
        className={styles.logoutBtn}
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}