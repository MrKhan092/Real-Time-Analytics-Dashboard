import React, { useEffect, useState } from "react";

export default function MetricsComparison({ currentAgg, series }) {
  const [comparison, setComparison] = useState({
    avgLast1min: 0,
    avgLast5min: 0,
    trend: "stable",
    percentChange: 0,
  });

  useEffect(() => {
    if (series.length < 60) return;

    const last1min = series.slice(-60);
    const last5min = series.slice(-300);

    const avg1min =
      last1min.reduce((sum, p) => sum + p.v, 0) / last1min.length;
    const avg5min =
      last5min.reduce((sum, p) => sum + p.v, 0) / last5min.length;

    const percentChange = avg5min
      ? ((avg1min - avg5min) / avg5min) * 100
      : 0;

    let trend = "stable";
    if (percentChange > 10) trend = "up";
    else if (percentChange < -10) trend = "down";

    setComparison({
      avgLast1min: avg1min.toFixed(2),
      avgLast5min: avg5min.toFixed(2),
      trend,
      percentChange: percentChange.toFixed(1),
    });
  }, [series]);

  const getTrendIcon = () => {
    if (comparison.trend === "up") return "📈";
    if (comparison.trend === "down") return "📉";
    return "➡️";
  };

  const getTrendColor = () => {
    if (comparison.trend === "up") return "#10b981";
    if (comparison.trend === "down") return "#ef4444";
    return "#94a3b8";
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
        📊 Metrics Comparison
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>
            Current Rate
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#22d3ee" }}>
            {currentAgg.last1s || 0} <span style={{ fontSize: "14px" }}>/s</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>
            1-Min Average
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#a78bfa" }}>
            {comparison.avgLast1min}{" "}
            <span style={{ fontSize: "14px" }}>/s</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>
            5-Min Average
          </div>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "#fb923c" }}>
            {comparison.avgLast5min}{" "}
            <span style={{ fontSize: "14px" }}>/s</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "4px" }}>
            Trend (1m vs 5m)
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: getTrendColor(),
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {getTrendIcon()}
            <span>
              {comparison.percentChange}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}