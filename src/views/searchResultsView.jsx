import React from "react";
import { Frown } from "lucide-react";
import { MapPresenter } from "@/presenters/mapPresenter.jsx";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Heart, ArrowRight } from "lucide-react";
import { PlaceCard } from "@/components/ui/place-card";

export function SearchResultsView(props) {

  function renderPlaceCB(place) {
    const isFavorite = props.savedIds.includes(place.placeId);

    function onFavoriteACB() {
      if (!props.user) {  // if user is not logged in show alert
        alert("You need to log in to save places.");
        return;
      }

      props.onToggleFavorite(place.placeId);
    }

    function onNavigateACB() {
      props.onNavigate(place.placeId);
    }

    const actionButtons = [
      {
        condition: true,  // Always show favorite button
        onClickACB: onFavoriteACB,
        variant: isFavorite ? "default" : "outline",
        className: "flex-1 gap-1 sm:gap-2 py-3",
        icon: Heart,
        iconClass: "w-2 h-2 sm:w-4 sm:h-4",
        label: isFavorite ? "Remove" : "Save"
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
    ];

    return (
      <PlaceCard
        key={place.placeId}
        header={place.name}
        location={place.address}
        icon={place.categoryIcon}
        categoryLabel={place.categoryLabel}
        isFavorite={isFavorite}
        website={place.website}
        phone={place.phone}
        wheelchairAccessible={place.wheelchairAccessible}
        actionButtons={actionButtons}
      />
    );
  }

  function renderResultsACB() {
    // Extra safety: ensure results is an array
    const results = Array.isArray(props.results) ? props.results : [];

    if (results.length === 0) {
      return renderNoResultsACB();
    }

    return (
      <>
        {renderResultsMobileACB(results)}
        {renderResultsDesktopACB(results)}
      </>
    );
  }

  function renderResultsMobileACB(results) {
    return (
      <div className="md:hidden flex flex-col items-center w-full gap-3">
        <div className="h-[50vh] w-full z-0">
          <MapPresenter />
        </div>
        <Carousel className="max-w-9/12">
          <CarouselContent>
            {results.map(renderCarouselItemCB)}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    );
  }

  function renderCarouselItemCB(place, index) {
    return (
      <CarouselItem key={place?.properties?.place_id || index}>
        {renderPlaceCB(place)}
      </CarouselItem>
    );
  }

  function renderResultsDesktopACB(results) {
    return (
      <div className="hidden md:grid grid-cols-2 gap-6 h-[92vh] min-h-[300px]">
        <div className="flex flex-col overflow-scroll">
          <div className="flex flex-col gap-4">
            {results.map(renderPlaceCB)}
          </div>
        </div>
        <div className="z-0">
          <MapPresenter />
        </div>
      </div>
    );
  }

  function renderNoResultsACB() {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Frown className="w-12 h-12" />
        </div>
        <h3 className="text-lg font-semibold mb-1">No results found</h3>
        <p className="text-sm text-center max-w-sm">
          Try adjusting your search or search types
        </p>
      </div>
    );
  }

  return (
    <div className="global-px py-8 sm:py-10">
      <h2 className="font-semibold tracking-tight text-2xl sm:text-3xl mb-4">
        Search Results
      </h2>
      {renderResultsACB()}
    </div>
  );
}