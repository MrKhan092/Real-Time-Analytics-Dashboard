import React, { useMemo } from "react";

export default function PerformanceMetrics({ agg, series }) {
  const metrics = useMemo(() => {
    const avgEventsPerSec = series.length > 0
      ? series.reduce((sum, p) => sum + p.v, 0) / series.length
      : 0;

    const variance = series.length > 0
      ? series.reduce((sum, p) => sum + Math.pow(p.v - avgEventsPerSec, 2), 0) / series.length
      : 0;
    const stdDev = Math.sqrt(variance);

    const stabilityScore = avgEventsPerSec > 0
      ? Math.max(0, 100 - (stdDev / avgEventsPerSec) * 100)
      : 100;

    const healthScore = Math.max(0, 100 - (agg.errorRate || 0) * 100);

    return {
      avgEventsPerSec: avgEventsPerSec.toFixed(2),
      stabilityScore: stabilityScore.toFixed(0),
      healthScore: healthScore.toFixed(0),
      stdDev: stdDev.toFixed(2),
    };
  }, [agg, series]);

  const getHealthColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
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
        ⚡ Performance Metrics
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        <div
          style={{
            padding: "16px",
            background: "rgba(34, 211, 238, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(34, 211, 238, 0.3)",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "8px" }}>
            Average Traffic
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#22d3ee",
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            {metrics.avgEventsPerSec}
            <span style={{ fontSize: "14px", opacity: 0.7 }}>/s</span>
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
            σ = {metrics.stdDev}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            background: "rgba(167, 139, 250, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(167, 139, 250, 0.3)",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "8px" }}>
            Traffic Stability
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#a78bfa",
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            {metrics.stabilityScore}
            <span style={{ fontSize: "14px", opacity: 0.7 }}>%</span>
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
            {metrics.stabilityScore >= 80 ? "Very Stable" : "Variable"}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            background: `rgba(${
              metrics.healthScore >= 80 ? "16, 185, 129" : 
              metrics.healthScore >= 60 ? "245, 158, 11" : "239, 68, 68"
            }, 0.1)`,
            borderRadius: "8px",
            border: `1px solid ${getHealthColor(metrics.healthScore)}40`,
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "8px" }}>
            System Health
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: getHealthColor(metrics.healthScore),
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            {metrics.healthScore}
            <span style={{ fontSize: "14px", opacity: 0.7 }}>%</span>
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
            {getHealthLabel(metrics.healthScore)}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <div style={{ fontSize: "12px", opacity: 0.7, marginBottom: "8px" }}>
            Error Rate
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: agg.errorRate > 0.05 ? "#ef4444" : "#10b981",
              display: "flex",
              alignItems: "baseline",
              gap: "4px",
            }}
          >
            {((agg.errorRate || 0) * 100).toFixed(1)}
            <span style={{ fontSize: "14px", opacity: 0.7 }}>%</span>
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>
            {agg.errorRate > 0.05 ? "⚠️ High" : "✅ Low"}
          </div>
        </div>
      </div>
    </div>
  );
}