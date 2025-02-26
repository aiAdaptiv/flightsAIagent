import { pplxClient } from "../infrastructure/pplx";
import { airtableClient } from "../infrastructure/airtable";
import dates from "../placeholders/dates.json";
import fs from "fs";
import path from "path";

export async function fetchFlightInsights() {
  // Load the rules and prompt from their respective markdown files
  const rules = fs.readFileSync(
    path.resolve(__dirname, "../placeholders/rules.md"),
    "utf-8"
  );
  const prompt = fs.readFileSync(
    path.resolve(__dirname, "../placeholders/prompt.md"),
    "utf-8"
  );

  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [
      {
        role: "system",
        content: `${prompt}\n\n${rules}\n\nDates: ${JSON.stringify(dates)}`,
      },
      {
        role: "user",
        content: "What are the best flights to New York from my dates range?",
      },
    ];
  console.log(messages);

  const response = await pplxClient.chatCompletion({
    model: "sonar-reasoning-pro",
    messages: messages,
  });

  return response;
}

function getQuerySignature() {
  // Example parameters that might affect the query
  const userId = "exampleUserId"; // Replace with actual user ID
  const queryParameters = {
    destination: "New York",
    departureDate: "2023-12-25",
    returnDate: "2024-01-05",
  };

  // Create a unique signature based on the parameters
  const signature = `${userId}:${queryParameters.destination}:${queryParameters.departureDate}:${queryParameters.returnDate}`;

  // Optionally, hash the signature for a shorter key
  return signature;
}
