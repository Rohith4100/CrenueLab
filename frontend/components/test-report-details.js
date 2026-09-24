"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css";
export default function ReportDetails({
  resultId,
}) {
  const [report, setReport] =
    useState(null);

  const [parameters, setParameters] =
    useState([]);

  useEffect(() => {
    fetchReport();
    fetchParameters();
  }, []);

  const fetchReport = async () => {
    try {
      const response =
        await apiFetch(
          `${API_BASE}/lab-results/report/${resultId}`
        );

      const data =
        await response.json();

      setReport(data);
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

  const getParameter =
    (parameterId) =>
      parameters.find(
        (p) =>
          p.id === parameterId
      );

  if (!report) {
    return (
      <div>
        Loading...
      </div>
    );
  }

  // return (
  //   <div className={styles.container}>
  //     <h1 className={styles.title}>
  //       Laboratory Report
  //     </h1>

  //     <div className={styles.card}>
  //       <h2>Patient Information</h2>

  //       <p>
  //         <strong>Name:</strong>{" "}
  //         {
  //           report.patient.first_name
  //         }{" "}
  //         {
  //           report.patient.last_name
  //         }
  //       </p>

  //       <p>
  //         <strong>Gender:</strong>{" "}
  //         {report.patient.gender}
  //       </p>

  //       <p>
  //         <strong>Phone:</strong>{" "}
  //         {report.patient.phone}
  //       </p>

  //       <p>
  //         <strong>Blood Group:</strong>{" "}
  //         {
  //           report.patient
  //             .blood_group
  //         }
  //       </p>
  //     </div>

  //     <div className={styles.card}>
  //       <h2>Test Information</h2>

  //       <p>
  //         <strong>Test:</strong>{" "}
  //         {
  //           report.test.test_name
  //         }
  //       </p>

  //       <p>
  //         <strong>Status:</strong>{" "}
  //         {
  //           report.result.status
  //         }
  //       </p>

  //       <p>
  //         <strong>Entered By:</strong>{" "}
  //         {
  //           report.entered_by
  //             ?.first_name
  //         }{" "}
  //         {
  //           report.entered_by
  //             ?.last_name
  //         }
  //       </p>

  //       <p>
  //         <strong>Verified By:</strong>{" "}
  //         {
  //           report.verified_by
  //             ?.first_name
  //         }{" "}
  //         {
  //           report.verified_by
  //             ?.last_name
  //         }
  //       </p>
  //     </div>

  //     <div className={styles.card}>
  //       <h2>Result Values</h2>

  //       <table
  //         className={styles.table}
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
  //           {report.items.map(
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
  //                     {
  //                       parameter?.parameter_name
  //                     }
  //                   </td>

  //                   <td>
  //                     {
  //                       item.parameter_value
  //                     }
  //                   </td>

  //                   <td>
  //                     {
  //                       parameter?.unit
  //                     }
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
  //     </div>
  //   </div>
  // );
  return (
    <div className={styles.container}>
      <div className={stylesd.dashboardHeading}>
        <div>
          <h1 className={stylesd.dashboardTitle}>
            Laboratory Report
          </h1>

          <p className={stylesd.dashboardSubtitle}>
            Detailed patient test report
          </p>
        </div>
      </div>

      <div className={styles.card}>
        <h2
          className={
            stylesd.dashboardSectionTitle
          }
        >
          Patient Information
        </h2>

        <div
          className={styles.patientCard}
        >
          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Patient Name
            </div>

            <div className={styles.infoValue}>
              {
                report.patient.first_name
              }{" "}
              {
                report.patient.last_name
              }
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Gender
            </div>

            <div className={styles.infoValue}>
              {
                report.patient.gender
              }
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Phone
            </div>

            <div className={styles.infoValue}>
              {
                report.patient.phone
              }
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Blood Group
            </div>

            <div className={styles.infoValue}>
              {
                report.patient
                  .blood_group
              }
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
          Test Information
        </h2>

        <div
          className={styles.patientCard}
        >
          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Test Name
            </div>

            <div className={styles.infoValue}>
              {
                report.test.test_name
              }
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Status
            </div>

            <div className={styles.infoValue}>
              {
                report.result.status
              }
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Entered By
            </div>

            <div className={styles.infoValue}>
              {
                report.entered_by
                  ?.first_name
              }{" "}
              {
                report.entered_by
                  ?.last_name
              }
            </div>
          </div>

          <div className={styles.infoBox}>
            <div className={styles.infoLabel}>
              Verified By
            </div>

            <div className={styles.infoValue}>
              {
                report.verified_by
                  ?.first_name
              }{" "}
              {
                report.verified_by
                  ?.last_name
              }
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
          Result Values
        </h2>

        <table
          className={
            stylesd.dashboardTable
          }
        >
          <thead>
            <tr>
              <th>
                Parameter
              </th>

              <th>
                Value
              </th>

              <th>
                Unit
              </th>

              <th>
                Reference Range
              </th>
            </tr>
          </thead>

          <tbody>
            {report.items.map(
              (item) => {
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
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}