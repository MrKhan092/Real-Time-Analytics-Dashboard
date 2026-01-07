import React from "react";

export default function FilterBar({ filter, onChange }) {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontWeight: 600, fontSize: "14px", opacity: 0.8 }}>
        🔍 Filter Events:
      </div>

      <input
        type="text"
        placeholder="Filter by route (e.g., /products)"
        value={filter.route}
        onChange={(e) => onChange({ ...filter, route: e.target.value })}
        style={{
          flex: 1,
          minWidth: "200px",
          padding: "8px 12px",
          background: "rgba(30, 41, 59, 0.8)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "8px",
          color: "#e2e8f0",
          fontSize: "14px",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#22d3ee";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(148, 163, 184, 0.2)";
        }}
      />

      <input
        type="text"
        placeholder="Filter by action (e.g., click)"
        value={filter.action}
        onChange={(e) => onChange({ ...filter, action: e.target.value })}
        style={{
          flex: 1,
          minWidth: "200px",
          padding: "8px 12px",
          background: "rgba(30, 41, 59, 0.8)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          borderRadius: "8px",
          color: "#e2e8f0",
          fontSize: "14px",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#22d3ee";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(148, 163, 184, 0.2)";
        }}
      />

      {(filter.route || filter.action) && (
        <button
          onClick={() => onChange({ route: "", action: "" })}
          style={{
            padding: "8px 16px",
            background: "rgba(239, 68, 68, 0.2)",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(239, 68, 68, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(239, 68, 68, 0.2)";
          }}
        >
          ✕ Clear
        </button>
      )}
    </div>
  );
}