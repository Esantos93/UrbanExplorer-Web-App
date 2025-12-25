import { GEOAPIFY_API_KEY } from "./apiConfig";

function gotResponseCB(response) {
  if (!response.ok) {
    throw new Error("API Error: " + response.status);
  }
  return response.json();
}

function keepResultsCB(result) {
  return result.features;
}

function keepGeocodeResultsCB(result) {
  return result.results || [];
}

window.searchPlaceCBs = searchPlaceCBs;
window.geocodeCB = geocodeCB;

// Search places using coordinates
export function searchPlaceCBs(category, lon, lat, radius, limit) {
  const paramsDefined = {};

  if (category !== undefined) paramsDefined.categories = category;
  if (lon !== undefined && lat !== undefined && radius !== undefined)
    paramsDefined.filter = "circle:" + lon + "," + lat + "," + radius;
  if (limit !== undefined) paramsDefined.limit = limit;

  paramsDefined.apiKey = GEOAPIFY_API_KEY;

  const queryConverted = new URLSearchParams(paramsDefined).toString();
  const url = "https://api.geoapify.com/v2/places?" + queryConverted;

  return fetch(url, { method: "GET" })
    .then(gotResponseCB)
    .then(keepResultsCB);
}

// Turn cities, streets or addresses into coordinates
export function geocodeCB(address, limit = 5, countryFilter) {
  if (!address) return Promise.reject("No address provided");

  const paramsDefined = {
    text: address,
    format: "json",
    apiKey: GEOAPIFY_API_KEY,
    limit
  };

  if (countryFilter) {
    paramsDefined.filter = `countrycode:${countryFilter}`;
  }

  const queryConverted = new URLSearchParams(paramsDefined).toString();
  const url = `https://api.geoapify.com/v1/geocode/search?${queryConverted}`;

  return fetch(url, { method: "GET" })
    .then(gotResponseCB)
    .then(keepGeocodeResultsCB);
}
