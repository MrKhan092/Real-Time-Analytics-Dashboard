import React from "react";

export default function ConnectionStatus({ isConnected, lastUpdate }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        background: isConnected
          ? "rgba(16, 185, 129, 0.1)"
          : "rgba(239, 68, 68, 0.1)",
        border: `1px solid ${isConnected ? "#10b981" : "#ef4444"}`,
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "600",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: isConnected ? "#10b981" : "#ef4444",
          animation: isConnected ? "pulse 2s infinite" : "none",
        }}
      />
      <span style={{ color: isConnected ? "#10b981" : "#ef4444" }}>
        {isConnected ? "Connected" : "Disconnected"}
      </span>
      {lastUpdate && isConnected && (
        <span style={{ opacity: 0.6, fontSize: "12px", marginLeft: "4px" }}>
          • Updated {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      )}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
}