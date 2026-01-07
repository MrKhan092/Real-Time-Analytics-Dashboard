import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

export default function EventsChart({ series = [] }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(series) || series.length === 0) {
      return null;
    }

    const labels = series.map((d) =>
      new Date(d.t).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );

    const datasetValues = series.map((d) => d.v ?? 0);

    return {
      labels,
      datasets: [
        {
          label: "⚡ Events (per second)",
          data: datasetValues,
          borderColor: "#22d3ee",
          backgroundColor: "rgba(34, 211, 238, 0.25)",
          fill: true,
          tension: 0.4,
          borderWidth: 2.5,
          pointRadius: 2,
          pointHoverRadius: 6,
          pointBackgroundColor: "#22d3ee",
          pointBorderColor: "#0f172a",
          pointHoverBackgroundColor: "#facc15",
        },
      ],
    };
  }, [series]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 300,
        easing: "easeOutQuart",
      },
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            color: "#e2e8f0",
            font: { size: 13, weight: "600" },
            padding: 15,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#22d3ee",
          bodyColor: "#e2e8f0",
          borderWidth: 1,
          borderColor: "#22d3ee",
          cornerRadius: 8,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `${context.parsed.y} events/sec`;
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: "x",
          },
          zoom: {
            wheel: {
              enabled: true,
              speed: 0.1,
            },
            pinch: {
              enabled: true,
            },
            mode: "x",
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#94a3b8",
            font: { size: 11 },
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 10,
          },
          grid: {
            color: "rgba(148, 163, 184, 0.08)",
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: "#94a3b8",
            font: { size: 11 },
            callback: function (value) {
              return value.toFixed(0);
            },
          },
          grid: {
            color: "rgba(148, 163, 184, 0.08)",
            drawBorder: false,
          },
          beginAtZero: true,
        },
      },
    }),
    []
  );

  if (!chartData) {
    return (
      <div
        style={{
          height: "320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          background: "rgba(30, 41, 59, 0.3)",
          borderRadius: "8px",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📡</div>
        <p style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
          Waiting for live data...
        </p>
        <p style={{ fontSize: "13px", opacity: 0.7, marginTop: "8px" }}>
          Events will appear here in real-time
        </p>
      </div>
    );
  }

  return (
    <div style={{ height: "320px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
}