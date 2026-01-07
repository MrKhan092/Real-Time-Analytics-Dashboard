// backend/src/routes/stats.js
import express from "express";
import { Event } from "../models/Event.js";
import rolling from "../lib/rolling.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    // return materialized rolling aggregates + top routes (from in-memory) for speed
    const agg = rolling.currentAgg();

    // also include top routes from DB in last 5 minutes (best-effort)
    const fiveMinAgo = new Date(Date.now() - 5*60*1000);
    const topRoutes = await Event.aggregate([
      { $match: { timestamp: { $gte: fiveMinAgo } } },
      { $group: { _id: "$route", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    agg.dbTopRoutes = topRoutes;
    res.json(agg);
  } catch (err) {
    res.status(500).json({ error: "stats_failed", msg: err.message });
  }
});

router.get("/healthz", async (req, res) => {
  try {
    const count = await Event.countDocuments().limit(1);
    res.json({ ok: true, mongo: true });
  } catch (e) {
    res.status(500).json({ ok: false, mongo: false });
  }
});

export default router;
