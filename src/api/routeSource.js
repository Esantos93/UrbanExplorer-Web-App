import { GEOAPIFY_API_KEY } from "@/api/apiConfig";

export function fetchRoute(waypoints, mode) {
    const url = "https://api.geoapify.com/v1/routing?waypoints=" +
        waypoints.join("|") +
        "&mode=" + mode +
        "&format=geojson&apiKey=" + GEOAPIFY_API_KEY;

    return fetch(url).then(function (response) {
        return response.json();
    });
}