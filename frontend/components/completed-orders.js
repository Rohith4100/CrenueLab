"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css";

export default function CompletedOrders() {
  const [orders, setOrders] = useState([]);
  const [patients, setPatients] =
    useState([]);
  const [tests, setTests] =
    useState([]);
  const [search, setSearch] =
    useState("");

  useEffect(() => {
    fetchOrders();
    fetchPatients();
    fetchTests();
  }, []);

  const fetchOrders = async () => {
    try {
      const response =
        await apiFetch(
          `${API_BASE}/test-orders`
        );

      const data =
        await response.json();

      setOrders(
        data.filter(
          (order) =>
            order.status ===
            "Completed"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPatients =
    async () => {
      try {
        const response =
          await apiFetch(
            `${API_BASE}/patients`
          );

        const data =
          await response.json();

        setPatients(data);
      } catch (error) {
        console.error(error);
      }
    };

  const fetchTests =
    async () => {
      try {
        const response =
          await apiFetch(
            `${API_BASE}/test-catalog`
          );

        const data =
          await response.json();

        setTests(data);
      } catch (error) {
        console.error(error);
      }
    };

  const getPatientName = (
    patientId
  ) => {
    const patient =
      patients.find(
        (p) =>
          p.id === patientId
      );

    return patient
      ? `${patient.first_name} ${patient.last_name}`
      : "-";
  };

  const getTestName = (
    testId
  ) => {
    const test = tests.find(
      (t) =>
        t.id === testId
    );

    return (
      test?.test_name || "-"
    );
  };
  // return(<div>hi</div>);
  return (
    <div className={styles.container}>
      <div
        className={
          stylesd.dashboardHeading
        }
      >
        <div>
          <h1
            className={
              stylesd.dashboardTitle
            }
          >
            Completed Orders
          </h1>

          <p
            className={
              stylesd.dashboardSubtitle
            }
          >
            Orders with results
            submitted by
            laboratory staff
          </p>
        </div>
      </div>

      <div
        className={
          stylesd.statsGrid
        }
      >
        <div
          className={`${stylesd.statCard}
          ${stylesd.verifiedCard}`}
        >
          <div
            className={
              stylesd.statLabel
            }
          >
            Completed Orders
          </div>

          <div
            className={
              stylesd.statValue
            }
          >
            {orders.length}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom:
              "20px",
          }}
        >
          <h2
            className={
              stylesd.dashboardSectionTitle
            }
          >
            Completed Tests
          </h2>

          <button
            className={
              styles.refreshBtn
            }
            onClick={
              fetchOrders
            }
          >
            Refresh
          </button>
        </div>

        <input
          className={
            styles.searchInput
          }
          placeholder="Search patient, test or order..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <table
          className={
            stylesd.dashboardTable
          }
        >
          <thead>
            <tr>
              <th>
                Order ID
              </th>

              <th>
                Patient
              </th>

              <th>Test</th>

              <th>
                Priority
              </th>

              <th>
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {orders
              .filter(
                (order) => {
                  const patient =
                    getPatientName(
                      order.patient_id
                    );

                  const test =
                    getTestName(
                      order.test_id
                    );

                  return (
                    order.id
                      .toString()
                      .includes(
                        search
                      ) ||
                    patient
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      ) ||
                    test
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                  );
                }
              )
              .map(
                (order) => (
                  <tr
                    key={
                      order.id
                    }
                  >
                    <td>
                      {
                        order.id
                      }
                    </td>

                    <td>
                      {getPatientName(
                        order.patient_id
                      )}
                    </td>

                    <td>
                      {getTestName(
                        order.test_id
                      )}
                    </td>

                    {/* <td>
                      {
                        order.priority
                      }
                    </td> */}
                    <td>
                      <span
                        className={`${stylesd.statusBadge}
                            ${order.priority === "Normal"
                            ? stylesd.verifiedStatus
                            : order.priority === "STAT"
                              ? stylesd.rejectedStatus
                              : stylesd.completedStatus
                          }`}
                      >
                        {order.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`${stylesd.statusBadge}
                        ${stylesd.verifiedStatus}`}
                      >
                        Completed
                      </span>
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>

        {orders.length ===
          0 && (
            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "30px",
                color:
                  "#64748b",
              }}
            >
              No Completed
              Orders Found
            </div>
          )}
      </div>
    </div>
  );

}