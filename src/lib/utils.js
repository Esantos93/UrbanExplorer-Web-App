import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import {
  House,
  Bike,
  Apple,
  ShoppingBag,
  GraduationCap,
  Drama,
  Heart,
  Palmtree,
  ParkingCircle,
  Train,
  Wrench,
  Trophy,
  Camera,

  Plane,
  Siren,
  Baby,
  Building2,
  Trees,
  Mountain,
  Landmark,
  Key,
  PawPrint,
  Factory,
  TramFront,
  Zap,
  Church,
  Tent,
  Droplets,
  Waves,
  Wine,
  Snowflake,
} from "lucide-react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_OPTIONS = [
  { value: "accommodation", label: "Accommodation", icon: House },
  { value: "activity", label: "Activity", icon: Bike },
  { value: "catering", label: "Food & Drink", icon: Apple },
  { value: "commercial", label: "Shopping", icon: ShoppingBag },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "entertainment", label: "Entertainment", icon: Drama },
  { value: "healthcare", label: "Healthcare", icon: Heart },
  { value: "leisure", label: "Leisure", icon: Palmtree },
  { value: "parking", label: "Parking", icon: ParkingCircle },
  { value: "public_transport", label: "Public transport", icon: Train },
  { value: "service", label: "Services", icon: Wrench },
  { value: "sport", label: "Sports", icon: Trophy },
  { value: "tourism", label: "Tourism", icon: Camera },
  { value: "airport", label: "Airport", icon: Plane },
  { value: "emergency", label: "Emergency", icon: Siren },
  { value: "childcare", label: "Childcare", icon: Baby },
  { value: "office", label: "Offices", icon: Building2 },
  { value: "natural", label: "Nature", icon: Trees },
  { value: "national_park", label: "National Parks", icon: Mountain },
  { value: "man_made", label: "Landmarks", icon: Landmark },
  { value: "rental", label: "Rentals", icon: Key },
  { value: "pet", label: "Pet Services", icon: PawPrint },
  { value: "production", label: "Industry", icon: Factory },
  { value: "railway", label: "Railway", icon: TramFront },
  { value: "power", label: "Energy", icon: Zap },
  { value: "religion", label: "Religion", icon: Church },
  { value: "camping", label: "Camping", icon: Tent },
  { value: "amenity", label: "Amenities", icon: Droplets },
  { value: "beach", label: "Beaches", icon: Waves },
  { value: "adult", label: "Nightlife", icon: Wine },
  { value: "ski", label: "Skiing", icon: Snowflake },
];

export const ALL_CATEGORIES = CATEGORY_OPTIONS.map(option => option.value);
export const CATEGORY_MAP = new Map(CATEGORY_OPTIONS.map(opt => [opt.value, opt]));


export function findMatchingCategory(categories) {
  categories = categories || [];
  const matchingCategory = categories.find(cat => CATEGORY_MAP.has(cat)) || "";
  const categoryOption = CATEGORY_MAP.get(matchingCategory);

  return {
    categoryValue: matchingCategory,
    categoryLabel: categoryOption?.label || "Other",
    categoryIcon: categoryOption?.icon || null
  };
}

export function formatPlaceBase(place) {
  if (!place || !place.properties) return null;

  const { categoryValue, categoryLabel, categoryIcon } = findMatchingCategory(place.properties.categories);

  return {
    placeId: place.properties.place_id,
    name: place.properties.name || place.properties.address_line1 || "Unnamed place",
    address: place.properties.address_line2 || "No address",
    city: place.properties.city,
    website: place.properties.website,
    phone: place.properties.contact?.phone,
    wheelchairAccessible: place.properties.facilities?.wheelchair || false,
    categoryValue,
    categoryLabel,
    categoryIcon,
    originalPlace: place
  };
}

export function getCoordinates(place) {
  const geom = place.geometry || place.originalPlace?.geometry;
  if (!geom || !geom.coordinates) return null;
  const [lon, lat] = geom.coordinates;
  return { lat: lat, lon: lon, string: lat + "," + lon };
}

export function removeDuplicatesById(items, getIdFn) {
  if (!items || items.length === 0) return [];
  const seen = new Set();
  return items.filter(function getItemIdCB(item) {
    const id = getIdFn(item);
    if (!id || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}