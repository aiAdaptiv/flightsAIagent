import express from "express";
import { executeFlightSearch } from "../services/FlightSearchOrchestrator";
const router = express.Router();

router.post("/search", async (req, res) => {
  try {
    await executeFlightSearch();
    res.status(202).json({ status: "search_initiated" });
  } catch (error) {
    res.status(500).json({ error: "search_failed" });
  }
});

export default router;
