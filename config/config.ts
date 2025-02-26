import dotenv from "dotenv";

dotenv.config();

interface Config {
  env: "development" | "production" | "test";
  apiKeys: {
    perplexity: string;
    serpapi: string;
  };
  airtable: {
    apiKey: string;
    baseId: string;
    healthCheckTable: string;
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
  const config: Partial<Config> = {
    env: (process.env.NODE_ENV as Config["env"]) || "development",

    apiKeys: {
      perplexity: process.env.PERPLEXITY_API_KEY!,
      serpapi: process.env.SERPAPI_KEY!,
    },

    airtable: {
      apiKey: process.env.AIRTABLE_API_KEY!,
      baseId: process.env.AIRTABLE_BASE_ID!,
      healthCheckTable: process.env.AIRTABLE_HEALTH_CHECK_TABLE!,
    },

    email: {
      gmailUser: process.env.GMAIL_USER!,
      gmailClientId: process.env.GMAIL_CLIENT_ID!,
      gmailClientSecret: process.env.GMAIL_CLIENT_SECRET!,
      gmailRefreshToken: process.env.GMAIL_REFRESH_TOKEN!,
      reportRecipient: process.env.REPORT_RECIPIENT!,
    },

    scheduling: {
      cronPattern: process.env.CRON_SCHEDULE || "0 8 * * *", //? 8 AM daily
      timezone: process.env.TZ || "Europe/Paris",
    },

    report: {
      currency: process.env.REPORT_CURRENCY || "EUR",
      maxResults: parseInt(process.env.MAX_RESULTS || "20", 10),
      timezone: process.env.REPORT_TIMEZONE || "UTC",
    },
  };

  if (validateConfig(config)) {
    return config as Config;
  }

  throw new Error("Invalid configuration");
};

const config = getConfig();

export default config;
