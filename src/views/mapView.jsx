import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"; 
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultIcon;

export function MapView(props) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const routeLayerRef = useRef(null);
  const prevIdsRef = useRef("");

  function createMapCB() {
    mapInstanceRef.current = L.map(mapRef.current).setView([59.334, 18.063], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(mapInstanceRef.current);

    markersGroupRef.current = L.featureGroup().addTo(mapInstanceRef.current);
  }

  function clearMarkersCB() {
    markersGroupRef.current.clearLayers();
  }

  function addMarkerCB(place) {
    L.marker([place.lat, place.lon])
      .bindPopup(place.name)
      .addTo(markersGroupRef.current);
  }

  function fitBoundsCB(places) {
    if (!places || places.length === 0) return;

    const bounds = L.latLngBounds(
      places.map(function mapToLatLngCB(place) {
        return [place.lat, place.lon];
      })
    );

    mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
  }

  function clearRouteCB() {
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }
  }

  function drawRouteCB() {
    clearRouteCB();
    if (!props.routeGeoJson) return;

    routeLayerRef.current = L.geoJSON(props.routeGeoJson, {
      style: function styleRouteCB() {
        return { color: "blue", weight: 5, opacity: 0.7 };
      }
    }).addTo(mapInstanceRef.current);
  }

  function updateMapCB() {
    clearMarkersCB();

    if (props.places) {
      props.places.forEach(addMarkerCB);

      // Creamos un string con todos los IDs de los lugares actuales
      // Ej: "id1,id2,id3"
      const currentIds = props.places.map(function (p) {
        return p.placeId || p.id; // Depende de cómo los llames en el mapeo
      }).join(",");

      // SOLO hacemos fitBounds si los IDs son diferentes (Búsqueda nueva)
      if (currentIds !== prevIdsRef.current) {
        fitBoundsCB(props.places);
        prevIdsRef.current = currentIds; // Actualizamos la referencia
      }
    }

    drawRouteCB();
  }

  function focusPlaceCB(place) {
    if (!place || !mapInstanceRef.current) return;
    mapInstanceRef.current.setView([place.lat, place.lon], 16);
  }

  useEffect(createMapCB, []);
  useEffect(updateMapCB, [props.places, props.routePlaces]);
  useEffect(function focusEffectACB() {
    if (props.focusedPlace) {
      focusPlaceCB(props.focusedPlace);
    }
  }, [props.focusedPlace]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
}
