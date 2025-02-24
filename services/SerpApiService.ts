import { createSerpApiClient } from "../infrastructure/serpapi";
import { FlightSearchParams } from "../types/FlightSearch";

export async function searchFlights(params: FlightSearchParams) {
  const serpApiClient = createSerpApiClient();
  return serpApiClient.search({
    engine: "google_flights",
    departure_id: params.departure_id,
    arrival_id: params.arrival_id,
    outbound_date: params.outbound_date,
    ...normalizeParams(params),
  });
}

function normalizeParams(params: any): Record<string, any> {
  if (!params) return {};

  return {
    origin: params.origin || "",
    destination: params.destination || "",
    departure_id: params.departure_id || "",
    arrival_id: params.arrival_id || "",
    outbound_date: params.outbound_date || "",
  };
}
