import React, { useMemo } from "react";

export default function EventTypeDistribution({ feed }) {
  const distribution = useMemo(() => {
    const counts = {};
    feed.forEach((event) => {
      const key = event.action || "unknown";
      counts[key] = (counts[key] || 0) + 1;
    });

    const total = feed.length || 1;
    return Object.entries(counts)
      .map(([action, count]) => ({
        action,
        count,
        percentage: ((count / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [feed]);

  const colors = [
    "#22d3ee",
    "#a78bfa",
    "#fb923c",
    "#10b981",
    "#f59e0b",
  ];

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
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "16px",
        }}
      >
        🎯 Event Type Distribution
      </div>

      {distribution.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            opacity: 0.5,
          }}
        >
          No events to display
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {distribution.map((item, i) => (
            <div key={item.action}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                  fontSize: "14px",
                }}
              >
                <span style={{ fontWeight: 600 }}>{item.action}</span>
                <span style={{ opacity: 0.7 }}>
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  background: "rgba(30, 41, 59, 0.8)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.percentage}%`,
                    background: colors[i % colors.length],
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}