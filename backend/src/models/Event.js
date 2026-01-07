// backend/src/models/Event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventId: { type: String, index: true },
  timestamp: { type: Date, index: true },
  serverTimestamp: { type: Date, default: Date.now },
  userId: String,
  sessionId: String,
  route: String,
  action: String,
  metadata: mongoose.Schema.Types.Mixed
}, { capped: false });

// TTL index: keep raw events for 14 days (adjust as needed)
eventSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

export const Event = mongoose.model("Event", eventSchema);
