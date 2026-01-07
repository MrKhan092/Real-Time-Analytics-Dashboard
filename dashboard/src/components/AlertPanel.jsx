import React, { useMemo } from "react";

export default function AlertPanel({ agg, series }) {
  const alerts = useMemo(() => {
    const alertList = [];

    if (agg.errorRate > 0.05) {
      alertList.push({
        level: "error",
        title: "High Error Rate",
        message: `Error rate is ${(agg.errorRate * 100).toFixed(1)}% (threshold: 5%)`,
        icon: "🔴",
      });
    }

    if (series.length > 10) {
      const recent = series.slice(-10).map((s) => s.v);
      const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const latest = recent[recent.length - 1];
      if (latest > avg * 2) {
        alertList.push({
          level: "warning",
          title: "Traffic Spike Detected",
          message: `Current traffic (${latest.toFixed(1)}/s) is 2x the average`,
          icon: "⚠️",
        });
      }
    }

    if (agg.last60s < 10 && series.length > 60) {
      alertList.push({
        level: "info",
        title: "Low Traffic",
        message: "Traffic is below normal levels",
        icon: "ℹ️",
      });
    }

    if (alertList.length === 0) {
      alertList.push({
        level: "success",
        title: "All Systems Operational",
        message: "Everything is running smoothly",
        icon: "✅",
      });
    }

    return alertList;
  }, [agg, series]);

  const getLevelColor = (level) => {
    const colors = {
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#22d3ee",
      success: "#10b981",
    };
    return colors[level] || "#94a3b8";
  };

  const getLevelBg = (level) => {
    const colors = {
      error: "rgba(239, 68, 68, 0.1)",
      warning: "rgba(245, 158, 11, 0.1)",
      info: "rgba(34, 211, 238, 0.1)",
      success: "rgba(16, 185, 129, 0.1)",
    };
    return colors[level] || "rgba(148, 163, 184, 0.1)";
  };

  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          fontWeight: 600,
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🔔 System Alerts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {alerts.map((alert, i) => (
          <div
            key={i}
            style={{
              padding: "12px 16px",
              background: getLevelBg(alert.level),
              border: `1px solid ${getLevelColor(alert.level)}40`,
              borderRadius: "8px",
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
              animation: "slideIn 0.3s ease",
            }}
          >
            <span style={{ fontSize: "24px" }}>{alert.icon}</span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  marginBottom: "4px",
                  color: getLevelColor(alert.level),
                }}
              >
                {alert.title}
              </div>
              <div style={{ fontSize: "13px", opacity: 0.8 }}>
                {alert.message}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </div>
  );
}