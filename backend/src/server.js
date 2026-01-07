import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ingestRoutes from "./routes/ingest.js";
import statsRoutes from "./routes/stats.js";
import { PORT, MONGO_URI, CORS_ORIGINS, JWT_SECRET, REPLAY_BUFFER } from "./config.js";
import { Event } from "./models/Event.js";
import rolling from "./lib/rolling.js";
import jwt from "jsonwebtoken";

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(cors({ origin: CORS_ORIGINS, credentials: true }));

app.use("/api", ingestRoutes);
app.use("/api", statsRoutes);

// HTTP server + socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: CORS_ORIGINS, credentials: true },
  pingInterval: 25000,
  pingTimeout: 60000,
  maxHttpBufferSize: 1e6,
  transports: ["websocket", "polling"] // ✅ Support both transports
});

// namespaces
const websiteNs = io.of("/website");
const dashboardNs = io.of("/dashboard");

// simple per-socket rate limiter (in-memory)
const lastEventAt = new Map();

// ✅ Track active connections
let activeWebsites = 0;
let activeDashboards = 0;

// ============================================
// WEBSITE NAMESPACE (Event Producers)
// ============================================
websiteNs.use((socket, next) => {
  // optional: authenticate via token query param or headers
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (token) {
    try {
      const p = jwt.verify(token, JWT_SECRET);
      socket.user = p;
    } catch (e) {
      // ignore invalid token, allow guest
    }
  }
  return next();
});

websiteNs.on("connection", (socket) => {
  activeWebsites++;
  console.log(`🌐 Website connected: ${socket.id} (Total: ${activeWebsites})`);

  socket.on("user_event", async (data) => {
    try {
      // simple rate-limiting per socket
      const now = Date.now();
      const last = lastEventAt.get(socket.id) || 0;
      if (now - last < 100) {
        console.warn(`⚠️ Rate limit hit for socket ${socket.id}`);
        return; // drop too-frequent messages
      }
      lastEventAt.set(socket.id, now);

      // validate minimal shape server-side (light)
      if (!data.route || !data.action) {
        console.warn("⚠️ Invalid event data:", data);
        return;
      }

      const ev = {
        eventId: data.eventId || `${socket.id}_${Date.now()}`,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        userId: data.userId || (socket.user && socket.user.sub) || `guest_${socket.id.slice(0,6)}`,
        sessionId: data.sessionId || socket.id,
        route: data.route,
        action: data.action,
        metadata: data.metadata || {}
      };

      // persist (fire and forget)
      Event.create(ev).catch((err) => {
        console.error("❌ Failed to persist event:", err.message);
      });

      // memory rolling
      rolling.pushEventToMemory(ev);
      rolling.pushReplay(ev, REPLAY_BUFFER);

      // emit to dashboards (all connected dashboards get this)
      dashboardNs.emit("live_event", ev);
      
    } catch (err) {
      console.error("❌ user_event error:", err.message);
    }
  });

  socket.on("disconnect", (reason) => {
    activeWebsites--;
    lastEventAt.delete(socket.id);
    console.log(`🌐 Website disconnected: ${socket.id} (Total: ${activeWebsites}) - ${reason}`);
  });

  socket.on("error", (err) => {
    console.error(`🌐 Website socket error (${socket.id}):`, err.message);
  });
});

// ============================================
// DASHBOARD NAMESPACE (Event Consumers)
// ============================================
dashboardNs.on("connection", (socket) => {
  activeDashboards++;
  console.log(`⚡ Dashboard connected: ${socket.id} (Total: ${activeDashboards})`);
  
  // ✅ Send replay buffer immediately on connection
  try {
    const replayEvents = rolling.getReplay();
    socket.emit("replay", replayEvents);
    console.log(`📤 Sent ${replayEvents.length} replay events to ${socket.id}`);
  } catch (err) {
    console.error("❌ Failed to send replay:", err.message);
  }

  // ✅ Keepalive ping to client (helps detect stale connections)
  const pingTimer = setInterval(() => {
    if (socket.connected) {
      socket.emit("ping", { t: Date.now() });
    }
  }, 20000);

  socket.on("disconnect", (reason) => {
    activeDashboards--;
    clearInterval(pingTimer);
    console.log(`❌ Dashboard disconnected: ${socket.id} (Total: ${activeDashboards}) - ${reason}`);
  });

  socket.on("error", (err) => {
    console.error(`⚡ Dashboard socket error (${socket.id}):`, err.message);
  });

  // ✅ Optional: Handle pong from client
  socket.on("pong", () => {
    // Client acknowledges ping (optional)
  });
});

// ============================================
// AGGREGATE BROADCAST (Every 1 second)
// ============================================
setInterval(async () => {
  try {
    const agg = rolling.currentAgg();
    
    // ✅ Add timestamp for client-side charting
    agg.t = Date.now();
    
    // compute error rate
    agg.errorRate = agg.last60s ? (agg.errors / agg.last60s) : 0;
    
    // ✅ Only broadcast if there are connected dashboards
    if (activeDashboards > 0) {
      dashboardNs.emit("aggregate", agg);
    }
  } catch (err) {
    console.error("❌ Aggregate broadcast error:", err.message);
  }
}, 1000);

// ============================================
// GRACEFUL SHUTDOWN
// ============================================
process.on("SIGTERM", () => {
  console.log("⚠️ SIGTERM received, closing server gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("\n⚠️ SIGINT received, closing server gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  });
});

// ============================================
// START SERVER
// ============================================
mongoose
  .connect(MONGO_URI, { 
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
      console.log(`📡 Socket.IO namespaces:`);
      console.log(`   - /website (event producers)`);
      console.log(`   - /dashboard (event consumers)`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ============================================
// ERROR HANDLERS
// ============================================
io.engine.on("connection_error", (err) => {
  console.error("🔥 Socket.IO connection error:", err);
});

app.use((err, req, res, next) => {
  console.error("❌ Express error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});