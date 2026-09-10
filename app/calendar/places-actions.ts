"use server";

// Google Places lookups run here rather than in the browser so the API key
// stays server-side — a NEXT_PUBLIC_ key would be inlined into the client
// bundle and readable by anyone.

// Northwestern's Evanston campus — biases results toward nearby places
// without excluding matches elsewhere.
const CAMPUS_CENTER = { latitude: 42.0565, longitude: -87.6753 };
const BIAS_RADIUS_METERS = 8000;

export async function searchPlaces(input: string): Promise<string[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const query = input.trim();
  if (!apiKey || query.length < 3) return [];

  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
    },
    body: JSON.stringify({
      input: query,
      locationBias: {
        circle: { center: CAMPUS_CENTER, radius: BIAS_RADIUS_METERS },
      },
      includedRegionCodes: ["us"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Places autocomplete failed: ${res.status}`);
  }

  const data: {
    suggestions?: Array<{ placePrediction?: { text?: { text?: string } } }>;
  } = await res.json();

  return (data.suggestions ?? [])
    .map((s) => s.placePrediction?.text?.text)
    .filter((text): text is string => !!text);
}
