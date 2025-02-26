import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import config from "../config/config";

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
  const baseURL = "https://api.perplexity.ai";
  const client = axios.create({
    baseURL: baseURL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKeys.perplexity}`,
    },
  });

  //   client.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       if (error.response?.status === 429) {
  //         return retryRequest(error.config);
  //       }
  //       return Promise.reject(error);
  //     }
  //   );

  //   async function retryRequest(
  //     config: AxiosRequestConfig,
  //     retries = 3
  //   ): Promise<any> {
  //     let attempt = 0;
  //     const retryDelay = (attempt: number) => 1000 * Math.pow(2, attempt);

  //     while (attempt < retries) {
  //       attempt++;
  //       await new Promise((resolve) => setTimeout(resolve, retryDelay(attempt)));
  //       try {
  //         return await client.request(config);
  //       } catch (err) {
  //         if (attempt === retries) throw err;
  //       }
  //     }
  //   }

  async function chatCompletion(
    request: PerplexityRequest
  ): Promise<PerplexityResponse> {
    try {
      // Ensure the last message has the role 'user'
      const lastMessage = request.messages[request.messages.length - 1];
      if (lastMessage.role !== "user") {
        throw new Error("The last message must have the role 'user'.");
      }

      console.log("Sending request to Perplexity API...");
      const response = await client.post("/chat/completions", {
        model: request.model,
        messages: request.messages,
      });
      console.log("Response received:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error response:", error.response?.data || error.message);
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
