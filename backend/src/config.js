// backend/src/config.js
import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
export const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/realtime_analytics";
export const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:5173").split(",");
export const JWT_SECRET = process.env.JWT_SECRET || "replace-this-secret";
export const MAX_MSG_SIZE = "1mb";
export const REPLAY_BUFFER = Number(process.env.REPLAY_BUFFER || 200);
export const RATE_LIMIT_MS = 1000; // per-client minimum ms between events
