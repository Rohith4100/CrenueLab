"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./sidebar.module.css";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function Sidebar() {
  const router = useRouter();

  const [role, setRole] = useState(null);


  const pathname = usePathname();
  useEffect(() => {
    setRole(
      localStorage.getItem("role")
    );
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");

    router.push("/login");
  };

  const menus = {
    Administrator: [
      {
        label: "Dashboard",
        path: "/admin",
      },
      {
        label: "Manage Staff",
        path: "/admin/manage-staff",
      },
      {
        label: "Manage Patients",
        path: "/admin/manage-patients",
      },
      {
        label: "Manage catalog",
        path: "/admin/catalog"
      },
      {
        label: "Manage Parameters",
        path: "/admin/test-parameters"
      },
      {
        label: "Create Order",
        path: "/admin/create-order",
      },
      {
        label: "Monitor Orders",
        path: "/admin/order"
      },
      {
        label: "Test Report",
        path: "/admin/reports"
      },
      {
        label: "Patient Reports",
        path: "/admin/patient-reports"
      }

    ],

    Receptionist: [
      {
        label: "Dashboard",
        path: "/receptionist",
      },
      {
        label: "Manage Patients",
        path: "/receptionist/manage-patients",
      },
      {
        label: "Create Order",
        path: "/receptionist/create-order",
      },
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
      {
        label: "Create Orders",
        path: "/physician/create-order",
      },
      {
        label: "Test Reports",
        path: "/physician/reports",
      },
      {
        label: "Patient Reports",
        path: "/physician/patient-report"
      }
    ],

    Pathologist: [
      {
        label: "Dashboard",
        path: "/pathologist",
      },
      {
        label: "Pending Results",
        path: "/pathologist/pending-results",
      },
      {
        label: "Verified Results",
        path: "/pathologist/verified-results",
      },
      {
        label: "Rejected Results",
        path: "/pathologist/rejected-results",
      },
      {
        label: "Patient Reports",
        path: "/pathologist/patient-reports",
      },
    ],

    // "Lab Technician": [
    //   {
    //     label: "Dashboard",
    //     path: "/lab-technician",
    //   },
    //   {
    //     label: "Pending Orders",
    //     path: "/lab-technician/pending-orders",
    //   },
    // ],
  };

  return (

    <div className={styles.sidebar}>
      <div>
        <div className={styles.logoContainer}>
          <Image
            src="/crenuelab.png"
            alt="CrenueLab Logo"
            width={400}
            height={100}
            priority
            className={styles.logoImage}
          />
        </div>

        <hr className={styles.divider} />

        {menus[role]?.map((item) => (
          <div
            key={item.path}
            className={styles.menuItem}
          >
            {/* <Link
              href={item.path}
              className={styles.link}
            >
              {item.label}
            </Link> */}
            <Link
              href={item.path}
              className={
                pathname === item.path
                  ? styles.activeLink
                  : styles.link
              }
            >
              {item.label}
            </Link>
          </div>
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