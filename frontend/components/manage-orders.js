"use client";

import { useEffect, useState } from "react";
import styles from "@/components/manage.module.css";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import stylesd from "@/components/dashboard.module.css"
export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [patients, setPatients] = useState([]);
  const [physicians, setPhysicians] = useState([]);
  const [tests, setTests] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] =
    useState(null);
  const [form, setForm] = useState({
    patient_id: "",
    physician_id: "",
    priority: "Normal",
  });

  const [selectedTests, setSelectedTests] =
    useState([""]);

  useEffect(() => {
    fetchOrders();
    fetchPatients();
    fetchPhysicians();
    fetchTests();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/test-orders`
      );

      const data = await response.json();

      setOrders(
        data.sort((a, b) => a.id - b.id)
      );
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

  const fetchPhysicians = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/staffs`
      );

      const data = await response.json();

      setPhysicians(
        data.filter(
          (staff) =>
            staff.role === "Physician"
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

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

  const resetForm = () => {
    setForm({
      patient_id: "",
      physician_id: "",
      test_id: "",
      priority: "Normal",
    });
  };

  const createOrders = async () => {
    if (
      !form.patient_id ||
      !form.physician_id
    ) {
      alert(
        "Select patient and physician"
      );
      return;
    }

    const validTests =
      selectedTests.filter(
        (test) => test
      );

    if (
      validTests.length === 0
    ) {
      alert(
        "Select at least one test"
      );
      return;
    }

    try {
      for (const testId of validTests) {
        await apiFetch(
          `${API_BASE}/test-orders`,
          {
            method: "POST",
            body: JSON.stringify({
              patient_id: Number(
                form.patient_id
              ),
              physician_id: Number(
                form.physician_id
              ),
              test_id:
                Number(testId),
              priority:
                form.priority,
            }),
          }
        );
      }

      alert(
        `${validTests.length} Orders Created`
      );

      setSelectedTests([""]);

      resetForm();

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };
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

  const getTestName = (id) => {
    const test = tests.find(
      (t) => t.id === id
    );

    return test
      ? test.test_name
      : "Unknown";
  };

  const viewOrder = (order) => {
    setSelectedOrder(order);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const filteredOrders = orders.filter((order) => {
    const patientName = getPatientName(
      order.patient_id
    ).toLowerCase();

    const physicianName = getPhysicianName(
      order.physician_id
    ).toLowerCase();

    const testName = getTestName(
      order.test_id
    ).toLowerCase();

    const query = search.toLowerCase();

    return (
      patientName.includes(query) ||
      physicianName.includes(query) ||
      testName.includes(query) ||
      String(order.id).includes(query)
    );
  });
  const availableTests = tests.filter(
  (test) =>
    !selectedTests.includes(
      String(test.id)
    )
);
  return (
    <div className={styles.container}>
      {selectedOrder ? (
        <div className={styles.card}>
          <h1 className={stylesd.dashboardTitle}>
            Order Details
          </h1>

          <div className={styles.patientCard}>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>
                Order ID
              </div>

              <div className={styles.infoValue}>
                {selectedOrder.id}
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>
                Patient
              </div>

              <div className={styles.infoValue}>
                {getPatientName(
                  selectedOrder.patient_id
                )}
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>
                Physician
              </div>

              <div className={styles.infoValue}>
                {getPhysicianName(
                  selectedOrder.physician_id
                )}
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>
                Test
              </div>

              <div className={styles.infoValue}>
                {getTestName(
                  selectedOrder.test_id
                )}
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>
                Priority
              </div>

              <div className={styles.infoValue}>
                {
                  selectedOrder.priority
                }
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>
                Status
              </div>

              <div className={styles.infoValue}>
                {selectedOrder.status}
              </div>
            </div>
          </div>

          <br />

          <button
            className={styles.button}
            onClick={() =>
              setSelectedOrder(null)
            }
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <h1 className={stylesd.dashboardTitle}>
            Create Test Order
          </h1>

          <div className={styles.card}>
            <h2 className={stylesd.dashboardTitle}>
              New Test Order
            </h2>

            <div className={styles.form}>
              <select
                className={styles.select}
                value={form.patient_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    patient_id:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Patient
                </option>

                {patients.map(
                  (patient) => (
                    <option
                      key={patient.id}
                      value={patient.id}
                    >
                      {
                        patient.first_name
                      }{" "}
                      {
                        patient.last_name
                      }
                    </option>
                  )
                )}
              </select>

              <select
                className={styles.select}
                value={form.physician_id}
                onChange={(e) =>
                  setForm({
                    ...form,
                    physician_id:
                      e.target.value,
                  })
                }
              >
                <option value="">
                  Select Physician
                </option>

                {physicians.map(
                  (physician) => (
                    <option
                      key={physician.id}
                      value={physician.id}
                    >
                      {
                        physician.first_name
                      }{" "}
                      {
                        physician.last_name
                      }
                    </option>
                  )
                )}
              </select>
              {selectedTests.map(
                (testId, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className={styles.select}
                      value={testId}
                      onChange={(e) => {
                        const updated = [
                          ...selectedTests,
                        ];

                        updated[index] =
                          e.target.value;

                        setSelectedTests(
                          updated
                        );
                      }}
                      style={{ flex: 1 }}
                    >
                      <option value="">
                        Select Test
                      </option>

                      {tests
                        .filter(
                          (test) =>
                            !selectedTests.includes(
                              String(test.id)
                            ) ||
                            String(test.id) ===
                            testId
                        )
                        .map((test) => (
                          <option
                            key={test.id}
                            value={test.id}
                          >
                            {test.test_name}
                          </option>
                        ))}
                    </select>

                    {selectedTests.length > 1 && (
                      <button
                        type="button"
                        className={styles.deleteBtn}
                        onClick={() => {
                          const updated =
                            selectedTests.filter(
                              (_, i) =>
                                i !== index
                            );

                          setSelectedTests(
                            updated
                          );
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )
              )}
              <button
                className={styles.button}
                type="button"
                disabled={
                  availableTests.length === 0
                }
                onClick={() =>{
                  const hasEmpty =
                  selectedTests.some(
                    (t) => t === ""
                  );

                  if (hasEmpty) {
                    alert(
                      "Select the current test first"
                    );
                    return;
                  }
                  setSelectedTests([
                    ...selectedTests,
                    "",
                  ])
                }}
              >
                {availableTests.length === 0
                  ? "All Tests Added"
                  : "+ Add Test"}
              </button>
              <select
                className={styles.select}
                value={form.priority}
                onChange={(e) =>
                  setForm({
                    ...form,
                    priority:
                      e.target.value,
                  })
                }
              >
                <option>
                  Normal
                </option>
                <option>
                  Urgent
                </option>
                <option>
                  STAT
                </option>
              </select>
            </div>

            <br />

            <button
              className={styles.button}
              onClick={createOrders}
            >
              Create Order
            </button>
          </div>

          <div className={styles.card}>
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2 className={stylesd.dashboardTitle}>
                Orders List
              </h2>

              <button
                className={styles.refreshBtn}
                onClick={fetchOrders}
              >
                Refresh
              </button>
            </div>
            <span
              className={styles.sub_title}
              style={{ marginLeft: "5px" }}
            >Search</span>
            <div className={styles.searchContainer}>
              <input
                type="search"
                style={{ marginTop: "5px" }}
                placeholder="Search order, patient, physician or test..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className={styles.searchInput}
              />
            </div>
            <div className={styles.tableWrapper}>
              <table className={stylesd.dashboardTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Physician</th>
                    <th>Test</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
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

                      <td>
                        <button
                          className={
                            styles.viewBtn
                          }
                          onClick={() =>
                            viewOrder(
                              order
                            )
                          }
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}