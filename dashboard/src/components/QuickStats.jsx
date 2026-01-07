import React from "react";

export default function QuickStats({ feed, series, agg }) {
  const stats = [
    {
      label: "Total Events Today",
      value: feed.length,
      icon: "📊",
      change: "+12%",
      positive: true,
    },
    {
      label: "Avg Response Time",
      value: "245ms",
      icon: "⚡",
      change: "-8%",
      positive: true,
    },
    {
      label: "Peak Traffic",
      value: series.length > 0 ? Math.max(...series.map((s) => s.v)).toFixed(1) : 0,
      icon: "🚀",
      change: "+23%",
      positive: true,
    },
    {
      label: "Uptime",
      value: "99.9%",
      icon: "✅",
      change: "Stable",
      positive: true,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "12px",
        marginBottom: "16px",
      }}
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(10px)",
            borderRadius: "12px",
            padding: "16px",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(34, 211, 238, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "28px" }}>{stat.icon}</span>
            <span
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "4px",
                background: stat.positive
                  ? "rgba(16, 185, 129, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
                color: stat.positive ? "#10b981" : "#ef4444",
                fontWeight: 600,
              }}
            >
              {stat.change}
            </span>
          </div>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>
            {stat.label}
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#22d3ee" }}>
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}