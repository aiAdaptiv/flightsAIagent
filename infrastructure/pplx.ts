import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import getConfig from "next/config";

export interface PerplexityRequest {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
}

export interface PerplexityResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export function createPerplexityClient() {
  const config = getConfig();
  const baseURL = "https://api.perplexity.ai";
  const client = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKeys.perplexity}`,
      "x-api-key": config.apiKeys.perplexity,
    },
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 429) {
        return retryRequest(error.config);
      }
      return Promise.reject(error);
    }
  );

  async function retryRequest(
    config: AxiosRequestConfig,
    retries = 3
  ): Promise<any> {
    let attempt = 0;
    const retryDelay = (attempt: number) => 1000 * Math.pow(2, attempt);

    while (attempt < retries) {
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, retryDelay(attempt)));
      try {
        return await client.request(config);
      } catch (err) {
        if (attempt === retries) throw err;
      }
    }
  }

  async function chatCompletion(
    request: PerplexityRequest
  ): Promise<PerplexityResponse> {
    try {
      const response = await client.post("/chat/completions", request);
      return response.data;
    } catch (error: any) {
      throw new Error(
        `Perplexity API error: ${error.response?.data?.error || error.message}`
      );
    }
  }

  return {
    chatCompletion,
  };
}

export const pplxClient = createPerplexityClient();
