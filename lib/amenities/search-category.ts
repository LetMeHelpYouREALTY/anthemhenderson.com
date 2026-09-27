import { ANTHEM_COMMUNITY_MAP } from "@/lib/amenities/anthem-amenities";

export type NearbyPlaceResult = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  mapsUri?: string;
};

const cache = new Map<string, Promise<NearbyPlaceResult[]>>();

function placeDisplayName(place: google.maps.places.Place): string {
  const displayName = place.displayName as string | { text?: string } | null | undefined;
  if (!displayName) return "Place";
  if (typeof displayName === "string") return displayName;
  return displayName.text ?? "Place";
}

function mapPlaceResult(
  place: google.maps.places.Place,
  index: number
): NearbyPlaceResult | null {
  const loc = place.location;
  if (!loc) return null;
  const { lat, lng } = loc.toJSON();
  const mapsUri = place.googleMapsURI;
  return {
    id: place.id ?? `place-${index}`,
    name: placeDisplayName(place),
    address: place.formattedAddress ?? "",
    lat,
    lng,
    ...(mapsUri ? { mapsUri } : {}),
  };
}

export function searchCategory(
  categoryId: string,
  types: string[]
): Promise<NearbyPlaceResult[]> {
  const cached = cache.get(categoryId);
  if (cached) return cached;

  const request = (async () => {
    const { Place } = (await google.maps.importLibrary(
      "places"
    )) as google.maps.PlacesLibrary;
    const center = {
      lat: ANTHEM_COMMUNITY_MAP.lat,
      lng: ANTHEM_COMMUNITY_MAP.lng,
    };
    const { places } = await Place.searchNearby({
      fields: ["displayName", "location", "formattedAddress", "googleMapsURI", "id"],
      locationRestriction: {
        center,
        radius: ANTHEM_COMMUNITY_MAP.searchRadiusMeters,
      },
      includedPrimaryTypes: types,
      maxResultCount: 10,
      rankPreference: "POPULARITY" as any,
    });

    const results: NearbyPlaceResult[] = [];
    places.forEach((place, index) => {
      const mapped = mapPlaceResult(place, index);
      if (mapped) results.push(mapped);
    });
    return results;
  })();

  request.catch(() => cache.delete(categoryId));
  cache.set(categoryId, request);
  return request;
}
