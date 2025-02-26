import cron from "node-cron";
import { executeFlightSearch } from "../services/FlightSearchOrchestrator";
import { airtableClient } from "../infrastructure/airtable";

export const initializeScheduler = () => {
  cron.schedule("0 8 * * *", async () => {
    const lockRecordId = "scheduler_lock"; // Use a specific record ID for the lock
    const lock = await airtableClient.set("Locks", {
      id: lockRecordId,
      status: "active",
    });

    if (lock) {
      try {
        await executeFlightSearch();
      } finally {
        // Optionally, remove the lock after execution
        await airtableClient.del("Locks", lockRecordId);
      }
    }
  });
};
