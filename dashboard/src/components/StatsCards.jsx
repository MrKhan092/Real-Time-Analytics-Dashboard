import React from "react";

export default function StatsCards({ agg, peakEventsPerSec }) {
  const cards = [
    {
      label: "Events (1s)",
      value: agg.last1s || 0,
      icon: "⚡",
      color: "#22d3ee",
      bg: "rgba(34, 211, 238, 0.1)",
    },
    {
      label: "Events (5s)",
      value: agg.last5s || 0,
      icon: "📊",
      color: "#a78bfa",
      bg: "rgba(167, 139, 250, 0.1)",
    },
    {
      label: "Events (60s)",
      value: agg.last60s || 0,
      icon: "📈",
      color: "#fb923c",
      bg: "rgba(251, 146, 60, 0.1)",
    },
    {
      label: "Active Users",
      value: agg.activeUsers || 0,
      icon: "👥",
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    {
      label: "Peak Events/s",
      value: peakEventsPerSec?.toFixed(1) || 0,
      icon: "🚀",
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Error Rate",
      value: `${((agg.errorRate || 0) * 100).toFixed(1)}%`,
      icon: "⚠️",
      color: agg.errorRate > 0.05 ? "#ef4444" : "#10b981",
      bg:
        agg.errorRate > 0.05
          ? "rgba(239, 68, 68, 0.1)"
          : "rgba(16, 185, 129, 0.1)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "16px",
      }}
    >
      {cards.map((card, i) => (
        <div
          key={i}
          style={{
            background: card.bg,
            backdropFilter: "blur(10px)",
            border: `1px solid ${card.color}40`,
            borderRadius: "12px",
            padding: "20px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = `0 8px 20px ${card.color}30`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px",
            }}
          >
            <span style={{ fontSize: "12px", opacity: 0.7, fontWeight: 600 }}>
              {card.label}
            </span>
            <span style={{ fontSize: "24px" }}>{card.icon}</span>
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: card.color,
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}