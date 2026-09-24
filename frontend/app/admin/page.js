"use client";
import stylesd from "@/components/dashboard.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";

export default function Admin() {
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Administrator") {
      router.push("/login");
      return;
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        patientsRes,
        staffRes,
        ordersRes,
        resultsRes,
        testsRes,
      ] = await Promise.all([
        apiFetch(`${API_BASE}/patients`),
        apiFetch(`${API_BASE}/staffs`),
        apiFetch(`${API_BASE}/test-orders`),
        apiFetch(`${API_BASE}/lab-results`),
        apiFetch(`${API_BASE}/test-catalog`),
      ]);

      setPatients(await patientsRes.json());
      setStaff(await staffRes.json());
      setOrders(await ordersRes.json());
      setResults(await resultsRes.json());
      setTests(await testsRes.json());
    } catch (error) {
      console.error(error);
    }
  };

  const verifiedReports = results.filter(
    (result) => result.status === "Verified"
  ).length;

  const rejectedReports = results.filter(
    (result) => result.status === "Rejected"
  ).length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "New" ||
      order.status === "Completed"
  ).length;

  const testUsage = {};

  orders.forEach((order) => {
    testUsage[order.test_id] =
      (testUsage[order.test_id] || 0) + 1;
  });

  const topTests = Object.entries(testUsage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const getTestName = (testId) => {
    const test = tests.find(
      (test) => test.id === Number(testId)
    );

    return test?.test_name || "-";
  };
  const getPatientName = (patientId) => {
    const patient = patients.find(
      (p) => p.id === patientId
    );

    return patient
      ? `${patient.first_name} ${patient.last_name}`
      : "-";
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={stylesd.dashboardTitle}
        style={
          {marginBottom: "20px"}
        }
        >
          Admin Dashboard
        </h1>

        <div className={stylesd.statsGrid}>

          <div className={`${stylesd.statCard} ${stylesd.patientsCard}`}>
            <div className={stylesd.statLabel}>
              Total Patients
            </div>
            <div className={stylesd.statValue}>
              {patients.length}
            </div>
          </div>

          <div className={`${stylesd.statCard} ${stylesd.staffCard}`}>
            <div className={stylesd.statLabel}>
              Total Staff
            </div>
            <div className={stylesd.statValue}>
              {staff.length}
            </div>
          </div>

          <div className={`${stylesd.statCard} ${stylesd.testsCard}`}>
            <div className={stylesd.statLabel}>
              Total Tests
            </div>
            <div className={stylesd.statValue}>
              {tests.length}
            </div>
          </div>

          <div className={`${stylesd.statCard} ${stylesd.ordersCard}`}>
            <div className={stylesd.statLabel}>
              Total Orders
            </div>
            <div className={stylesd.statValue}>
              {orders.length}
            </div>
          </div>

          <div className={`${stylesd.statCard} ${stylesd.verifiedCard}`}>
            <div className={stylesd.statLabel}>
              Verified Reports
            </div>
            <div className={stylesd.statValue}>
              {verifiedReports}
            </div>
          </div>

          <div className={`${stylesd.statCard} ${stylesd.rejectedCard}`}>
            <div className={stylesd.statLabel}>
              Rejected Reports
            </div>
            <div className={stylesd.statValue}>
              {rejectedReports}
            </div>
          </div>

          <div className={`${stylesd.statCard} ${stylesd.pendingCard}`}>
            <div className={stylesd.statLabel}>
              Pending Orders
            </div>
            <div className={stylesd.statValue}>
              {pendingOrders}
            </div>
          </div>

        </div>

        {/* <div className={stylesd.dashboardTableCard}>
          <h2
            className={stylesd.dashboardTitle}
            style={
              { marginBottom: "10px" }
            }
          >Most Requested Tests</h2>

          <table className={stylesd.dashboardTable}>
            <thead>
              <tr>
                <th>Test Name</th>
                <th>Total Orders</th>
              </tr>
            </thead>

            <tbody>
              {topTests.map(([id, count], index) => (
                <tr key={id}>
                  <td
                    className={
                      index === 0
                        ? stylesd.rank1
                        : index === 1
                          ? stylesd.rank2
                          : index === 2
                            ? stylesd.rank3
                            : ""
                    }
                  >
                    {getTestName(id)}
                  </td>

                  <td>
                    <span className={stylesd.rank2}>
                      {count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}

        <br />

        <div className={stylesd.dashboardTableCard}>
          <h2
            className={stylesd.dashboardTitle}
            style={
              { marginBottom: "10px" }
            }
          >Recent Orders</h2>

          <table className={stylesd.dashboardTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patient Name</th>
                <th>Test Name</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders
                .slice(-10)
                .reverse()
                .map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{getPatientName(order.patient_id)}</td>
                    <td>{getTestName(order.test_id)}</td>
                    <td>
                      <span
                        className={`${stylesd.statusBadge}
                            ${order.status === "Verified"
                            ? stylesd.verifiedStatus
                            : order.status === "Rejected"
                              ? stylesd.rejectedStatus
                              : order.status === "Completed"
                                ? stylesd.completedStatus
                                : stylesd.newStatus
                          }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}