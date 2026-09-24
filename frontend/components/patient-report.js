"use client";
import stylesd from "@/components/dashboard.module.css"
import { useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import styles from "@/components/manage.module.css";
export default function PatientReports({ role }) {
  const [phone, setPhone] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patient, setPatient] = useState(null);
  const [reports, setReports] = useState({});
  const [expandedVisit, setExpandedVisit] =
    useState(null);

  const searchPatients = async (value) => {
    setPhone(value);

    if (value.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await apiFetch(
        `${API_BASE}/patients/search/${value}`
      );

      const data = await response.json();

      setSuggestions(data);
    } catch (error) {
      console.error(error);
    }
  };

  const selectPatient = async (selectedPatient) => {
    setPatient(selectedPatient);
    setSuggestions([]);
    setExpandedVisit(null);

    try {
      const response = await apiFetch(
        `${API_BASE}/lab-results/patient/${selectedPatient.id}`
      );

      const data = await response.json();

      setReports(data);
    } catch (error) {
      console.error(error);
    }
  };
  const downloadVisitPDF = async (
    patientId,
    visitDate
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_BASE}/lab-results/visit-pdf/${patientId}/${visitDate}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `Visit_Report_${visitDate}.pdf`;

      link.click();
    } catch (error) {
      console.error(error);
    }
  };
  const tot_amt_per_visit = (visit_date) => {
    var tot = 0;
    reports[visit_date].map(test => {
      tot += test.test_price;
    });
    return tot;
  }

  return (
    <div className={styles.container}>
      <div className={stylesd.dashboardHeading}>
        <div>
          <h1 className={stylesd.dashboardTitle}>
            Patient Reports
          </h1>

          <p className={stylesd.dashboardSubtitle}>
            Search and view patient visit reports
          </p>
        </div>
      </div>
      <div className={styles.reportCard}>
        <h2 className={styles.sub_title}>
          Search Patient
        </h2>

        <input
          className={styles.searchInput}
          type="search"
          placeholder="Enter mobile number..."
          value={phone}
          onChange={(e) => searchPatients(e.target.value)}
        />
        {/* </div> */}

        {suggestions.length > 0 && (
          <div
            style={{
              marginTop: "10px",
              border:
                "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {suggestions.map(
              (patient) => (
                <div
                  key={patient.id}
                  onClick={() =>
                    selectPatient(
                      patient
                    )
                  }
                  style={{
                    padding:
                      "12px",
                    cursor:
                      "pointer",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <strong
                    className={styles.sub_title}
                  >
                    {
                      patient.first_name
                    }{" "}
                    {
                      patient.last_name
                    }
                  </strong>

                  <br />

                  <small
                    className={styles.topic}
                  >
                    {
                      patient.phone
                    }
                  </small>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Patient Details */}

      {patient && (
        <div className={styles.patientSummary}>
          <h1 className={styles.patientName}>
            {patient.first_name} {patient.last_name}
          </h1>

          <div className={styles.patientInfoGrid}>
            <div className={styles.patientInfoItem}>
              <span>Patient ID</span>
              <strong>{patient.id}</strong>
            </div>

            <div className={styles.patientInfoItem}>
              <span>Mobile</span>
              <strong>{patient.phone}</strong>
            </div>

            <div className={styles.patientInfoItem}>
              <span>Gender</span>
              <strong>{patient.gender}</strong>
            </div>

            <div className={styles.patientInfoItem}>
              <span>Blood Group</span>
              <strong>{patient.blood_group}</strong>
            </div>
          </div>
        </div>
      )}

      {Object.keys(reports).length > 0 &&
        Object.keys(reports).map(
          (visitDate) => (
            <div
              key={visitDate}
              className={styles.visitCard}
            >
              <div
                className={styles.visitHeader}
                onClick={() =>
                  setExpandedVisit(
                    expandedVisit ===
                      visitDate
                      ? null
                      : visitDate
                  )
                }
              >
                <div>
                  <h2
                    className={
                      styles.sub_title
                    }
                  >
                    Visit Date:{" "}
                    {visitDate}
                  </h2>

                  <p
                    className={
                      styles.visitMeta
                    }
                  >
                    {
                      reports[
                        visitDate
                      ].length
                    }{" "}
                    Test(s)
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "15px",
                  }}
                >
                  <button
                    className={
                      styles.visitDownloadBtn
                    }
                    onClick={(e) => {
                      e.stopPropagation();

                      downloadVisitPDF(
                        patient.id,
                        visitDate
                      );
                    }}
                  >
                    Download PDF
                  </button>

                  <span
                    className={
                      styles.expandIcon
                    }
                  >
                    {expandedVisit ===
                      visitDate
                      ? "▲"
                      : "▼"}
                  </span>
                </div>
              </div>

              {expandedVisit ===
                visitDate && (
                  <div
                    style={{
                      padding:
                        "10px 20px 20px 20px",
                    }}
                  >
                    {(role === "Receptionist" || role === "Administrator") && (
                      <div
                        className={styles.reportCard}
                        style={{
                          marginBottom: "20px",
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong
                            style={{
                              fontSize: "25px",
                              color: "#1e293b",
                            }}
                          >
                            Total Bill
                          </strong>
                          <br />
                          <br />
                          <span
                            style={{
                              color: "#16a34a",
                              fontSize: "24px",
                              fontWeight: "700",
                              marginLeft: "10px",
                            }}
                          >
                            ₹{tot_amt_per_visit(visitDate)}
                          </span>
                        </div>

                        <div>
                          <strong
                            style={{
                              fontSize: "25px",
                              color: "#1e293b",
                            }}
                          >
                            Total Tests
                          </strong>
                          <br />
                          <br />
                          <strong
                            style={{
                              fontSize: "25px",
                              color: "#1e293b",
                              marginLeft: "58px",
                            }}
                          >
                            {reports[visitDate].length}
                          </strong>
                        </div>
                      </div>
                    )}
                    {reports[
                      visitDate
                    ].map(
                      (
                        test,
                        index
                      ) => (
                        <div
                          key={index}
                          className={
                            styles.testCard
                          }
                        >
                          <div
                            className={
                              styles.testHeader
                            }
                          >
                            <h3
                              className={
                                styles.testTitle
                              }
                            >
                              {
                                test.test_name
                              }
                              {(role === "Receptionist" || role === "Administrator") && (
                                <span
                                  style={{
                                    background: "#dcfce7",
                                    color: "#15803d",
                                    padding: "8px 14px",
                                    borderRadius: "8px",
                                    fontWeight: "700",
                                    marginLeft: "10px",
                                  }}
                                >
                                  ₹{test.test_price}
                                </span>
                              )}
                            </h3>

                            <div
                              className={
                                styles.reportMeta
                              }
                            >
                              <span>
                                Entered By:{" "}
                                {
                                  test.entered_by
                                }
                              </span>

                              <span>
                                Verified
                                By:{" "}
                                {
                                  test.verified_by
                                }
                              </span>
                            </div>
                          </div>

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
                                  Reference
                                  Range
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {test.parameters.map(
                                (
                                  parameter,
                                  i
                                ) => (
                                  <tr
                                    key={
                                      i
                                    }
                                  >
                                    <td>
                                      {
                                        parameter.parameter
                                      }
                                    </td>

                                    <td>
                                      {
                                        parameter.value
                                      }
                                    </td>

                                    <td>
                                      {
                                        parameter.unit
                                      }
                                    </td>

                                    <td>
                                      {
                                        parameter.reference
                                      }
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}

                  </div>
                )}
            </div>
          )
        )}


    </div>
  );
}