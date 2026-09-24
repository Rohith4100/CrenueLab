"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css"
export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");
  const [patients, setPatients] = useState([]);
  const [tests, setTests] = useState([]);

  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchOrders();
    fetchPatients();
    fetchTests();
  }, []);
  const fetchTests = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/test-catalog`
      );

      const data = await response.json();

      setTests(data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchPatients = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/patients`
      );

      const data = await response.json();

      setPatients(data);
    } catch (error) {
      console.error(error);
    }
  };
  const getPatientName = (patientId) => {
    const patient = patients.find(
      (p) => p.id === patientId
    );

    return patient
      ? `${patient.first_name} ${patient.last_name}`
      : "Unknown";
  };
  const getTestName = (testId) => {
    const test = tests.find(
      (t) => t.id === testId
    );

    return test
      ? test.test_name
      : "Unknown";
  };
  const fetchOrders = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/test-orders`
      );

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
        (order) => order.status === filter
      );

  const getFormatedDate = (date) => {
    const formatted = new Date(date)
      .toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    return formatted;
  }
  return (
    <div className={styles.container}>
      <div className={stylesd.dashboardHeading}>
        <div>
          <h1 className={stylesd.dashboardTitle}>
            Order Monitoring
          </h1>

          <p className={stylesd.dashboardSubtitle}>
            Track laboratory order workflow and status
          </p>
        </div>
      </div>

      <div className={stylesd.statsGrid}>

        <div className={`${stylesd.statCard} ${stylesd.ordersCard}`}>
          <div className={stylesd.statLabel}>
            Total Orders
          </div>
          <div className={stylesd.statValue}>
            {orders.length}
          </div>
        </div>

        <div className={`${stylesd.statCard} ${stylesd.pendingCard}`}>
          <div className={stylesd.statLabel}>
            New Orders
          </div>
          <div className={stylesd.statValue}>
            {
              orders.filter(
                (o) => o.status === "New"
              ).length
            }
          </div>
        </div>

        <div className={`${stylesd.statCard} ${stylesd.testsCard}`}>
          <div className={stylesd.statLabel}>
            Completed Orders
          </div>
          <div className={stylesd.statValue}>
            {
              orders.filter(
                (o) => o.status === "Completed"
              ).length
            }
          </div>
        </div>

        <div className={`${stylesd.statCard} ${stylesd.verifiedCard}`}>
          <div className={stylesd.statLabel}>
            Verified Orders
          </div>
          <div className={stylesd.statValue}>
            {
              orders.filter(
                (o) => o.status === "Verified"
              ).length
            }
          </div>
        </div>

        <div className={`${stylesd.statCard} ${stylesd.rejectedCard}`}>
          <div className={stylesd.statLabel}>
            Rejected Orders
          </div>
          <div className={stylesd.statValue}>
            {
              orders.filter(
                (o) => o.status === "Rejected"
              ).length
            }
          </div>
        </div>

      </div>

      <div className={styles.card}>
        <div className={stylesd.toolbar}>
          <div>
            <h2 className={stylesd.dashboardTitle}>
              Order Tracking
            </h2>

            <p className={stylesd.dashboardSubtitle}>
              Current order processing status
            </p>
          </div>

          <button
            className={styles.refreshBtn}
            onClick={fetchOrders}
          >
            Refresh
          </button>
        </div>
        <span
          className={styles.sub_title}
          style={{ marginLeft: "4px" }}
        >Search</span>
        <div className={stylesd.toolbar}
          style={{ marginTop: "3px" }}>

          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search Order ID or Status..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <select
            className={styles.filterSelect}
            style={
              { marginTop: "-19px" }
            }
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option>All</option>
            <option>New</option>
            <option>Completed</option>
            <option>Verified</option>
            <option>Rejected</option>
          </select>

        </div>

        <table className={stylesd.dashboardTable}>
          <thead>
            <tr>
              {/* <th>Order ID</th> */}
              <th>Patient Name</th>
              <th>Test Name</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Order Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.filter((order) =>
              order.id
                .toString()
                .includes(search) ||
              order.status
                .toLowerCase()
                .includes(search.toLowerCase())
            )

              .map(
                (order) => (
                  <tr key={order.id}>
                    {/* <td>{order.id}</td> */}
                    <td>{getPatientName(order.patient_id)}</td>
                    <td>{getTestName(order.test_id)}</td>
                    <td>{order.priority}</td>
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
                    <td>{getFormatedDate(order.order_date)}</td>
                  </tr>
                )
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}