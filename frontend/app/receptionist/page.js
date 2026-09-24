"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/dashboard.module.css";
import { useRouter } from "next/navigation";
export default function ReceptionistDashboard() {
  const [stats, setStats] = useState({
    patients: 0,
    orders: 0,
    pending: 0,
    completed: 0,
  });
  const router=useRouter();
  const [orders, setOrders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [tests, setTests] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "Receptionist") {
      router.push("/login");
      return;
    }

    // setName(
    //   localStorage.getItem("name") ||
    //   "Receptionist"
    // );

    loadDashboard();
    fetchPhysicians();
    fetchTests();

  }, []);

  const getPatientName = (id) => {
    const patient = patients.find(
      (p) => p.id === id
    );

    return patient
      ? `${patient.first_name} ${patient.last_name}`
      : "Unknown";
  };
  const getPhysicianName = (id) => {
    const physician = physicians.find(
      (p) => p.id === id
    );

    return physician
      ? `${physician.first_name} ${physician.last_name}`
      : "Unknown";
  };
  const getTestName = (testId) => {
    const test = tests.find(
      (test) => test.id === Number(testId)
    );

    return test?.test_name || "-";
  };
  const loadDashboard = async () => {
    try {
      const patientsRes = await apiFetch(
        `${API_BASE}/patients`
      );
      const ordersRes = await apiFetch(
        `${API_BASE}/test-orders`
      );
      const patients =
        await patientsRes.json();
      const orders =
        await ordersRes.json();
      setOrders(orders);
      setPatients(patients);
      setStats({
        patients: patients.length,
        orders: orders.length,
        pending: orders.filter(
          (o) =>
            o.status === "New" ||
            o.status === "Pending"
        ).length,
        completed: orders.filter(
          (o) =>
            o.status === "Completed" ||
            o.status === "Verified"
        ).length,
      });
    } catch (err) {
      console.error(err);
    }
  };
  const recentOrders = [...orders]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const recentPatients = [...patients]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const priorityOrders = orders.filter(
    (order) =>
      order.priority === "STAT" ||
      order.priority === "Urgent"
  );


  const fetchPhysicians = async () => {
    const response = await apiFetch(
      `${API_BASE}/staffs`
    );

    const data = await response.json();

    setPhysicians(
      data.filter(
        (staff) => staff.role === "Physician"
      )
    );
  };

  const fetchTests = async () => {
    const response = await apiFetch(
      `${API_BASE}/test-catalog`
    );

    const data = await response.json();

    setTests(data);
  };



  const todayOrders = orders.filter((order) => {
    const today = new Date().toDateString();

    return (
      new Date(
        order.order_date
      ).toDateString() === today
    );
  });

  const todayPatients = patients.filter((patient) => {
    const today = new Date().toDateString();

    return (
      new Date(
        patient.created_at
      ).toDateString() === today
    );
  });
  return (
    <div className={styles.container}>
      <div className={styles.dashboardHeading}>
        <div>
          <h1 className={styles.dashboardTitle}>
            Receptionist Dashboard
          </h1>

          <p className={styles.dashboardSubtitle}>
            Laboratory front desk overview
          </p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.patientsCard}`}>
          <h3>Total Patients</h3>
          <p>{stats.patients}</p>
        </div>

        <div className={`${styles.statCard} ${styles.ordersCard}`}>
          <h3>Total Orders</h3>
          <p>{stats.orders}</p>
        </div>

        <div className={`${styles.statCard} ${styles.pendingCard}`}>
          <h3>Pending Orders</h3>
          <p>{stats.pending}</p>
        </div>

        <div className={`${styles.statCard} ${styles.verifiedCard}`}>
          <h3>Completed Orders</h3>
          <p>{stats.completed}</p>
        </div>
      </div>
      <div className={styles.dashboardGrid}>
        <div className={styles.card}>
          <h2 className={styles.dashboardTitle}
            style={{ marginBottom: "15px" }}>
            Today's Activity
          </h2>

          <div className={styles.activityList}>
            {/* <div className={styles.activityRow}> */}
              {/* <span>Patients Registered</span>
              <strong>
                {todayPatients.length}
              </strong> */}
            {/* </div> */}

            <div className={styles.activityRow}>
              <span>Orders Created</span>
              <strong>
                {todayOrders.length}
              </strong>
            </div>

            <div className={styles.activityRow}>
              <span>Pending Orders</span>
              <strong>
                {
                  orders.filter(
                    (o) => o.status === "New"
                  ).length
                }
              </strong>
            </div>

            <div className={styles.activityRow}>
              <span>STAT Orders</span>
              <strong>
                {
                  orders.filter(
                    (o) =>
                      o.priority === "STAT"
                  ).length
                }
              </strong>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.dashboardTitle}>
            Priority Orders
          </h2>

          {priorityOrders.length > 0 ? (
            priorityOrders
              .slice(0, 5)
              .map((order) => (
                <div
                  key={order.id}
                  className={
                    styles.priorityItem
                  }
                >
                  <div>
                    <strong>
                      #{order.id}
                    </strong>
                  </div>

                  <div>
                    {order.priority}
                  </div>
                </div>
              ))
          ) : (
            <p>No urgent orders</p>
          )}
        </div>
      </div>
      <div className={styles.card}>
        <h2 className={styles.dashboardTitle}
          style={{
            marginBottom: "15px"
          }}>
          Recent Test Orders
        </h2>

        <div className={styles.tableWrapper}>
          <table className={styles.dashboardTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Patient</th>
                <th>Physician</th>
                <th>Test</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>

                    <td>
                      {getPatientName(
                        order.patient_id
                      )}
                    </td>

                    <td>
                      {getPhysicianName(
                        order.physician_id
                      )}
                    </td>

                    <td>
                      {getTestName(
                        order.test_id
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          order.priority ===
                            "STAT" ||
                            order.priority ===
                            "Urgent"
                            ? styles.urgentBadge
                            : styles.normalBadge
                        }
                      >
                        {order.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          styles.statusBadge
                        }
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* <div className={styles.card}>
        <h2>Quick Actions</h2>

        <div className={styles.actionGrid}>
          <button
            className={styles.actionBtn}
          >
            Register Patient
          </button>

          <button
            className={styles.actionBtn}
          >
            Create Test Order
          </button>

          <button
            className={styles.actionBtn}
          >
            View Orders
          </button>

          <button
            className={styles.actionBtn}
          >
            Search Reports
          </button>
        </div>
      </div> */}
    </div>
  );
}