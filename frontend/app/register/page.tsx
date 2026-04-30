"use client";

import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const register = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      setMessage("Account created successfully! You can login now.");
      setEmail("");
      setPassword("");
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

      <div style={{ marginBottom: "15px" }}>
        <label>Email</label>
        <input
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Password</label>
        <input
          style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

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

      {message && (
        <p style={{ marginTop: "15px", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
}