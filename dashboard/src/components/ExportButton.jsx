import React, { useState } from "react";

export default function ExportButton({ onClick }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleClick = async () => {
    setIsExporting(true);
    await onClick();
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isExporting}
      style={{
        padding: "8px 16px",
        background: isExporting
          ? "rgba(148, 163, 184, 0.2)"
          : "rgba(34, 211, 238, 0.2)",
        border: `1px solid ${isExporting ? "#94a3b8" : "#22d3ee"}`,
        borderRadius: "8px",
        color: isExporting ? "#94a3b8" : "#22d3ee",
        fontSize: "14px",
        fontWeight: 600,
        cursor: isExporting ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isExporting) {
          e.target.style.background = "rgba(34, 211, 238, 0.3)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isExporting) {
          e.target.style.background = "rgba(34, 211, 238, 0.2)";
        }
      }}
    >
      {isExporting ? (
        <>
          <span
            style={{
              display: "inline-block",
              width: "14px",
              height: "14px",
              border: "2px solid #94a3b8",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          Exporting...
        </>
      ) : (
        <>
          📥 Export Data
        </>
      )}
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
}