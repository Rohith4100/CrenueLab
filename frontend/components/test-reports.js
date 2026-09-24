"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css";
export default function Reports({ role }) {
  const router = useRouter();

  const [results, setResults] =
    useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response =
        await apiFetch(
          `${API_BASE}/lab-results`
        );

      const data =
        await response.json();

      setResults(
        data.filter(
          (result) =>
            result.status ===
            "Verified"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={stylesd.dashboardHeading}>
        <div>
          <h1 className={stylesd.dashboardTitle}>
            Laboratory Reports
          </h1>

          <p className={stylesd.dashboardSubtitle}>
            View and monitor generated laboratory reports
          </p>
        </div>
      </div>
      <div style={{ marginBottom: "15px" }}
        className={`${stylesd.statCard}
               ${stylesd.verifiedCard}`}
      >
        <div className={stylesd.statLabel}>
          Verified Reports
        </div>

        <div className={stylesd.statValue}>
          {results.length}
        </div>
      </div>
      <div
        className={styles.card}
      >
        <div className={stylesd.toolbar}>
          <div>
            <h2 className={stylesd.dashboardTitle}>
              Verified Reports
            </h2>

            <p className={stylesd.dashboardSubtitle}>
              Approved laboratory reports
            </p>
          </div>

          <button
            className={styles.refreshBtn}
            onClick={fetchResults}
          >
            Refresh
          </button>
        </div>
        <span
          className={styles.sub_title}
          style={{marginLeft:"5px"}}
          >Search</span>
        <div className={stylesd.statsGrid}
        style={{marginTop:"6px"}}
        >
          <div className={stylesd.toolbar}
          style={{marginBottom:"-30px"}}>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Search Result ID, Order ID..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>
        </div>
        <table className={stylesd.dashboardTable}>
          <thead>
            <tr>
              {/* <th>Result ID</th> */}
              <th>Order ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {results.filter(
              (result) =>
                result.id
                  .toString()
                  .includes(search) ||

                result.order_id
                  .toString()
                  .includes(search)
            )
              .map(
                (result) => (
                  <tr key={result.id}>
                    {/* <td>
                      {result.id}
                    </td> */}

                    <td>
                      {
                        result.order_id
                      }
                    </td>

                    <td>
                      <span
                        className={`${stylesd.statusBadge}
                          ${result.status === "Verified"
                            ? stylesd.verifiedStatus
                            : stylesd.newStatus
                          }`}
                      >
                        {result.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className={
                          styles.viewBtn
                        }
                        onClick={() =>
                          router.push(
                            `/${role}/report/${result.id}`
                          )
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}