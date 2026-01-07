import React from "react";

export default function TopTable({ title, rows = [], keyField = "route", valueField = "count" }) {
  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid rgba(148, 163, 184, 0.1)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: "16px",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {title}
      </div>

      {rows.length === 0 ? (
        <div
          style={{
            color: "#94a3b8",
            textAlign: "center",
            padding: "40px 20px",
            opacity: 0.7,
          }}
        >
          📊 No data available
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {rows.map((r, i) => {
            const key = r[keyField] || r._id || `item-${i}`;
            const value = r[valueField] || 0;
            const maxValue = Math.max(...rows.map(row => row[valueField] || 0));
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;

            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(30, 41, 59, 0.4)",
                  overflow: "hidden",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.6)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.4)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                {/* Background bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${percentage}%`,
                    background: "rgba(34, 211, 238, 0.1)",
                    transition: "width 0.3s ease",
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      color: "#e2e8f0",
                      fontWeight: 600,
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      flex: 1,
                    }}
                  >
                    {i + 1}. {key}
                  </div>
                  <div
                    style={{
                      color: "#22d3ee",
                      fontWeight: 700,
                      fontSize: "16px",
                      marginLeft: "12px",
                    }}
                  >
                    {value.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}