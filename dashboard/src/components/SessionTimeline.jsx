import React, { useMemo } from "react";

export default function SessionTimeline({ feed }) {
  const timeline = useMemo(() => {
    if (feed.length === 0) return [];

    const groups = {};
    feed.forEach((event) => {
      const minute = new Date(event.timestamp);
      minute.setSeconds(0, 0);
      const key = minute.toISOString();

      if (!groups[key]) {
        groups[key] = { timestamp: key, count: 0, events: [] };
      }
      groups[key].count++;
      groups[key].events.push(event);
    });

    return Object.values(groups)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .slice(-10);
  }, [feed]);

  const maxCount = timeline.length > 0
    ? Math.max(...timeline.map((t) => t.count))
    : 1;

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
        ⏱️ Activity Timeline (Last 10 Minutes)
      </div>

      {timeline.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            opacity: 0.5,
          }}
        >
          No activity to display
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {timeline.map((item, i) => {
            const percentage = (item.count / maxCount) * 100;
            const time = new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={i} style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                    fontSize: "13px",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{time}</span>
                  <span style={{ opacity: 0.7 }}>{item.count} events</span>
                </div>
                <div
                  style={{
                    height: "32px",
                    background: "rgba(30, 41, 59, 0.6)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percentage}%`,
                      background: "linear-gradient(90deg, #22d3ee 0%, #a78bfa 100%)",
                      borderRadius: "6px",
                      transition: "width 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      paddingRight: "8px",
                    }}
                  >
                    {percentage > 20 && (
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#020617",
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}