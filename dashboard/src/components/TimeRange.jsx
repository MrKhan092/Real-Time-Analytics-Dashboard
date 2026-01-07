import React from "react";

export default function TimeRange({ value, onChange }) {
  const options = [
    { value: 15, label: "15 seconds" },
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 300, label: "5 minutes" },
    { value: 600, label: "10 minutes" },
  ];

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(10px)",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid rgba(148, 163, 184, 0.1)",
      }}
    >
      <label
        style={{
          color: "#94a3b8",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        ⏱️ Time Window:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          padding: "6px 12px",
          background: "rgba(30, 41, 59, 0.8)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "6px",
          color: "#e2e8f0",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          outline: "none",
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#22d3ee";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(148, 163, 184, 0.2)";
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}