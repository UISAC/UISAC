// Builds a public Google Maps search link for a free-text place string.
// No API key involved — the Places lookup itself runs server-side in
// app/calendar/places-actions.ts.
export function googleMapsSearchUrl(place: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
}
