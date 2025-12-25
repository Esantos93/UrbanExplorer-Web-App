import React, { useEffect, useRef } from "react";
import { PlaceCard } from "@/components/ui/place-card";

import { Loader2, Sparkles, Heart, ArrowRight, Route, Frown, MapPin } from "lucide-react";

export function FavoritesView(props) {
  const factBoxRef = useRef(null);

  useEffect(function scrollToFactACB() {
    if ((props.currentFact || props.isLoading) && factBoxRef.current) {
      factBoxRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }, [props.currentFact, props.isLoading]);

  function favoritePlaceCB(place) {
    function onRemoveFavoriteACB() {
      const confirmRemove = window.confirm(
        `Remove ${place.name} from your saved places?`
      );
      if (confirmRemove) props.onRemove(place.placeId);
    }

    function onNavigateACB() {
      if (props.onNavigate) props.onNavigate(place);
    }

    function onGetFactACB() {
      if (props.onRequestFact) props.onRequestFact(place.name);
    }

    function onAddToRouteACB() {
      if (props.onAddToRoute) props.onAddToRoute(place);
    }

    const buttonLabel = props.getAddToRouteLabel(place);
    const inRange = props.isPlaceInRange(place);
    const isLoggedIn = Boolean(props.user);
    const isThisCardLoading = props.isLoading === place.name;

    const actionButtons = [
      {
        condition: onGetFactACB,
        onClickACB: onGetFactACB,
        variant: "outline",
        className: "w-full justify-center gap-2 border-accent-200 hover:bg-accent-50 hover:border-accent-300",
        disabled: isThisCardLoading,
        icon: isThisCardLoading ? Loader2 : Sparkles,
        iconClass: isThisCardLoading ? "w-4 h-4 animate-spin text-accent-600" : "w-4 h-4 text-accent-600",
        label: isThisCardLoading ? "Thinking..." : "Do you want to know more?",
        labelClass: "font-medium"
      },
      {
        condition: isLoggedIn,
        onClickACB: onRemoveFavoriteACB,
        variant: "default",
        className: "flex-1 gap-1 sm:gap-2 py-3",
        icon: Heart,
        iconClass: "w-2 h-2 sm:w-4 sm:h-4",
        label: "Remove"
      },
      {
        condition: onNavigateACB,
        onClickACB: onNavigateACB,
        variant: "default",
        className: "flex-1 gap-1 sm:gap-2 py-3",
        label: "Navigate",
        labelClass: "font-medium",
        icon: ArrowRight,
        iconClass: "w-2 h-2 sm:w-4 sm:h-4"
      },
      {
        condition: onAddToRouteACB,
        onClickACB: onAddToRouteACB,
        variant: "default",
        disabled: !inRange,
        className: "flex-1 gap-1 sm:gap-2 py-3 min-w-33",
        label: buttonLabel || "Add to route",
        labelClass: "font-medium",
        icon: Route,
        iconClass: "w-2 h-2 sm:w-4 sm:h-4"
      }
    ];


    return (
      <PlaceCard
        key={place.placeId}
        location={place.address}
        header={place.name}
        icon={place.categoryIcon}
        categoryLabel={place.categoryLabel}
        isFavorite={true}
        website={place.website}
        phone={place.phone}
        wheelchairAccessible={place.wheelchairAccessible}
        actionButtons={actionButtons}
      />
    );
  }

  function renderCityFilter() {
    if (!props.user || !props.allPlaces || props.allPlaces.length === 0) return null;
    if (!props.cities) return null;

    function searchAllCitiesACB() {
      props.onCityChange("all");
    }

    return (
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">Filter by city:</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={searchAllCitiesACB}
            className={`px-4 py-2 rounded-lg text-sm font-medium 
              ${props.selectedCity === "all"
                ? "bg-accent-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}>
            All Cities ({props.allPlaces.length})
          </button>

          {props.cities.map(city => {
            const count = props.getCityCount(city);

            function changeCityACB() {
              props.onCityChange(city)
            }

            return (
              <button
                key={city}
                onClick={changeCityACB}
                className={`px-4 py-2 rounded-lg text-sm font-medium 
                  ${props.selectedCity === city
                    ? "bg-accent-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}>

                {city} ({count})
              </button>
            );

          })}
        </div>
      </div>
    );
  }

  function renderFavorites() {
    function loginHandlerACB() {
      props.onLogin();
    }

    if (!props.user) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Frown className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            Please log in to save places
          </h3>
          <p className="text-sm text-center max-w-sm">
            You need to be logged in to save and access your favorite places.
          </p>
          <button
            className="btn btn-primary mt-4"
            onClick={loginHandlerACB}
          >
            Login with Google
          </button>
        </div>
      );
    }

    if (props.places.length === 0 && props.selectedCity !== "all" && props.allPlaces.length !== 0) {
      return (
        <>
          {renderCityFilter()}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <MapPin className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No places in {props.selectedCity}</h3>
            <p className="text-sm text-center max-w-sm">
              Try selecting a different city or view all places.
            </p>
          </div>
        </>
      );
    }

    if (!props.places || props.places.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Frown className="w-12 h-12" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No saved places yet</h3>
          <p className="text-sm text-center max-w-sm">
            Save places you like from the search results and they'll appear here
            for quick access.
          </p>
        </div>
      );
    }

    function renderFactSection() {
      if (!props.currentFact && !props.isLoading) return null;

      return (
        <div
          ref={factBoxRef}
          className="mt-8 p-6 border rounded-xl bg-gradient-to-r to-blue-50 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold">
            <Sparkles className="w-5 h-5" />
            <span>
              {props.isLoading
                ? "Searching for something interesting..."
                : `Interesting fact about ${props.currentFact.placeName}!`}
            </span>
          </div>
          <p className="text-gray-700 italic leading-relaxed">
            {props.isLoading
              ? (`Searching for an interesting fact about ${props.isLoading}...`)
              : (
                <>
                  <strong className="font-bold">{props.currentFact.prefix}</strong>
                  {props.currentFact.text}
                </>
              )
            }
          </p>
        </div>
      );
    }

    return (
      <>
        {renderCityFilter()}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4 sm:py-8">
          {props.places.map(favoritePlaceCB)}
        </div>
        {renderFactSection()}
      </>
    );
  }

  return (
    <div className="global-px py-8 sm:py-10 flex flex-col">
      <h2 className="font-semibold tracking-tight text-2xl sm:text-3xl">
        Favorite places
      </h2>
      {renderFavorites()}
      {props.mapElement && (
        <>
          <div className="py-8 sm:py-10 flex flex-col">
            <h2 className="text-xl font-semibold tracking-tight text-2xl sm:text-3xl">
              Create your own Route of your Favorite Places
            </h2>
          </div>
          <div className="w-full h-[80vh]">
            {props.mapElement}
          </div>
        </>
      )}
    </div>
  );
}