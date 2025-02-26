import axios, { AxiosInstance } from "axios";
import getConfig from "next/config";
import config from "../config/config";

export interface SerpApiParams {
  engine: "google_flights" | "google_flights_dates";
  departure_id: string;
  arrival_id: string;
  outbound_date: string;
  return_date?: string;
  currency?: string;
  hl?: string;
}

export function createSerpApiClient() {
  const baseURL = "https://serpapi.com/search";
  const client = axios.create({
    timeout: 10000,
    params: {
      api_key: config.apiKeys.serpapi,
    },
  });

  async function search(params: SerpApiParams): Promise<any> {
    try {
      const response = await client.get(baseURL, {
        params: {
          ...params,
          output: "json",
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error: any) {
      throw new SerpApiError(
        error.response?.data?.error || error.message || "Unknown SerpAPI error"
      );
    }
  }

  return {
    search,
  };
}

export const serpApiClient = createSerpApiClient();

export class SerpApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SerpApiError";
  }
}
