"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";
import { apiFetch } from "@/utils/api";
import { API_BASE } from "../../utils/constants";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters.";
    }
    return newErrors;
  };

  const handleLogin = async () => {
    setLoginError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);
    try {
      const response = await apiFetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || "Invalid email or password.");
        return;
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.setItem(
        "name",
        data.user.first_name + " " + data.user.last_name
      );

      localStorage.setItem(
        "user_id",
        data.user.id
      );

      const roleRoutes = {
        Receptionist: "/receptionist",
        "Lab Technician": "/lab-technician",
        Pathologist: "/pathologist",
        Physician: "/physician",
        Administrator: "/admin",
      };
      if (roleRoutes[data.role]) {
        router.push(roleRoutes[data.role]);
      } else {
        setLoginError("Unrecognized role. Please contact support.");
      }
    } catch (error) {
      alert(error);
      setLoginError("Unable to connect to the server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.backgroundCircle}></div>
      <div className={styles.backgroundCircle2}></div>

      <div className={styles.loginCard}>
        <img
          src="/CrenueLab.png"
          alt="CrenueLab Logo"
          className={styles.logo}
        />

        <div className={styles.divider}></div>

        <h1 className={styles.heading}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to access CrenueLab</p>

        {loginError && (
          <div className={styles.errorBanner}>
            <span className={styles.errorIcon}>⚠</span>
            {loginError}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Email Address</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>✉</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
              }}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
            />
          </div>
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>🔒</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
              }}
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
            />
          </div>
          {errors.password && <span className={styles.errorText}>{errors.password}</span>}
        </div>

        <button
          className={`${styles.loginBtn} ${isLoading ? styles.loading : ""}`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className={styles.spinner}></span>
          ) : (
            "Login"
          )}
        </button>

        <p className={styles.footer}>
          © 2026 CrenueLab · Life Science Analysis
        </p>
      </div>
    </div>
  );
}