/**
 * Anthem Henderson amenity map — community center, categories, and verified curated places.
 * Center: Sun City Anthem Anthem Center (official HOA clubhouse address).
 * @see https://www.scahoa.com/ — 2450 Hampton Rd, Henderson, NV 89052
 * Coordinates: OpenStreetMap Nominatim for "Anthem Center" at that address (2026-09).
 */

export type AmenityCategoryId =
  | "healthcare"
  | "golf"
  | "parks"
  | "community"
  | "grocery"
  | "restaurants"
  | "cafes"
  | "shopping"
  | "pharmacies"
  | "fitness"
  | "parking"
  | "schools";

export type CuratedPlace = {
  id: string;
  name: string;
  address: string;
  category: AmenityCategoryId;
  schemaType: string;
  lat: number;
  lng: number;
  note?: string;
};

/** Map pin + search origin for the Anthem master plan (Anthem Center clubhouse). */
export const ANTHEM_COMMUNITY_MAP = {
  name: "Anthem Henderson",
  shortName: "Anthem",
  city: "Henderson",
  state: "NV",
  centerLabel: "Anthem Center (Sun City Anthem)",
  centerAddress: "2450 Hampton Rd, Henderson, NV 89052",
  lat: 35.9563105,
  lng: -115.0957956,
  defaultZoom: 13,
  searchRadiusMeters: 8000,
};

/**
 * Category order for 55+ / active-adult heavy Anthem sites: healthcare & recreation first; schools last.
 */
export const AMENITY_CATEGORY_ORDER: AmenityCategoryId[] = [
  "healthcare",
  "golf",
  "parks",
  "community",
  "grocery",
  "restaurants",
  "cafes",
  "fitness",
  "shopping",
  "pharmacies",
  "parking",
  "schools",
];

export type AmenityCategoryConfig = {
  id: AmenityCategoryId;
  label: string;
  /** Google Places (New) primary types for searchNearby */
  placeTypes: string[];
  /** Shown in filter UI for 55+ communities */
  emphasized?: boolean;
};

export const AMENITY_CATEGORIES: AmenityCategoryConfig[] = [
  {
    id: "healthcare",
    label: "Healthcare",
    placeTypes: ["hospital", "doctor"],
    emphasized: true,
  },
  {
    id: "golf",
    label: "Golf",
    placeTypes: ["golf_course"],
    emphasized: true,
  },
  {
    id: "parks",
    label: "Parks",
    placeTypes: ["park"],
    emphasized: true,
  },
  {
    id: "community",
    label: "Recreation",
    placeTypes: ["community_center", "sports_complex"],
    emphasized: true,
  },
  {
    id: "grocery",
    label: "Grocery",
    placeTypes: ["grocery_store", "supermarket"],
    emphasized: true,
  },
  {
    id: "restaurants",
    label: "Restaurants",
    placeTypes: ["restaurant"],
  },
  {
    id: "cafes",
    label: "Cafes",
    placeTypes: ["cafe", "coffee_shop"],
  },
  {
    id: "fitness",
    label: "Fitness",
    placeTypes: ["gym", "fitness_center"],
  },
  {
    id: "shopping",
    label: "Shopping",
    placeTypes: ["shopping_mall", "department_store"],
  },
  {
    id: "pharmacies",
    label: "Pharmacies",
    placeTypes: ["pharmacy", "drugstore"],
  },
  {
    id: "parking",
    label: "Parking",
    placeTypes: ["parking"],
  },
  {
    id: "schools",
    label: "Schools",
    placeTypes: ["school", "primary_school", "secondary_school"],
  },
];

/** Verified places with published street addresses (used for fallback map list + ItemList schema). */
export const CURATED_ANTHEM_PLACES: CuratedPlace[] = [
  {
    id: "anthem-center",
    name: "Anthem Center (Sun City Anthem)",
    address: "2450 Hampton Rd, Henderson, NV 89052",
    category: "community",
    schemaType: "SportsActivityLocation",
    lat: 35.9563105,
    lng: -115.0957956,
    note: "Main 55+ clubhouse with pools, fitness, and valley views.",
  },
  {
    id: "independence-center",
    name: "Independence Center",
    address: "2460 Hampton Rd, Henderson, NV 89052",
    category: "community",
    schemaType: "SportsActivityLocation",
    lat: 35.9568,
    lng: -115.0965,
    note: "Sun City Anthem recreation center with Freedom Hall.",
  },
  {
    id: "liberty-center",
    name: "Liberty Center",
    address: "2211 Somersworth Dr, Henderson, NV 89044",
    category: "community",
    schemaType: "SportsActivityLocation",
    lat: 35.9682,
    lng: -115.1028,
    note: "Sun City Anthem recreation center with indoor pool and pickleball.",
  },
  {
    id: "revere-golf",
    name: "Revere Golf Club",
    address: "2600 W Anthem Club Dr, Henderson, NV 89052",
    category: "golf",
    schemaType: "GolfCourse",
    lat: 35.9625,
    lng: -115.0892,
  },
  {
    id: "smiths-eastern",
    name: "Smith's Food and Drug",
    address: "10616 S Eastern Ave, Henderson, NV 89052",
    category: "grocery",
    schemaType: "GroceryStore",
    lat: 35.9992,
    lng: -115.1183,
    note: "Horizon Marketplace — primary grocery for Anthem.",
  },
  {
    id: "st-rose-siena",
    name: "St. Rose Dominican Hospital — Siena Campus",
    address: "3001 St Rose Pkwy, Henderson, NV 89052",
    category: "healthcare",
    schemaType: "Hospital",
    lat: 36.0031,
    lng: -115.1174,
  },
  {
    id: "henderson-hospital",
    name: "Henderson Hospital",
    address: "1050 W Galleria Dr, Henderson, NV 89011",
    category: "healthcare",
    schemaType: "Hospital",
    lat: 36.0729,
    lng: -115.0298,
  },
  {
    id: "galleria-sunset",
    name: "Galleria at Sunset",
    address: "1300 W Sunset Rd, Henderson, NV 89014",
    category: "shopping",
    schemaType: "ShoppingCenter",
    lat: 36.0636,
    lng: -115.0365,
  },
  {
    id: "district-green-valley",
    name: "The District at Green Valley Ranch",
    address: "2240 Village Walk Dr, Henderson, NV 89052",
    category: "shopping",
    schemaType: "ShoppingCenter",
    lat: 36.0211,
    lng: -115.0842,
  },
  {
    id: "sloan-canyon",
    name: "Sloan Canyon National Conservation Area",
    address: "Sloan Canyon Access Rd, Henderson, NV 89052",
    category: "parks",
    schemaType: "Park",
    lat: 35.988,
    lng: -115.128,
    note: "Trail access from the Anthem foothills.",
  },
  {
    id: "yorktown-grill",
    name: "Yorktown Grill",
    address: "2450 Hampton Rd, Henderson, NV 89052",
    category: "restaurants",
    schemaType: "Restaurant",
    lat: 35.9564,
    lng: -115.0959,
    note: "On-site dining at Sun City Anthem.",
  },
];

export const AMENITIES_PAGE_FAQS = [
  {
    question: "What grocery stores are near Anthem Henderson?",
    answer:
      "Smith's Food and Drug at 10616 S Eastern Ave in the Horizon Marketplace is the closest full-service grocery for most Anthem addresses, with pharmacy and curbside pickup.",
  },
  {
    question: "How far is Anthem Henderson from the Las Vegas Strip?",
    answer:
      "Anthem sits in southeast Henderson, roughly 20–25 miles from the central Las Vegas Strip. In typical traffic, plan on an approximate 25–45 minute drive depending on time of day and route.",
  },
  {
    question: "Are there hospitals near Anthem Henderson?",
    answer:
      "Yes. St. Rose Dominican Hospital — Siena Campus on St Rose Parkway and Henderson Hospital near Galleria Drive are both within a short drive of Anthem for emergency and specialty care.",
  },
  {
    question: "Where do Sun City Anthem residents recreate?",
    answer:
      "Sun City Anthem homeowners use three recreation centers — Anthem Center on Hampton Road, Independence Center, and Liberty Center on Somersworth Drive — with pools, fitness, pickleball, and club programming.",
  },
  {
    question: "Is there golf near Anthem Henderson?",
    answer:
      "Revere Golf Club borders the Anthem Country Club area on Anthem Club Drive. Anthem Country Club is a separate private club inside the guard-gated community.",
  },
  {
    question: "How far is Harry Reid International Airport from Anthem?",
    answer:
      "Harry Reid International Airport is approximately 15–20 miles northwest of Anthem. Drive time is often roughly 20–35 minutes in normal traffic (approximate).",
  },
  {
    question: "Can I walk to shopping from Anthem?",
    answer:
      "Most Anthem residents drive to Horizon Marketplace on Eastern Avenue or to The District at Green Valley Ranch for dining and retail; foothill terrain makes walking-only errands uncommon.",
  },
  {
    question: "Who helps buyers compare Anthem sub-communities?",
    answer:
      "Dr. Jan Duffy (NV Lic. S.0197614.LLC) with Berkshire Hathaway HomeServices Nevada Properties specializes in Sun City Anthem, Solera, Country Club, and Highlands — call (702) 222-1964 for live comps.",
  },
];

export function getCategoryConfig(id: AmenityCategoryId): AmenityCategoryConfig {
  const found = AMENITY_CATEGORIES.find((c) => c.id === id);
  if (!found) {
    throw new Error(`Unknown amenity category: ${id}`);
  }
  return found;
}

export function getCuratedPlacesForCategory(category: AmenityCategoryId): CuratedPlace[] {
  return CURATED_ANTHEM_PLACES.filter((p) => p.category === category);
}
