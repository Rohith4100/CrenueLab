"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css";
export default function Pathologist() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Pathologist") {
      router.push("/login");
      return;
    }

    setName(
      localStorage.getItem("name") ||
      "Pathologist"
    );

    fetchResults();
  }, []);
  const fetchResults = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/lab-results`
      );

      const data = await response.json();

      setResults(data);

    } catch (error) {
      console.error(error);
    }
  };

  const pendingResults = results.filter(
    (r) => r.status === "Pending"
  ).length;

  const verifiedResults = results.filter(
    (r) => r.status === "Verified"
  ).length;

  const rejectedResults = results.filter(
    (r) => r.status === "Rejected"
  ).length;

  const totalResults = results.length;
  return (
    <div className={styles.container}>

      <h1 className={stylesd.dashboardTitle}>
        Pathologist Dashboard
      </h1>

      <p
        style={{
          marginTop: "10px",
          marginBottom: "30px",
          fontSize: "18px",
        }}
      >
        Welcome, <strong>{name.toUpperCase()}</strong>
      </p>

      <div className={stylesd.statsGrid}>

        <div
          className={`${stylesd.statCard} ${stylesd.pendingCard}`}
        >
          <div className={stylesd.statLabel}>
            Pending Verification
          </div>

          <div className={stylesd.statValue}>
            {pendingResults}
          </div>
        </div>

        <div
          className={`${stylesd.statCard} ${stylesd.verifiedCard}`}
        >
          <div className={stylesd.statLabel}>
            Verified Results
          </div>

          <div className={stylesd.statValue}>
            {verifiedResults}
          </div>
        </div>

        <div
          className={`${stylesd.statCard} ${stylesd.rejectedCard}`}
        >
          <div className={stylesd.statLabel}>
            Rejected Results
          </div>

          <div className={stylesd.statValue}>
            {rejectedResults}
          </div>
        </div>

        <div
          className={`${stylesd.statCard} ${stylesd.testsCard}`}
        >
          <div className={stylesd.statLabel}>
            Total Results
          </div>

          <div className={stylesd.statValue}>
            {totalResults}
          </div>
        </div>

      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardTitle
          }
        >
          Recent Reports Awaiting Review
        </h2>

        {results.filter(
          (r) => r.status === "Pending"
        ).length === 0 ? (

          <div
            style={{
              textAlign: "center",
              padding: "30px",
              color: "#64748b",
            }}
          >
            No Recent Reports
          </div>

        ) : (

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
              {results
                .filter(
                  (r) =>
                    r.status ===
                    "Pending"
                )
                .slice(-10)
                .reverse()
                .map((result) => (
                  <tr
                    key={result.id}
                  >
                    <td>
                      {result.id}
                    </td>

                    <td>
                      {result.order_id}
                    </td>

                    <td>
                      <span
                        className={`${stylesd.statusBadge}
                    ${stylesd.completedStatus}`}
                      >
                        Awaiting
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

        )}
      </div>

    </div>
  );
}