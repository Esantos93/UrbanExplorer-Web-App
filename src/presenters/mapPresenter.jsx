import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { searchResultsState, selectedPlaceState, routePlacesState } from "../recoil/atoms.js";
import { MapView } from "../views/mapView.jsx";
import { fetchRoute } from "../api/routeSource.js";
import { getCoordinates } from "../lib/utils.js";


export function MapPresenter(props) {
  const searchResults = props.places || useRecoilValue(searchResultsState);
  const focusedPlace = useRecoilValue(selectedPlaceState);
  const routePlaces = props.routePlaces || useRecoilValue(routePlacesState);

  const [routeGeoJson, setRouteGeoJson] = useState(null);

  function performRoutingACB() {
    if (!routePlaces || routePlaces.length < 2) {
      setRouteGeoJson(null);
      return;
    }

    const waypoints = routePlaces.map(function (place) {
      const coords = getCoordinates(place);
      return coords ? coords.string : null;
    }).filter(Boolean);

    if (waypoints.length < 2) return;

    fetchRoute(waypoints, "walk").then(function (data) {
      setRouteGeoJson(data);
    });
  }

  useEffect(performRoutingACB, [routePlaces]);

  function formatForMapCB(place) {
    const coords = getCoordinates(place);
    return {
      lat: coords ? coords.lat : 0,
      lon: coords ? coords.lon : 0,
      name: place.properties?.name || "Unnamed place",
      placeId: place.properties?.place_id
    };
  }

  function formatFocusedPlaceCB(place) {
    if (!place) return null;
    const coords = getCoordinates(place);
    return {
      lat: coords ? coords.lat : 0,
      lon: coords ? coords.lon : 0
    };
  }

  return (
    <MapView
      places={searchResults.map(formatForMapCB)}
      focusedPlace={focusedPlace ? formatForMapCB(focusedPlace) : null}
      routeGeoJson={routeGeoJson}
    />
  );
}


