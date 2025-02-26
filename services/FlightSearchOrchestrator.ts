import { FlightSearchParams } from "../types/FlightSearch";
import { generateReport } from "../utils/ReportGenerator";
import { sendReport } from "./EmailService";
import { fetchFlightInsights } from "./PerplexityService";
import { searchFlights } from "./SerpApiService";

export async function executeFlightSearch() {
  const flightSearchParams: FlightSearchParams = {
    departure_id: "your_departure_id", // Replace with actual values
    arrival_id: "your_arrival_id",
    outbound_date: "your_outbound_date",
    // Add other necessary fields
  };

  //   const [aiResults, apiResults] = await Promise.all([
  const [aiResults] = await Promise.all([
    fetchFlightInsights(),
    // searchFlights(flightSearchParams), // Pass the required argument
  ]);

  console.log("Flight insights:", aiResults);

  //   const mergedResults = mergeResults(aiResults, apiResults);
  //   const pdfBuffer = await generateReport(mergedResults);
  //   const buffer = Buffer.from(pdfBuffer);
  //   await sendReport(buffer);
}

function mergeResults(aiData: any, apiData: any) {
  // Normalization logic combining AI insights and API data
}
