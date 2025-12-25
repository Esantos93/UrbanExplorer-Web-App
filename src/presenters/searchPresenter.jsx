import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { searchQueryState, selectedCategoriesState, searchResultsState, isLoadingState, savedPlacesState, loginState, selectedPlaceState } from "../recoil/atoms.js";
import { uniqueSearchResultsSelector } from "../recoil/selectors.js";
import { SearchFormView } from "../views/searchFormView.jsx";
import { SearchResultsView } from "../views/searchResultsView.jsx";
import { SearchResultsSuspenseView } from "../views/searchResultsSuspenseView.jsx";
import { geocodeCB, searchPlaceCBs } from "../api/placeSource.js";
import { formatPlaceBase, CATEGORY_OPTIONS, ALL_CATEGORIES } from "../lib/utils.js";

export function SearchPresenter() {
    const [query, setQuery] = useRecoilState(searchQueryState);
    const [selectedCategories, setSelectedCategories] = useRecoilState(selectedCategoriesState);
    const recoilResults = useRecoilValue(uniqueSearchResultsSelector);
    const setRecoilResults = useSetRecoilState(searchResultsState);
    const [recoilLoading, setRecoilLoading] = useRecoilState(isLoadingState);
    const [savedPlaces, setSavedPlaces] = useRecoilState(savedPlacesState);
    const [user] = useRecoilState(loginState);
    const setSelectedPlace = useSetRecoilState(selectedPlaceState);

    function toggleFavoriteACB(placeId) {

        const place = recoilResults.find(function findPlaceCB(p) {
            return p.properties.place_id === placeId;
        });

        const alreadySaved = savedPlaces.some(function checkSavedCB(p) {
            return p.properties.place_id === placeId;
        });

        if (alreadySaved) {
            const name = place.properties.name || "Unnamed place";
            const confirmRemove = window.confirm(
                `Remove ${name} from your saved places?`
            );

            if (confirmRemove) {
                setSavedPlaces(savedPlaces.filter(function filterOutCB(p) {
                    return p.properties.place_id !== placeId;
                }));
            }
        } else {
            setSavedPlaces([...savedPlaces, place]);
        }
    }

    function navigatePlaceACB(placeId) {
        const place = recoilResults.find(function findPlaceCB(p) {
            return p.properties.place_id === placeId;
        });
        setSelectedPlace(place);
    }

    function setSearchTextACB(newText) {
        //console.log("Presenter: setSearchTextACB called with", newText);
        setQuery(newText);
    }

    function categoryToggleACB(category, isAdd) {
        function filterRemoveCB(c) {
            return c !== category;
        }

        function updateStateCB(prev) {
            if (isAdd) {
                if (!prev.includes(category)) {
                    return [...prev, category];
                }
                return prev;
            } else {
                return prev.filter(filterRemoveCB);
            }
        }
        setSelectedCategories(updateStateCB);
    }

    function fetchCategoryACB(category, lon, lat) {
        //console.log("Fetching category:", category, "at", lon, lat);
        return searchPlaceCBs(category, lon, lat, 2000, 10);
    }

    function doSearchClickACB() {
        const address = query;
        if (!address) {
            alert("Please enter a city or address");
            return;
        }

        setRecoilLoading(true);
        setRecoilResults(null);

        function thenGeocodeCB(results) {
            if (!results || results.length === 0) {
                alert("No location found for this address");
                setRecoilLoading(null);
                return;
            }

            const lon = results[0].lon;
            const lat = results[0].lat;

            const categoriesToSearch = selectedCategories.length === 0
                ? ALL_CATEGORIES
                : selectedCategories;

            const fetchPromisesACB = categoriesToSearch.map(category =>
                fetchCategoryACB(category, lon, lat)
            );

            function thenPlaceCB(arrays) {
                const merged = arrays.flat();
                setRecoilResults(merged);
                setRecoilLoading(null);
            }

            function catchPlaceCB(err) {
                //console.error("Places API error:", err);
                alert("Error fetching places");
                setRecoilLoading(null);
            }

            Promise.all(fetchPromisesACB)
                .then(thenPlaceCB)
                .catch(catchPlaceCB);
        }

        function catchGeocodeCB(err) {
            //console.error("Geocode error:", err);
            alert("Error geocoding address");
            setRecoilLoading(null);
        }

        geocodeCB(address)
            .then(thenGeocodeCB)
            .catch(catchGeocodeCB);
    }

    function renderResultsACB() {
        if (recoilLoading) return <SearchResultsSuspenseView />;
        if (!recoilResults) return null;
        return (
            <SearchResultsView
                results={recoilResults.map(formatPlaceBase)}
                savedIds={savedPlaces.map(function mapIdCB(p) { return p.properties.place_id; })}
                setSavedPlaces={setSavedPlaces}
                onToggleFavorite={toggleFavoriteACB}
                onNavigate={navigatePlaceACB}
                user={user}
            />
        );
    }

    function searchCurrentLocationACB() {
        setRecoilLoading(true);
        setRecoilResults(null);
        navigator.geolocation.getCurrentPosition(geoSuccessCB, geoErrorCB);

        function geoSuccessCB(position) {
            const lon = position.coords.longitude;
            const lat = position.coords.latitude;

            const categoriesToSearch = selectedCategories.length === 0
                ? ALL_CATEGORIES
                : selectedCategories;

            const fetchPromisesACB = categoriesToSearch.map(fetchCategoryFromCoordsACB);

            function fetchCategoryFromCoordsACB(category) {
                return fetchCategoryACB(category, lon, lat);
            }

            function thenPlaceCB(arrays) {
                const merged = arrays.flat();
                setRecoilResults(merged);
                setRecoilLoading(null);
            }

            function catchPlaceCB(err) {
                //console.error("Places API error:", err);
                alert("Error fetching places");
                setRecoilLoading(null);
            }

            Promise.all(fetchPromisesACB)
                .then(thenPlaceCB)
                .catch(catchPlaceCB);
        }

        function geoErrorCB(error) {
            console.error("Geolocation error:", error);
            alert("Location access denied or unavailable");
            setRecoilLoading(null);
        }
    }

    return (
        <div>
            <SearchFormView
                query={query}
                onQueryChange={setSearchTextACB}
                onSearchClick={doSearchClickACB}
                selectedCategories={selectedCategories}
                onCategoryToggle={categoryToggleACB}
                onRequestCurrentLocation={searchCurrentLocationACB}
                categoryOptions={CATEGORY_OPTIONS}
            />
            {renderResultsACB()}
        </div>
    );
}
