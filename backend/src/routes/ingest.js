// backend/src/routes/ingest.js
import express from "express";
import rateLimit from "express-rate-limit";
import { validateEventPayload } from "../middleware/validateEvent.js";
import { Event } from "../models/Event.js";
import rolling from "../lib/rolling.js";

const router = express.Router();

// simple HTTP rate limiter for ingestion
const limiter = rateLimit({
  windowMs: 1000,
  max: 30
});

router.post("/event", limiter, async (req, res) => {
  try {
    const payload = validateEventPayload(req.body);
    const ev = {
      ...payload,
      timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
    };

    // persist raw
    await Event.create(ev).catch(()=>{});

    // update in-memory
    rolling.pushEventToMemory(ev);
    rolling.pushReplay(ev);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
