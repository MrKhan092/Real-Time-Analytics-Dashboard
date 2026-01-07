import React, { useMemo } from "react";

export default function UserActivity({ feed }) {
  const recentUsers = useMemo(() => {
    const userMap = new Map();

    [...feed].reverse().forEach((event) => {
      if (!userMap.has(event.userId)) {
        userMap.set(event.userId, {
          userId: event.userId,
          lastAction: event.action,
          lastRoute: event.route,
          timestamp: event.timestamp,
        });
      }
    });

    return Array.from(userMap.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  }, [feed]);

  const getAvatarColor = (userId) => {
    const colors = [
      "#22d3ee",
      "#a78bfa",
      "#fb923c",
      "#10b981",
      "#f59e0b",
      "#ef4444",
    ];
    const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getInitials = (userId) => {
    if (userId.startsWith("guest_")) {
      return "G";
    }
    if (userId.startsWith("user_")) {
      return "U";
    }
    return userId.substring(0, 2).toUpperCase();
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

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
        👥 Recent User Activity
      </div>

      {recentUsers.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            opacity: 0.5,
          }}
        >
          No user activity yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recentUsers.map((user) => (
            <div
              key={user.userId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                background: "rgba(30, 41, 59, 0.4)",
                borderRadius: "8px",
                transition: "all 0.2s",
                cursor: "pointer",
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
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: getAvatarColor(user.userId),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "14px",
                  color: "#020617",
                  flexShrink: 0,
                }}
              >
                {getInitials(user.userId)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "14px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.userId}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    opacity: 0.7,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {user.lastAction} • {user.lastRoute}
                </div>
              </div>

              <div
                style={{
                  fontSize: "12px",
                  opacity: 0.6,
                  whiteSpace: "nowrap",
                }}
              >
                {getTimeAgo(user.timestamp)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}