"use client";
import styles from "@/components/manage.module.css";
import stylesd from "@/components/dashboard.module.css"
import { useEffect, useState } from "react";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "../utils/constants";
export default function ManagePatients() {
  const [patients, setPatients] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [patient, setPatient] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    gender: "Male",
    phone: "",
    email: "",
    address: "",
    blood_group: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await apiFetch(`${API_BASE}/patients/`);

      const data = await response.json();

      setPatients(
        data.sort((a, b) => a.id - b.id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setPatient({
      first_name: "",
      last_name: "",
      dob: "",
      gender: "Male",
      phone: "",
      email: "",
      address: "",
      blood_group: ""
    });
  };

  const addPatient = async () => {
    try {
      const response = await apiFetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...patient
        }),
      }
      );

      if (response.ok) {
        alert("Patient Added Successfully");
        resetForm();
        fetchPatients();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePatient = async () => {
    try {
      const response = await apiFetch(
        `${API_BASE}/patients/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...patient
          }),
        }
      );

      if (response.ok) {
        alert("Patient Updated");

        resetForm();
        fetchPatients();
      } else {
        alert("Update Failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePatient = async (id) => {
    const confirmDelete = confirm(
      "Delete this patient?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`${API_BASE}/patients/${id}`, {
        method: "DELETE",
      });

      alert("Patient Deleted");

      fetchPatients();
    } catch (error) {
      console.error(error);
    }
  };

  const editPatient = (patientData) => {
    setSelectedPatient(null);

    setEditingId(patientData.id);

    setPatient({
      first_name: patientData.first_name || "",
      last_name: patientData.last_name || "",
      dob: patientData.dob || "",
      gender: patientData.gender || "Male",
      phone: patientData.phone || "",
      email: patientData.email || "",
      address: patientData.address || "",
      blood_group: patientData.blood_group || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const viewPatient = (patientData) => {
    setSelectedPatient(patientData);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };



  return (
    <div className={styles.container}>
      {selectedPatient ? (
        <div className={styles.card}>
          <div className={stylesd.dashboardHeading}>
            <div>
              <h1 className={stylesd.dashboardTitle}>
                Patient Details
              </h1>

              <p className={stylesd.dashboardSubtitle}>
                Complete patient information
              </p>
            </div>
          </div>

          <div className={styles.patientCard}>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>ID</div>
              <div className={styles.infoValue}>{selectedPatient.id}</div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>First Name</div>
              <div className={styles.infoValue}>{selectedPatient.first_name}</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>last Name</div>
              <div className={styles.infoValue}>{selectedPatient.last_name}</div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Date-OF-Birth</div>
              <div className={styles.infoValue}>{selectedPatient.dob}</div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Gender</div>
              <div className={styles.infoValue}>{selectedPatient.gender}</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Blood Group</div>
              <div className={styles.infoValue}>{selectedPatient.blood_group}</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Email</div>
              <div className={styles.infoValue}>{selectedPatient.email}</div>
            </div>
            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Phone</div>
              <div className={styles.infoValue}>{selectedPatient.phone}</div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.infoLabel}>Address</div>
              <div className={styles.infoValue}>{selectedPatient.address}</div>
            </div>
          </div>

          <br />

          <button
            className={styles.button}
            onClick={() => setSelectedPatient(null)}
          >
            Close
          </button>
        </div>
      ) : (
        <>
          <div className={stylesd.dashboardHeading}>
            <div>
              <h1 className={stylesd.dashboardTitle}>
                Manage Patients
              </h1>

              <p className={stylesd.dashboardSubtitle}>
                Register, update and manage patient records
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
              {editingId ? "Update Patient" : "Add Patient"}
            </h2>

            <div className={styles.form}>
              <input
                className={styles.input}
                placeholder="First Name"
                value={patient.first_name}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    first_name: e.target.value,
                  })
                }
              />

              <input
                className={styles.input}
                placeholder="Last Name"
                value={patient.last_name}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    last_name: e.target.value,
                  })
                }
              />

              <input
                className={styles.input}
                type="date"
                value={patient.dob}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    dob: e.target.value,
                  })
                }
              />

              <select
                className={styles.select}
                value={patient.gender}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    gender: e.target.value,
                  })
                }
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                className={styles.input}
                placeholder="Phone"
                value={patient.phone}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    phone: e.target.value,
                  })
                }
              />

              <input
                className={styles.input}
                placeholder="Email"
                value={patient.email}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    email: e.target.value,
                  })
                }
              />

              <input
                className={styles.input}
                placeholder="Address"
                value={patient.address}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    address: e.target.value,
                  })
                }
              />
              <input
                className={styles.input}
                placeholder="Blood Group"
                value={patient.blood_group}
                onChange={(e) =>
                  setPatient({
                    ...patient,
                    blood_group: e.target.value,
                  })
                }
              />
            </div>

            <br />

            {editingId ? (
              <>
                <button
                  className={styles.button}
                  onClick={updatePatient}
                >
                  Update Patient
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={resetForm}
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className={styles.button}
                onClick={addPatient}
              >
                Add Patient
              </button>
            )}
          </div>

          <div className={styles.card}>
            <div className={stylesd.toolbar}>
              <div>
                <h2 className={stylesd.dashboardTitle}>
                  Patient Directory
                </h2>

                <p className={stylesd.dashboardSubtitle}>
                  View and manage registered patients
                </p>
              </div>

              <button
                className={styles.refreshBtn}
                onClick={fetchPatients}
              >
                Refresh
              </button>
            </div>
            <span
                className={styles.sub_title}
                style={
                  { marginLeft: "5px" }
                }
              >Search</span>
            <div className={stylesd.toolbar}>
              <input
                className={styles.searchInput}
                type="search"
                style={{marginTop:"5px"}}
                placeholder="Search by Name, Phone, Email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>
            <div className={styles.tableWrapper}>

              <table className={stylesd.dashboardTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient Name</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Blood Group</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                {/* <input type="search"></input> */}
                <tbody>
                  {patients.filter(
                    (patient) =>
                      `${patient.first_name} ${patient.last_name}`
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      patient.phone
                        ?.toLowerCase()
                        .includes(search.toLowerCase()) ||
                      patient.email
                        ?.toLowerCase()
                        .includes(search.toLowerCase())
                  )
                    .map((patient) => (
                      <tr key={patient.id}>
                        <td>{patient.id}</td>
                        <td>{patient.first_name} {patient.last_name}</td>
                        <td>{patient.gender}</td>
                        <td>{patient.phone}</td>
                        <td>{patient.blood_group}</td>

                        <td>
                          <div className={styles.actions}>
                            <button
                              className={styles.viewBtn}
                              onClick={() => viewPatient(patient)}
                            >
                              View
                            </button>

                            <button
                              className={styles.editBtn}
                              onClick={() => editPatient(patient)}
                            >
                              Edit
                            </button>

                            <button
                              className={styles.deleteBtn}
                              onClick={() => deletePatient(patient.id)}
                            >
                              Delete
                            </button>
                          </div>
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