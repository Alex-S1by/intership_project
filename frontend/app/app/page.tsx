"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import Form from "../../components/Forms";
import Table from "../../components/Tables";
import DashboardView from "@/components/DashboardView";
import { useLang } from "@/lib/uselang";

type Page = {
  type: string;
  entity: string;
  stats?: any[];
};

export default function Home() {
  const [config, setConfig] = useState<any>(null);
  const [selectedMap, setSelectedMap] = useState<Record<string, any>>({});
  const [refreshMap, setRefreshMap] = useState<Record<string, number>>({});
  const { lang, changeLang, t } = useLang();

  const exportConfig = async () => {
    try {
      const config = localStorage.getItem("appConfig");

      if (!config) {
        alert("No config found");
        return;
      }

      const formatted = JSON.stringify(JSON.parse(config), null, 2);

      await navigator.clipboard.writeText(formatted);

      alert("Config copied to clipboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to copy");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("appConfig");

    if (stored) {
      try {
        setConfig(JSON.parse(stored));
      } catch {
        console.error("Invalid config in localStorage");
      }
    }
  }, []);

  if (!config) {
    return <p style={{ textAlign: "center" }}>No config loaded</p>;
  }

  return (
    <Dashboard>
      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {/* TITLE */}
          <h1
            style={{
              textAlign: "center",
              margin: 0,
              fontSize: "20px",
            }}
          >
            {config.appName || t.title}
          </h1>

          {/* CONTROLS */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <select
              value={lang}
              onChange={(e) =>
                changeLang(
                  e.target.value as
                    | "en"
                    | "es"
                    | "hi"
                    | "ml"
                    | "fr"
                    | "de"
                    | "ja",
                )
              }
              style={{
                padding: "6px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "13px",
              }}
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="hi">HI</option>
              <option value="ml">ML</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="ja">JA</option>
            </select>

            <button
              onClick={exportConfig}
              style={{
                padding: "6px 12px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              {t.export}
            </button>
          </div>
        </div>
        {Object.keys(config.entities || {}).map((entity) => {
          const fields = config.entities?.[entity]?.fields || {};

          const selected = selectedMap[entity] || null;

          const setSelected = (item: any) => {
            setSelectedMap((prev) => ({
              ...prev,
              [entity]: item,
            }));
          };

          const refresh = () => {
            setRefreshMap((prev) => ({
              ...prev,
              [entity]: (prev[entity] || 0) + 1,
            }));
          };

          return (
            <div key={entity} style={{ marginBottom: "40px" }}>
              {/* DASHBOARD */}
              {config.ui?.pages
                ?.filter(
                  (p: Page) => p.type === "dashboard" && p.entity === entity,
                )
                .map((page: { stats: any }, i: any) => (
                  <DashboardView
                    key={i}
                    entity={entity}
                    stats={page.stats || []}
                    lang={lang}
                  />
                ))}

              {/* FORM */}
              <Form
                entity={entity}
                fields={fields}
                selected={selected}
                onRefresh={refresh}
                clearSelection={() =>
                  setSelectedMap((prev) => ({
                    ...prev,
                    [entity]: null,
                  }))
                }
                lang={lang}
              />

              {/* TABLE */}
              <Table
                entity={entity}
                onSelect={setSelected}
                fields={fields}
                refreshKey={refreshMap[entity]}
                lang={lang}
              />
            </div>
          );
        })}
      </div>
    </Dashboard>
  );
}
