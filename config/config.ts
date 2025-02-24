import dotenv from "dotenv";
import { RedisOptions } from "ioredis";

dotenv.config();

interface Config {
  env: "development" | "production" | "test";
  apiKeys: {
    perplexity: string;
    serpapi: string;
  };
  redis: RedisOptions & {
    enableCache: boolean;
    cacheTtl: number;
  };
  email: {
    gmailUser: string;
    gmailClientId: string;
    gmailClientSecret: string;
    gmailRefreshToken: string;
    reportRecipient: string;
  };
  scheduling: {
    cronPattern: string;
    timezone: string;
  };
  report: {
    currency: string;
    maxResults: number;
    timezone: string;
  };
}

const validateConfig = (config: Partial<Config>): config is Config => {
  if (!config.apiKeys?.perplexity) {
    throw new Error("PERPLEXITY_API_KEY is required in environment variables");
  }
  if (!config.apiKeys?.serpapi) {
    throw new Error("SERPAPI_KEY is required in environment variables");
  }
  return true;
};

const getConfig = (): Config => {
  const defaultRedisPort = parseInt(process.env.REDIS_PORT || "6379", 10);

  const config: Partial<Config> = {
    env: (process.env.NODE_ENV as Config["env"]) || "development",

    apiKeys: {
      perplexity: process.env.PERPLEXITY_API_KEY!,
      serpapi: process.env.SERPAPI_KEY!,
    },

    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: defaultRedisPort,
      password: process.env.REDIS_PASSWORD,
      enableCache: process.env.REDIS_CACHE_ENABLED === "true",
      cacheTtl: parseInt(process.env.REDIS_CACHE_TTL || "3600", 10),
      reconnectOnError: (err: Error) => {
        console.error("Redis connection error:", err.message);
        return true;
      },
    },

    email: {
      gmailUser: process.env.GMAIL_USER!,
      gmailClientId: process.env.GMAIL_CLIENT_ID!,
      gmailClientSecret: process.env.GMAIL_CLIENT_SECRET!,
      gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN!,
      reportRecipient: process.env.REPORT_RECIPIENT!,
    },

    scheduling: {
      cronPattern: process.env.CRON_SCHEDULE || "0 8 * * *", // 8 AM daily
      timezone: process.env.TZ || "Europe/Paris",
    },

    report: {
      currency: process.env.REPORT_CURRENCY || "EUR",
      maxResults: parseInt(process.env.MAX_RESULTS || "20", 10),
      timezone: process.env.REPORT_TIMEZONE || "UTC",
    },
  };

  if (config.env === "production") {
    if (!process.env.REDIS_PASSWORD) {
      console.warn("Redis password is recommended in production environment");
    }
  }

  if (validateConfig(config)) {
    return config as Config;
  }

  throw new Error("Invalid configuration");
};

const config = getConfig();

export default config;
