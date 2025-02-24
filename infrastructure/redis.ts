import Redis from "ioredis";
import getConfig from "next/config";

export function createRedisClient() {
  const config = getConfig();
  const client = new Redis({
    host: config.redis.host,
    port: config.redis.port,
    retryStrategy: (times) => Math.min(times * 100, 3000),
  });

  client.on("connect", () => console.log("Redis connection established"));
  client.on("error", (err) => console.error("Redis connection error:", err));

  async function connect(): Promise<void> {
    if (client.status !== "ready") {
      await client.connect();
    }
  }

  async function get<T>(key: string): Promise<T | null> {
    try {
      const data = await client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Redis GET error:", err);
      return null;
    }
  }

  async function set(
    key: string,
    value: any,
    options?: { EX?: number; NX?: boolean }
  ): Promise<boolean> {
    try {
      const stringValue = JSON.stringify(value);
      const args: (string | number)[] = [key, stringValue];

      if (options?.EX) {
        args.push("EX", options.EX);
      }
      if (options?.NX) {
        args.push("NX");
      }

      await client.set(...(args as [string, string, ...any[]]));
      return true;
    } catch (err) {
      console.error("Redis SET error:", err);
      return false;
    }
  }

  async function del(key: string): Promise<number> {
    return client.del(key);
  }

  async function healthCheck(): Promise<boolean> {
    try {
      await client.ping();
      return true;
    } catch (err) {
      return false;
    }
  }

  return {
    connect,
    get,
    set,
    del,
    healthCheck,
  };
}

export const redisClient = createRedisClient();
