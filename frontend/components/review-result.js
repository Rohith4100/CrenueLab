"use client";
import stylesd from "@/components/dashboard.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/manage.module.css";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import CompletedOrders from "./completed-orders";

export default function ReviewResult({
  resultId,
}) {
  const router = useRouter();

  const [result, setResult] =
    useState(null);

  const [items, setItems] =
    useState([]);

  const [parameters, setParameters] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const response =
        await apiFetch(
          `${API_BASE}/lab-results/${resultId}/details`
        );

      const data =
        await response.json();

      setResult(data.result);
      setItems(data.items);

      await fetchParameters();

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchParameters =
    async () => {
      try {
        const response =
          await apiFetch(
            `${API_BASE}/test-parameters`
          );

        const data =
          await response.json();

        setParameters(data);
      } catch (error) {
        console.error(error);
      }
    };

  const getParameter = (
    parameterId
  ) => {
    return parameters.find(
      (p) => p.id === parameterId
    );
  };



  const verifyResult =
    async () => {
      const verifierId =
        Number(
          localStorage.getItem(
            "user_id"
          )
        );

      try {
        const response =
          await apiFetch(
            `${API_BASE}/lab-results/${resultId}`,
            {
              method: "PATCH",
              body: JSON.stringify({
                verified_by:
                  verifierId,
                status:
                  "Verified",
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          alert(
            data.detail
          );
          return;
        }

        alert(
          "Result Verified"
        );

        router.push(
          "/pathologist/pending-results"
        );
      } catch (error) {
        console.error(error);
      }
    };

  const rejectResult = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/lab-results/${resultId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: "Rejected",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail);
        return;
      }

      alert("Result Rejected");

      router.push(
        "/pathologist/pending-results"
      );
    } catch (error) {
      console.error(error);
    }
  };


  if (loading) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  // return (
  //   <div className={styles.container}>
  //     <h1 className={styles.title}>
  //       Review Result
  //     </h1>

  //     <div className={styles.card}>
  //       <h3>
  //         Result ID:
  //         {" "}
  //         {result.id}
  //       </h3>

  //       <p>
  //         Order ID:
  //         {" "}
  //         {result.order_id}
  //       </p>

  //       <p>
  //         Entered By:
  //         {" "}
  //         {result.entered_by}
  //       </p>

  //       <p>
  //         Status:
  //         {" "}
  //         {result.status}
  //       </p>
  //     </div>

  //     <div className={styles.card}>
  //       <h2>
  //         Parameter Values
  //       </h2>

  //       <table
  //         className={
  //           styles.table
  //         }
  //       >
  //         <thead>
  //           <tr>
  //             <th>
  //               Parameter
  //             </th>
  //             <th>
  //               Value
  //             </th>
  //             <th>
  //               Unit
  //             </th>
  //             <th>
  //               Reference Range
  //             </th>
  //           </tr>
  //         </thead>

  //         <tbody>
  //           {items.map(
  //             (item) => {
  //               const parameter =
  //                 getParameter(
  //                   item.parameter_id
  //                 );

  //               return (
  //                 <tr
  //                   key={
  //                     item.id
  //                   }
  //                 >
  //                   <td>
  //                     {parameter?.parameter_name}
  //                   </td>

  //                   <td>
  //                     {
  //                       item.parameter_value
  //                     }
  //                   </td>

  //                   <td>
  //                     {parameter?.unit}
  //                   </td>

  //                   <td>
  //                     {
  //                       parameter?.reference_range
  //                     }
  //                   </td>
  //                 </tr>
  //               );
  //             }
  //           )}
  //         </tbody>
  //       </table>

  //       <br />

  //       {result.status !== "Verified" &&
  //         result.status !== "Rejected" && (
  //           <div
  //             style={{
  //               display: "flex",
  //               gap: "10px",
  //             }}
  //           >
  //             <button
  //               className={styles.button}
  //               onClick={verifyResult}
  //             >
  //               Verify Result
  //             </button>

  //             <button
  //               style={{
  //                 padding: "10px 20px",
  //                 border: "none",
  //                 borderRadius: "6px",
  //                 background: "#dc2626",
  //                 color: "white",
  //                 cursor: "pointer",
  //               }}
  //               onClick={rejectResult}
  //             >
  //               Reject Result
  //             </button>
  //           </div>
  //         )}
  //     </div>
  //   </div>
  // );
  return (
    <div className={styles.container}>
      <div className={stylesd.dashboardHeading}>
        <div>
          <h1 className={stylesd.dashboardTitle}>
            Review Result
          </h1>

          <p className={stylesd.dashboardSubtitle}>
            Verify or reject laboratory findings
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardSectionTitle
          }
        >
          Result Information
        </h2>

        <div className={styles.patientCard}>
          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Result ID
            </div>

            <div className={styles.infoValue}>
              {result.id}
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Order ID
            </div>

            <div className={styles.infoValue}>
              {result.order_id}
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Entered By
            </div>

            <div className={styles.infoValue}>
              {result.entered_by}
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Status
            </div>

            <div className={styles.infoValue}>
              <span
                className={`${stylesd.statusBadge}
              ${result.status ===
                    "Verified"
                    ? stylesd.verifiedStatus
                    : result.status ===
                      "Rejected"
                      ? stylesd.rejectedStatus
                      : stylesd.completedStatus
                  }`}
              >
                {result.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardSectionTitle
          }
        >
          Parameter Values
        </h2>

        <table
          className={
            stylesd.dashboardTable
          }
        >
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Reference Range</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => {
              const parameter =
                getParameter(
                  item.parameter_id
                );

              return (
                <tr
                  key={item.id}
                >
                  <td>
                    {
                      parameter?.parameter_name
                    }
                  </td>

                  <td>
                    {
                      item.parameter_value
                    }
                  </td>

                  <td>
                    {
                      parameter?.unit
                    }
                  </td>

                  <td>
                    {
                      parameter?.reference_range
                    }
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {result.status !==
          "Verified" &&
          result.status !==
          "Rejected" && (
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "25px",
                justifyContent:
                  "center",
              }}
            >
              <button
                className={
                  styles.button
                }
                onClick={
                  verifyResult
                }
              >
                Verify Result
              </button>

              <button
                className={
                  styles.deleteBtn
                }
                style=
                {
                  {background:"#dc2626"}
                  // {color:"white"}
                }
                onClick={
                  rejectResult
                }
              >
                Reject Result
              </button>
            </div>
          )}
      </div>
    </div>
  );
}