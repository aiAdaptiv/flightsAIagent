import Airtable from "airtable";
import getConfig from "next/config";
import config from "../config/config";

// Initialize Airtable client
const base = new Airtable({ apiKey: config.airtable.apiKey }).base(
  config.airtable.baseId
);

export function createAirtableClient() {
  async function get<T>(table: string, recordId: string): Promise<T | null> {
    try {
      const record = await base(table).find(recordId);
      return record.fields as T;
    } catch (err) {
      console.error("Airtable GET error:", err);
      return null;
    }
  }

  async function set(table: string, fields: any): Promise<boolean> {
    try {
      await base(table).create([{ fields }]);
      return true;
    } catch (err) {
      console.error("Airtable SET error:", err);
      return false;
    }
  }

  async function del(table: string, recordId: string): Promise<boolean> {
    try {
      await base(table).destroy(recordId);
      return true;
    } catch (err) {
      console.error("Airtable DELETE error:", err);
      return false;
    }
  }

  async function healthCheck(): Promise<boolean> {
    try {
      await base(config.airtable.healthCheckTable)
        .select({ maxRecords: 1 })
        .firstPage();
      return true;
    } catch (err) {
      return false;
    }
  }

  return {
    get,
    set,
    del,
    healthCheck,
  };
}

export const airtableClient = createAirtableClient();

// ... existing cron scheduled work ...
