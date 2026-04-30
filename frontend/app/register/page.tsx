"use client";

import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const newErrors: any = {};

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // 🔥 Email validation
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      newErrors.email = "Invalid email format";
    }

    // 🔥 Password validation
    if (!trimmedPassword) {
      newErrors.password = "Password is required";
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const register = async () => {
    setMessage("");

    // 🔥 validate before API
    if (!validate()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setMessage("Account created successfully! You can login now.");
      setEmail("");
      setPassword("");
      setErrors({});
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "30px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "white"
      }}
    >
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Register
      </h2>

      {/* EMAIL */}
      <div style={{ marginBottom: "15px" }}>
        <label>Email</label>
        <input
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            border: errors.email ? "1px solid red" : "1px solid #ccc"
          }}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "" }));
          }}
        />
        {errors.email && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
            {errors.email}
          </p>
        )}
      </div>

      {/* PASSWORD */}
      <div style={{ marginBottom: "15px" }}>
        <label>Password</label>
        <input
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            border: errors.password ? "1px solid red" : "1px solid #ccc"
          }}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "" }));
          }}
        />
        {errors.password && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
            {errors.password}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={register}
        style={{
          width: "100%",
          padding: "10px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Register
      </button>

      {/* MESSAGE */}
      {message && (
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}