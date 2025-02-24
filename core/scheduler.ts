import cron from "node-cron";
import { executeFlightSearch } from "../services/FlightSearchOrchestrator";
import { createRedisClient } from "../infrastructure/redis";

export const initializeScheduler = () => {
  cron.schedule("0 8 * * *", async () => {
    const redisClient = createRedisClient();
    const lock = await redisClient.set("scheduler_lock", "active", {
      EX: 3600,
      NX: true,
    });
    if (lock) {
      await executeFlightSearch();
    }
  });
};
