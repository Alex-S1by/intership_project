"use client";

import { useEffect, useState, CSSProperties } from "react";
import { useLang } from "@/lib/uselang";

type FormProps = {
  entity: string;
  fields: any;
  selected?: any;
  onRefresh?: () => void;
  clearSelection?: () => void;
  lang?: string;
};

export default function Form({
  entity,
  fields,
  selected,
  onRefresh,
  clearSelection,
  lang
}: FormProps) {
  const [formData, setFormData] = useState<any>({});
  const [localFields, setLocalFields] = useState(fields);

  const token = localStorage.getItem("token");
  const isEdit = !!selected?.id;
  const { t } = useLang();

  useEffect(() => {
    setLocalFields(fields);

    if (selected) setFormData(selected);
    else setFormData({});
  }, [selected, fields, lang]); 

  // ================= CRUD =================

  const submit = async () => {
    const url = isEdit
      ? `http://localhost:4000/${entity}/${selected.id}`
      : `http://localhost:4000/${entity}`;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    setFormData({});
    clearSelection?.();
    onRefresh?.();
  };

  const handleDelete = async () => {
    if (!selected?.id) return;

    await fetch(`http://localhost:4000/${entity}/${selected.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setFormData({});
    clearSelection?.();
    onRefresh?.();
  };

  // ================= FIELD EDIT =================

  const saveFields = () => {
    const config = JSON.parse(localStorage.getItem("appConfig") || "{}");
    config.entities[entity].fields = localFields;
    localStorage.setItem("appConfig", JSON.stringify(config));

    alert("Fields updated!");
    onRefresh?.();
  };

  return (
    <div style={container}>
      <h2 style={title}>
        {entity} {isEdit ? t.update : t.form}
      </h2>

      {/* 🔥 FIELD EDITOR */}
      <div style={card}>
        <h3 style={subtitle}>{t.manageFields}</h3>

        {Object.entries(localFields).map(([key, fieldConfig]: any) => (
          <div key={key} style={row}>
            <input
              value={
                typeof fieldConfig.label === "object"
                  ? fieldConfig.label?.[lang!] || ""
                  : fieldConfig.label
              }
              onChange={(e) => {
                const value = e.target.value;

                setLocalFields({
                  ...localFields,
                  [key]: {
                    ...fieldConfig,
                    label:
                      typeof fieldConfig.label === "object"
                        ? {
                            ...fieldConfig.label,
                            [lang!]: value
                          }
                        : value
                  }
                });
              }}
              style={inputSmall}
            />

            <button
              onClick={() => {
                const updated = { ...localFields };
                delete updated[key];
                setLocalFields(updated);
              }}
              style={dangerBtn}
            >
              {t.deleteField}
            </button>
          </div>
        ))}

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <button
            onClick={() => {
              const name = prompt("Field name?");
              if (!name) return;

              setLocalFields({
                ...localFields,
                [name]: {
                  type: "text",
                  label: {
                    en: name,
                    es: name
                  }
                }
              });
            }}
            style={secondaryBtn}
          >
            + {t.addField}
          </button>

          <button onClick={saveFields} style={primaryBtn}>
            {t.saveFields}
          </button>
        </div>
      </div>

      {/* 🔥 FORM INPUTS */}
      <div style={card}>
        {Object.entries(localFields).map(([field, fieldConfig]: any) => {
          const labelText =
            fieldConfig.label?.[lang!] ||
            fieldConfig.label ||
            field;

          return (
            <div key={field} style={{ marginBottom: "12px" }}>
              <label style={label}>{labelText}</label>

              <input
                value={formData[field] || ""}
                placeholder={`Enter ${labelText}`}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [field]: e.target.value
                  })
                }
                style={input}
              />
            </div>
          );
        })}

        <div style={{ marginTop: "15px" }}>
          <button onClick={submit} style={primaryBtn}>
            {isEdit ? t.update : t.add}
          </button>

          {isEdit && (
            <button onClick={handleDelete} style={dangerBtn}>
              {t.deleteField}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

//
// 🎨 STYLES (UNCHANGED)
//

const container = {
  background: "#f9fafb",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px"
};

const title = {
  marginBottom: "15px"
};

const subtitle = {
  marginBottom: "10px",
  fontSize: "16px",
  fontWeight: "600"
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  marginBottom: "20px"
};

const row = {
  display: "flex",
  gap: "10px",
  marginBottom: "8px"
};

const label = {
  display: "block",
  marginBottom: "4px",
  fontWeight: "500"
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd"
};

const inputSmall = {
  flex: 1,
  padding: "6px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const primaryBtn = {
  background: "#111",
  color: "white",
  padding: "8px 14px",
  borderRadius: "6px",
  border: "none",
  marginRight: "10px",
  cursor: "pointer"
};

const secondaryBtn = {
  background: "#eee",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "none",
  marginRight: "10px",
  cursor: "pointer"
};

const dangerBtn = {
  background: "#ef4444",
  color: "white",
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer"
};