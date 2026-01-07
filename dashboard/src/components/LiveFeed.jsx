import React, { useRef, useEffect } from "react";

export default function LiveFeed({ feed = [], isPaused = false }) {
  const feedRef = useRef(null);
  const shouldAutoScroll = useRef(true);

  useEffect(() => {
    if (feedRef.current && shouldAutoScroll.current && !isPaused) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [feed, isPaused]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    shouldAutoScroll.current = scrollHeight - scrollTop <= clientHeight + 50;
  };

  const getActionIcon = (action) => {
    const icons = {
      click: "🖱️",
      pageview: "👁️",
      submit: "📤",
      scroll: "📜",
      error: "⚠️",
      add_to_cart: "🛒",
      remove_from_cart: "➖",
      checkout_initiated: "💳",
      product_view: "👀",
    };
    return icons[action] || "⚡";
  };

  const getActionColor = (action) => {
    const colors = {
      click: "#22d3ee",
      pageview: "#a78bfa",
      submit: "#10b981",
      scroll: "#fb923c",
      error: "#ef4444",
      add_to_cart: "#10b981",
      remove_from_cart: "#ef4444",
      checkout_initiated: "#f59e0b",
      product_view: "#22d3ee",
    };
    return colors[action] || "#94a3b8";
  };

  return (
    <div
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: "12px",
        padding: "20px",
        border: "1px solid rgba(148, 163, 184, 0.1)",
        display: "flex",
        flexDirection: "column",
        height: "400px",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: "12px",
          fontSize: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span>📡 Live Feed</span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: "4px",
            background: isPaused ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
            color: isPaused ? "#ef4444" : "#10b981",
          }}
        >
          {feed.length} events
        </span>
      </div>

      <div
        ref={feedRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {feed.length === 0 ? (
          <div
            style={{
              color: "#94a3b8",
              textAlign: "center",
              padding: "40px 20px",
              opacity: 0.7,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "48px" }}>📡</div>
            <div>Waiting for live events...</div>
          </div>
        ) : (
          feed
            .slice()
            .reverse()
            .slice(0, 100)
            .map((event, i) => (
              <div
                key={i}
                style={{
                  padding: "12px",
                  borderRadius: "8px",
                  background: "rgba(30, 41, 59, 0.4)",
                  borderLeft: `3px solid ${getActionColor(event.action)}`,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  animation: i === 0 && !isPaused ? "slideIn 0.3s ease" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(30, 41, 59, 0.4)";
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    marginBottom: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>{getActionIcon(event.action)}</span>
                  <span style={{ color: getActionColor(event.action) }}>
                    {event.action}
                  </span>
                  <span style={{ opacity: 0.5 }}>→</span>
                  <span
                    style={{
                      color: "#94a3b8",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {event.route}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#8b98a8",
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span>
                    🕒 {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                  <span>👤 {event.userId}</span>
                </div>
              </div>
            ))
        )}
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