import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { savedPlacesState, loginState, selectedPlaceState, isLoadingState, selectedCityState } from "../recoil/atoms.js";
import { culturalFactManager, routeSelector } from "../recoil/selectors.js";
import { FavoritesView } from "../views/favoritesView.jsx";
import { MapPresenter } from "@/presenters/mapPresenter.jsx";
import { loginWithGoogle } from "../firebase.js";
import { fetchCulturalFact } from "../api/llmSource.js";
import { formatPlaceBase } from "../lib/utils.js";

export function FavoritesPresenter() {
  const [savedPlaces, setSavedPlaces] = useRecoilState(savedPlacesState);
  const [routePlaces, setRoutePlaces] = useRecoilState(routeSelector);
  const setSelectedPlace = useSetRecoilState(selectedPlaceState);
  const user = useRecoilValue(loginState);

  const [currentFactFormatted, setFactPayload] = useRecoilState(culturalFactManager);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);

  const [selectedCity, setSelectedCity] = useRecoilState(selectedCityState);

  function removeFavoriteACB(placeId) {
    setSavedPlaces(function updateSavedPlacesCB(prev) {
      return prev.filter(function filterPlaceCB(p) {
        return p.properties.place_id !== placeId;
      });
    });

    setRoutePlaces(function removeFromRouteCB(prev) {
      return prev.filter(function filterRouteCB(p) {
        return p.placeId !== placeId;
      });
    });
  }

  function navigateFavoriteACB(place) {
    setSelectedPlace(place.originalPlace);
  }

  function requestFactACB(placeName) {
    setIsLoading(placeName);
    fetchCulturalFact(placeName)
      .then(function successACB(factText) {
        setFactPayload({ placeName: placeName, text: factText });
      })
      .catch(function errorACB(err) {
        //console.error("Gemini Error:", err);
        setFactPayload({ placeName: placeName, text: "Error fetching data." });
      })
      .finally(function cleanupACB() {
        setIsLoading(null);
      });
  }

  function loginACB() {
    loginWithGoogle();
  }

  function formatPlaceCB(place) {
    return formatPlaceBase(place);
  }

  function getFormattedPlaces() {
    return savedPlaces.map(formatPlaceCB);
  }

  function getCities() {
    const formattedPlaces = getFormattedPlaces();
    if (!formattedPlaces || formattedPlaces.length === 0) return [];

    const citySet = new Set();
    formattedPlaces.forEach(place => {
      if (place.city) {
        citySet.add(place.city);
      }
    });

    return Array.from(citySet).sort();
  }

  function getFilteredPlaces() {
    const formattedPlaces = getFormattedPlaces();
    if (!formattedPlaces) return [];
    if (selectedCity === "all") return formattedPlaces;

    return formattedPlaces.filter(place => {
      return place.city === selectedCity;
    });
  }


  function addToRouteACB(place) {
    setRoutePlaces(function updateRouteCB(prev) {
      const exists = prev.find(p => p.placeId === place.placeId);

      if (exists) {
        return prev.filter(p => p.placeId !== place.placeId);
      }

      if (prev.length > 0) {
        const last = prev[prev.length - 1].originalPlace;
        const dist = distanceMeters(last, place.originalPlace);

        if (dist > 100000) {
          return prev;
        }
      }

      return prev.concat(place);
    });
  }

  function distanceMeters(a, b) {
    function toRad(v) {
      return (v * Math.PI) / 180;
    };

    const R = 6371000;

    const [lon1, lat1] = a.geometry.coordinates;
    const [lon2, lat2] = b.geometry.coordinates;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1); //haversine formula finds the distance between our two GPS points

    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);

    const h =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function isPlaceInRangeACB(place) {
    if (routePlaces.length === 0) return true;
    const last = routePlaces[routePlaces.length - 1].originalPlace;
    const dist = distanceMeters(last, place.originalPlace);
    return dist <= 100000;
  }

  function getAddToRouteLabelACB(place) {
    const routeIndex = routePlaces?.findIndex(p => p.placeId === place.placeId);
    if (routeIndex >= 0) {
      return `(${routeIndex + 1}) Remove`;
    }
    if (!isPlaceInRangeACB(place)) {
      return "Out of range";
    }
    return "Add to route";
  }

  function onCityChangeACB(city) {
    setSelectedCity(city);
  }

  function getCityCountACB(city) {
    const formattedPlaces = getFormattedPlaces();
    if (!formattedPlaces) return 0;

    return formattedPlaces.filter(place => {
      return place.city === city;
    }).length;
  }

  return (
    <>
      <FavoritesView
        places={getFilteredPlaces()}
        allPlaces={getFormattedPlaces()}
        cities={getCities()}
        selectedCity={selectedCity}
        onCityChange={onCityChangeACB}
        getCityCount={getCityCountACB}
        routePlaces={routePlaces}
        onRemove={removeFavoriteACB}
        onNavigate={navigateFavoriteACB}
        onRequestFact={requestFactACB}
        onAddToRoute={addToRouteACB}
        getAddToRouteLabel={getAddToRouteLabelACB}
        isPlaceInRange={isPlaceInRangeACB}
        currentFact={currentFactFormatted}
        user={user}
        isLoading={isLoading}
        onLogin={loginACB}
        mapElement={savedPlaces?.length > 0 && (<MapPresenter places={savedPlaces} routePlaces={routePlaces} />)}
      />
    </>
  );
}
