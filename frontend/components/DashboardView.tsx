"use client";

import { useEffect, useState } from "react";

export default function DashboardView({ entity, stats = [] }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/${entity}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })

      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [entity]);

  if (loading) return <p>Loading dashboard...</p>;

  const computeStat = (stat: any) => {


    if (stat.type === "count") return data.length;

    if (stat.type === "field_count") {
      return data.length > 0 ? Object.keys(data[0]).length : 0;
    }

    return "N/A";
  };

  return (
    <div>
      <h2 style={{ marginBottom: "15px" }}>{entity} Dashboard</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {stats.length === 0 ? (
          <div>No stats configured</div>
        ) : (
          stats.map((stat: any, i: number) => (
            <div
              key={i}
              style={{
                padding: "20px",
                minWidth: "150px",
                background: "white",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ fontSize: "14px", color: "#666" }}>
                {stat.label || "Stat"}
              </div>

              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                {computeStat(stat)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}