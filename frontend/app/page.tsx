"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLoad = () => {

    if(!isLoggedIn) {
      alert("Please login to load config");
      router.push("/login");
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      localStorage.setItem("appConfig", JSON.stringify(parsed));
      router.push("/app");
    } catch {
      setError("Invalid JSON");
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f5f5f5" }}>
      
      {/* 🔥 HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "15px 30px",
          background: "black",
          color: "white"
        }}
      >
        <h2>App Builder</h2>

        <div>
          {isLoggedIn ? (
            <>
              <button
                onClick={() => router.push("/profile")}
                style={headerBtn}
              >
                Profile
              </button>

              <button onClick={logout} style={headerBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/login")}
                style={headerBtn}
              >
                Login
              </button>

              <button
                onClick={() => router.push("/register")}
                style={headerBtn}
              >
                Signup
              </button>
            </>
          )}
        </div>
      </div>

      {/* 🔥 MAIN CONTENT */}
      <div
        style={{
          maxWidth: "800px",
          margin: "60px auto",
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
        }}
      >
        <h1 style={{ textAlign: "center" }}>Build Your App</h1>

        <p style={{ textAlign: "center", color: "#666" }}>
          Paste your JSON configuration to generate an app
        </p>

        <textarea
          rows={15}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontFamily: "monospace"
          }}
          placeholder="Paste your JSON config here..."
          onChange={(e) => setJsonInput(e.target.value)}
        />

        <button
          onClick={handleLoad}
          style={{
            marginTop: "15px",
            padding: "12px 20px",
            background: "black",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            width: "100%"
          }}
        >
          Generate App
        </button>

        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}
      </div>
    </div>
  );
}

// 🔹 reusable button style
const headerBtn = {
  marginLeft: "10px",
  padding: "6px 12px",
  background: "white",
  color: "black",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer"
};