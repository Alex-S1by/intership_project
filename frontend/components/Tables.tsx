"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useLang } from "@/lib/uselang";

type TableProps = {
  entity: string;
  onSelect?: (item: any) => void;
  fields: any;
  refreshKey?: number;
  lang?: string;
};

export default function Table({
  entity,
  onSelect,
  refreshKey,
  lang
}: TableProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const token = localStorage.getItem("token");
    const { t } = useLang();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${entity}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const newData = await res.json();
     

      // 🔥 ensure new reference
      setData(Array.isArray(newData) ? [...newData] : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    (async () => {
      if (!active) return;
      await fetchData();
    })();

    return () => {
      active = false;
    };
  }, [entity,refreshKey]);
  const fields=localStorage.getItem("appConfig") ? JSON.parse(localStorage.getItem("appConfig") || "{}").entities?.[entity]?.fields || {} : {};
  const columns = Object.keys(fields || {});

  

  if (loading) return <p style={{ marginTop: 10 }}>Loading...</p>;

  return (
    <div style={container}>
      <h2 style={title}>{entity} </h2>

    <p style={{ marginBottom: 15, color: "#666", fontSize: "14px" }}>*click each fields for edit and delete </p>

      <div style={tableWrapper}>
        <table style={table}>
          <thead style={thead}>
            <tr>
              {columns.map((col) => (
                <th key={col} style={th}>
                  {fields[col]?.label || col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={empty}>
                 {t.noData}
                </td>
              </tr>
            ) : (
              data.map((item, i) => (
                <tr
                  key={item.id ?? i}
                  style={{
                    ...tr,
                    background:
                      selected?.id === item.id ? "#eef2ff" : "white"
                  }}
                  onClick={() => {
                    setSelected(item);
                    onSelect?.(item);
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      selected?.id === item.id ? "#eef2ff" : "white")
                  }
                >
                  {columns.map((col) => (
                    <td key={col} style={td}>
                      {item[col] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

//
// 🎨 STYLES (unchanged)
//

const container = { marginTop: "20px" };

const title = {
  marginBottom: "10px",
  fontSize: "18px",
  fontWeight: "600"
};

const tableWrapper: CSSProperties = {
  overflowX: "auto",
  borderRadius: "10px",
  background: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
};

const table: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse"
};

const thead = { background: "#f9fafb" };

const th = {
  padding: "12px",
  textAlign: "left" as const,
  fontWeight: "600",
  borderBottom: "1px solid #eee",
  fontSize: "14px"
};

const td = {
  padding: "12px",
  borderBottom: "1px solid #f1f1f1",
  fontSize: "14px"
};

const tr = {
  cursor: "pointer",
  transition: "0.2s"
};

const empty = {
  padding: "20px",
  textAlign: "center" as const,
  color: "#888"
};