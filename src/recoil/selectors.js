// recoil/selectors.js
import { selector } from "recoil";
import { searchQueryState, selectedCategoriesState, searchResultsState, isLoadingState, currentFactState, routePlacesState } from "./atoms.js";
import { searchPlaceCBs } from "../api/placeSource.js";
import { removeDuplicatesById } from "../lib/utils.js";

function parseCoordinatesCB(query) {
    const parts = query.split(",");
    if (parts.length !== 2) return null;

    const lon = parseFloat(parts[0]);
    const lat = parseFloat(parts[1]);

    if (isNaN(lon) || isNaN(lat)) return null;

    return { lon, lat };
}


function fetchCategoryCB(category, lon, lat) {
    //console.log("Selector: fetching category", category, "at", lon, lat);
    return searchPlaceCBs(category, lon, lat, 2000, 10);
}


// Selector for the LLM-generated cultural fact based on the current search results.
export const culturalFactManager = selector({
    key: "culturalFactManager",

    get: function getFactACB({ get }) {
        const factData = get(currentFactState);
        // If there is no fact data, return null
        if (!factData || !factData.text) return null;

        // Format the fact for display
        return {
            placeName: factData.placeName,
            prefix: "Did you know...? ",
            text: factData.text
        };
    },

    set: function setFactACB({ set }, payload) {
        // Payload is an object with name and text properties coming from the presenter
        if (payload) {
            set(currentFactState, payload);
        }
    },
});

export const uniqueSearchResultsSelector = selector({
    key: "uniqueSearchResultsSelector",
    get: function ({ get }) {
        const results = get(searchResultsState);
        return removeDuplicatesById(results, function getIdCB(place) {
            return place.properties?.place_id;
        });
    }
});

export const routeSelector = selector({
    key: "routeSelector",
    get: function ({ get }) {
        const route = get(routePlacesState);
        return removeDuplicatesById(route, function getIdCB(place) {
            return place.placeId;
        });
    },
    set: function ({ set }, newValue) {
        set(routePlacesState, newValue);
    }
});