"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css";
import { useRouter } from "next/navigation";
export default function TechnicianDashboard() {
  const [orders, setOrders] = useState([]);
  const [patients, setPatients] =
    useState([]);
  const [tests, setTests] =
    useState([]);
  const router = useRouter();
   useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Lab Technician") {
      router.push("/login");
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        ordersRes,
        patientsRes,
        testsRes,
      ] = await Promise.all([
        apiFetch(
          `${API_BASE}/test-orders`
        ),
        apiFetch(
          `${API_BASE}/patients`
        ),
        apiFetch(
          `${API_BASE}/test-catalog`
        ),
      ]);

      setOrders(
        await ordersRes.json()
      );

      setPatients(
        await patientsRes.json()
      );

      setTests(
        await testsRes.json()
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getPatientName = (
    patientId
  ) => {
    const patient = patients.find(
      (p) => p.id === patientId
    );

    return patient
      ? `${patient.first_name} ${patient.last_name}`
      : "-";
  };

  const getTestName = (
    testId
  ) => {
    const test = tests.find(
      (t) => t.id === testId
    );

    return test?.test_name || "-";
  };

  const pendingOrders =
    orders.filter(
      (o) => o.status === "New"
    ).length;

  const inProgressOrders =
    orders.filter(
      (o) =>
        o.status ===
        "In Progress"
    ).length;

  const completedOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Completed"
    ).length;

  const rejectedOrders =
    orders.filter(
      (o) =>
        o.status ===
        "Rejected"
    ).length;

  const urgentOrders =
    orders.filter(
      (o) =>
        (o.priority === "Urgent" || o.priority === "STAT") &&
        o.status === "New"
    );

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
            Laboratory Dashboard
          </h1>

          <p
            className={
              stylesd.dashboardSubtitle
            }
          >
            Monitor and manage
            laboratory operations
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
          ${stylesd.pendingCard}`}
        >
          <div
            className={
              stylesd.statLabel
            }
          >
            Pending Orders
          </div>

          <div
            className={
              stylesd.statValue
            }
          >
            {pendingOrders}
          </div>
        </div>

        {/* <div
          className={`${stylesd.statCard}
          ${stylesd.staffCard}`}
        >
          <div
            className={
              stylesd.statLabel
            }
          >
            In Progress
          </div>

          <div
            className={
              stylesd.statValue
            }
          >
            {inProgressOrders}
          </div>
        </div> */}

        <div
          className={`${stylesd.statCard}
          ${stylesd.verifiedCard}`}
        >
          <div
            className={
              stylesd.statLabel
            }
          >
            Completed
          </div>

          <div
            className={
              stylesd.statValue
            }
          >
            {completedOrders}
          </div>
        </div>

        <div
          className={`${stylesd.statCard}
          ${stylesd.rejectedCard}`}
        >
          <div
            className={
              stylesd.statLabel
            }
          >
            Rejected
          </div>

          <div
            className={
              stylesd.statValue
            }
          >
            {rejectedOrders}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardTitle
          }
        >
          High Priority Orders
        </h2>

        <table
          className={
            stylesd.dashboardTable
          }
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Test</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {urgentOrders.map(
              (order) => (
                <tr
                  key={order.id}
                >
                  <td>
                    {order.id}
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
                    {order.status}
                  </td> */}
                  <td>
                        <span
                          className={`${stylesd.statusBadge}
                            ${
                               stylesd.newStatus
                            }`}
                        >
                          {order.status}
                        </span>
                      </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardTitle
          }
        >
          Recent Orders
        </h2>

        <table
          className={
            stylesd.dashboardTable
          }
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Test</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders
              .slice(-10)
              .reverse()
              .map((order) => (
                <tr
                  key={order.id}
                >
                  <td>
                    {order.id}
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

                  <td>
                    {order.priority}
                  </td>

                  <td>
                    <span
                      className={`${stylesd.statusBadge}
                      ${order.status ===
                          "Completed"
                          ? stylesd.verifiedStatus
                          : order.status ===
                            "Rejected"
                            ? stylesd.rejectedStatus
                            : stylesd.newStatus
                        }`}
                    >
                      {
                        order.status
                      }
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