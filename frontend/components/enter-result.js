"use client";
import stylesd from "@/components/dashboard.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/manage.module.css";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";

export default function EnterResult({
  orderId,
}) {
  const router = useRouter();

  const [order, setOrder] =
    useState(null);

  const [parameters, setParameters] =
    useState([]);

  const [values, setValues] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response =
        await apiFetch(
          `${API_BASE}/test-orders/${orderId}`
        );

      const orderData =
        await response.json();

      setOrder(orderData);

      await fetchParameters(
        orderData.test_id
      );

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchParameters =
    async (testId) => {
      try {
        const response =
          await apiFetch(
            `${API_BASE}/test-parameters/test/${testId}`
          );

        const data =
          await response.json();

        setParameters(data);
      } catch (error) {
        console.error(error);
      }
    };

  const handleChange = (
    parameterId,
    value
  ) => {
    setValues((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const submitResults =
    async () => {
      const technicianId =
        Number(
          localStorage.getItem(
            "user_id"
          )
        );
      const items =
        parameters.map(
          (parameter) => ({
            parameter_id:
              parameter.id,
            parameter_value:
              values[
              parameter.id
              ] || "",
          })
        );

      try {
        const response =
          await apiFetch(
            `${API_BASE}/lab-results`,
            {
              method: "POST",
              body: JSON.stringify({
                order_id:
                  Number(orderId),
                entered_by:
                  technicianId,
                items,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.detail ||
            "Failed to save results"
          );
          return;
        }

        alert(
          "Results saved successfully"
        );

        router.push(
          "/lab-technician/pending-orders"
        );
      } catch (error) {
        console.error(error);
      }
    };

  if (loading) {
    return (
      <div
        className={
          styles.container
        }
      >
        Loading...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={stylesd.dashboardHeading}>
        <div>
          <h1 className={stylesd.dashboardTitle}>
            Enter Test Results
          </h1>

          <p className={stylesd.dashboardSubtitle}>
            Record laboratory findings for the selected order
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardTitle
          }
        >
          Order Information
        </h2>

        <div className={styles.patientCard}>
          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Order ID
            </div>

            <div className={styles.infoValue}>
              #{order.id}
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Status
            </div>

            <div className={styles.infoValue}>
              <span
                className={`${stylesd.statusBadge}
              ${order.status ===
                    "Rejected"
                    ? stylesd.rejectedStatus
                    : order.status ===
                      "Verified"
                      ? stylesd.verifiedStatus
                      : stylesd.newStatus
                  }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Priority
            </div>

            <div className={styles.infoValue}>
              {order.priority}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardTitle
          }
        >
          Test Parameters
        </h2>

        <table
          className={
            stylesd.dashboardTable
          }
        >
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Result Value</th>
            </tr>
          </thead>

          <tbody>
            {parameters.map(
              (parameter) => (
                <tr
                  key={
                    parameter.id
                  }
                >
                  <td>
                    {
                      parameter.parameter_name
                    }
                  </td>

                  <td>
                    {parameter.unit ||
                      "-"}
                  </td>

                  <td>
                    {parameter.reference_range ||
                      "-"}
                  </td>

                  <td>
                    <input
                      className={
                        styles.input
                      }
                      type="text"
                      value={
                        values[
                        parameter.id
                        ] || ""
                      }
                      onChange={(
                        e
                      ) =>
                        handleChange(
                          parameter.id,
                          e.target.value
                        )
                      }
                      placeholder="Enter value"
                    />
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <div
          style={{
            display: "flex",
            justifyContent:
              "center",
            marginTop: "25px",
          }}
        >
          <button
            className={
              styles.button
            }
            onClick={
              submitResults
            }
          >
            Submit Results
          </button>
        </div>
      </div>
    </div>
  );

}