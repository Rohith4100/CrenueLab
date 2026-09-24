"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";

import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css";

export default function Physician() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Physician") {
      router.push("/login");
      return;
    }

    setName(
      localStorage.getItem("name") ||
      "Doctor"
    );

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        reportsRes,
        patientsRes,
      ] = await Promise.all([
        apiFetch(
          `${API_BASE}/lab-results`
        ),
        apiFetch(
          `${API_BASE}/patients`
        ),
      ]);

      setReports(
        await reportsRes.json()
      );

      setPatients(
        await patientsRes.json()
      );
    } catch (error) {
      console.error(error);
    }
  };

  const verifiedReports =
    reports.filter(
      (r) =>
        r.status === "Verified"
    ).length;

  const rejectedReports =
    reports.filter(
      (r) =>
        r.status === "Rejected"
    ).length;

  const pendingReports =
    reports.filter(
      (r) =>
        r.status === "Pending"
    ).length;

  return (
    <div className={styles.container}>
      <div className={stylesd.dashboardHeading}>
        <div>
          <h1 className={stylesd.dashboardTitle}>
            Physician Dashboard
          </h1>

          <p className={stylesd.dashboardSubtitle}>
            Welcome back, {name}
          </p>
        </div>
      </div>

      <div className={stylesd.statsGrid}>
        <div
          className={`${stylesd.statCard}
          ${stylesd.patientsCard}`}
        >
          <div className={stylesd.statLabel}>
            Total Patients
          </div>

          <div className={stylesd.statValue}>
            {patients.length}
          </div>
        </div>

        <div
          className={`${stylesd.statCard}
          ${stylesd.verifiedCard}`}
        >
          <div className={stylesd.statLabel}>
            Verified Reports
          </div>

          <div className={stylesd.statValue}>
            {verifiedReports}
          </div>
        </div>

        <div
          className={`${stylesd.statCard}
          ${stylesd.pendingCard}`}
        >
          <div className={stylesd.statLabel}>
            Awaiting Review
          </div>

          <div className={stylesd.statValue}>
            {pendingReports}
          </div>
        </div>

        <div
          className={`${stylesd.statCard}
          ${stylesd.rejectedCard}`}
        >
          <div className={stylesd.statLabel}>
            Rejected Reports
          </div>

          <div className={stylesd.statValue}>
            {rejectedReports}
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardTitle
          }
        >
          Recent Verified Reports
        </h2>

        <table
          className={
            stylesd.dashboardTable
          }
        >
          <thead>
            <tr>
              <th>Result ID</th>
              <th>Order ID</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {reports
              .filter(
                (r) =>
                  r.status ===
                  "Verified"
              )
              .slice(-5)
              .reverse()
              .map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>

                  <td>
                    {report.order_id}
                  </td>

                  <td>
                    <span
                      className={`${stylesd.statusBadge}
                ${stylesd.verifiedStatus}`}
                    >
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
}