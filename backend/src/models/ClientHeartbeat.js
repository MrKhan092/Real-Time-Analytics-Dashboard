import mongoose from "mongoose";

const ClientHeartbeatSchema = new mongoose.Schema({
  clientId: String,
  lastSeenAt: { type: Date, default: Date.now }
});

export const ClientHeartbeat = mongoose.model("ClientHeartbeat", ClientHeartbeatSchema);
