"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  AMENITY_CATEGORIES,
  AMENITY_CATEGORY_ORDER,
  ANTHEM_COMMUNITY_MAP,
  getCategoryConfig,
  getCuratedPlacesForCategory,
  type AmenityCategoryId,
  type CuratedPlace,
} from "@/lib/amenities/anthem-amenities";

const MAP_HEIGHT_PX = 420;

type MapPlace = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating?: number;
  isCommunity?: boolean;
};

type GoogleMapsNamespace = typeof google.maps;

declare global {
  interface Window {
    google?: { maps: GoogleMapsNamespace };
  }
}

function buildDirectionsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

function curatedToMapPlace(place: CuratedPlace): MapPlace {
  return {
    id: place.id,
    name: place.name,
    address: place.address,
    lat: place.lat,
    lng: place.lng,
  };
}

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    'script[data-amenity-map-loader="true"]'
  );
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Maps script failed")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      apiKey
    )}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.amenityMapLoader = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Maps script failed"));
    document.head.appendChild(script);
  });
}

type AmenityMapProps = {
  /** Initial filter when the map loads */
  defaultCategory?: AmenityCategoryId;
  /** Hide category chips (e.g. compact homepage section still shows one row) */
  showFilters?: boolean;
  className?: string;
};

export default function AmenityMap({
  defaultCategory = "healthcare",
  showFilters = true,
  className = "",
}: AmenityMapProps) {
  const mapRegionId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID?.trim();

  const [activeCategory, setActiveCategory] = useState<AmenityCategoryId>(defaultCategory);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [useFallback, setUseFallback] = useState(!apiKey);
  const [places, setPlaces] = useState<MapPlace[]>(() =>
    getCuratedPlacesForCategory(defaultCategory).map(curatedToMapPlace)
  );
  const [loadError, setLoadError] = useState<string | null>(null);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, []);

  const renderMarkers = useCallback(
    (map: google.maps.Map, items: MapPlace[]) => {
      if (!window.google?.maps) return;
      clearMarkers();
      const infoWindow =
        infoWindowRef.current ?? new window.google.maps.InfoWindow();
      infoWindowRef.current = infoWindow;

      const communityMarker = new window.google.maps.Marker({
        map,
        position: { lat: ANTHEM_COMMUNITY_MAP.lat, lng: ANTHEM_COMMUNITY_MAP.lng },
        title: ANTHEM_COMMUNITY_MAP.name,
        label: { text: "★", color: "#ffffff", fontWeight: "700" },
        zIndex: 1000,
      });
      markersRef.current.push(communityMarker);

      communityMarker.addListener("click", () => {
        const content = `<div style="max-width:240px;font-family:system-ui,sans-serif">
          <strong>${ANTHEM_COMMUNITY_MAP.name}</strong><br/>
          <span style="font-size:12px;color:#444">${ANTHEM_COMMUNITY_MAP.centerAddress}</span><br/>
          <a href="${buildDirectionsUrl(ANTHEM_COMMUNITY_MAP.lat, ANTHEM_COMMUNITY_MAP.lng)}" target="_blank" rel="noopener noreferrer">Directions</a>
        </div>`;
        infoWindow.setContent(content);
        infoWindow.open({ map, anchor: communityMarker });
      });

      items.forEach((place) => {
        if (place.isCommunity) return;
        const marker = new window.google.maps.Marker({
          map,
          position: { lat: place.lat, lng: place.lng },
          title: place.name,
        });
        marker.addListener("click", () => {
          const ratingLine =
            place.rating != null
              ? `<br/><span style="font-size:12px">Rating: ${place.rating.toFixed(1)}</span>`
              : "";
          const content = `<div style="max-width:240px;font-family:system-ui,sans-serif">
            <strong>${place.name}</strong>${ratingLine}<br/>
            <span style="font-size:12px;color:#444">${place.address}</span><br/>
            <a href="${buildDirectionsUrl(place.lat, place.lng)}" target="_blank" rel="noopener noreferrer">Directions</a>
          </div>`;
          infoWindow.setContent(content);
          infoWindow.open({ map, anchor: marker });
        });
        markersRef.current.push(marker);
      });
    },
    [clearMarkers]
  );

  const initMap = useCallback(() => {
    if (!mapDivRef.current || !window.google?.maps || mapRef.current) return;

    const center = { lat: ANTHEM_COMMUNITY_MAP.lat, lng: ANTHEM_COMMUNITY_MAP.lng };
    const map = new window.google.maps.Map(mapDivRef.current, {
      center,
      zoom: ANTHEM_COMMUNITY_MAP.defaultZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      ...(mapId ? { mapId } : {}),
    });
    mapRef.current = map;
    setMapReady(true);
  }, [mapId]);

  const fetchNearbyPlaces = useCallback(
    async (category: AmenityCategoryId) => {
      const curated = getCuratedPlacesForCategory(category).map(curatedToMapPlace);
      if (!apiKey || useFallback || !mapRef.current || !window.google?.maps) {
        setPlaces(curated);
        if (mapRef.current) renderMarkers(mapRef.current, curated);
        return;
      }

      const config = getCategoryConfig(category);
      try {
        const placesLib = (await window.google.maps.importLibrary(
          "places"
        )) as google.maps.PlacesLibrary;
        const { Place } = placesLib as {
          Place: {
            searchNearby: (request: Record<string, unknown>) => Promise<{
              places: Array<{
                id?: string;
                displayName?: string;
                formattedAddress?: string;
                location?: google.maps.LatLng | google.maps.LatLngLiteral;
                rating?: number;
              }>;
            }>;
          };
        };

        if (!Place?.searchNearby) {
          setPlaces(curated);
          if (mapRef.current) renderMarkers(mapRef.current, curated);
          return;
        }

        const { places: results } = await Place.searchNearby({
          fields: ["displayName", "location", "formattedAddress", "rating", "id"],
          locationRestriction: {
            circle: {
              center: {
                lat: ANTHEM_COMMUNITY_MAP.lat,
                lng: ANTHEM_COMMUNITY_MAP.lng,
              },
              radius: ANTHEM_COMMUNITY_MAP.searchRadiusMeters,
            },
          },
          includedPrimaryTypes: config.placeTypes,
          maxResultCount: 12,
        });

        const mapped: MapPlace[] = [];
        results.forEach((p, index) => {
          const loc = p.location;
          if (!loc) return;
          const lat = typeof loc.lat === "function" ? loc.lat() : loc.lat;
          const lng = typeof loc.lng === "function" ? loc.lng() : loc.lng;
          const name =
            typeof p.displayName === "string"
              ? p.displayName
              : (p.displayName as { text?: string } | undefined)?.text ?? "Place";
          mapped.push({
            id: p.id ?? `place-${index}`,
            name,
            address: p.formattedAddress ?? "",
            lat: lat as number,
            lng: lng as number,
            ...(p.rating != null ? { rating: p.rating } : {}),
          });
        });

        const merged = mapped.length > 0 ? mapped : curated;
        setPlaces(merged);
        renderMarkers(mapRef.current, merged);
      } catch {
        setPlaces(curated);
        if (mapRef.current) renderMarkers(mapRef.current, curated);
      }
    },
    [apiKey, renderMarkers, useFallback]
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node || shouldLoad) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShouldLoad(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    observerRef.current.observe(node);
    return () => observerRef.current?.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || useFallback) return;

    let cancelled = false;
    (async () => {
      try {
        await loadGoogleMapsScript(apiKey);
        if (cancelled) return;
        initMap();
      } catch {
        if (!cancelled) {
          setUseFallback(true);
          setLoadError(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [apiKey, initMap, shouldLoad, useFallback]);

  useEffect(() => {
    if (!mapReady || useFallback || !mapRef.current) return;
    fetchNearbyPlaces(activeCategory);
  }, [activeCategory, fetchNearbyPlaces, mapReady, useFallback]);

  useEffect(() => {
    if (!mapReady || useFallback || !mapRef.current) return;
    renderMarkers(mapRef.current, places);
  }, [mapReady, places, renderMarkers, useFallback]);

  useEffect(() => {
    if (useFallback) {
      setPlaces(getCuratedPlacesForCategory(activeCategory).map(curatedToMapPlace));
    }
  }, [activeCategory, useFallback]);

  const embedSrc = `https://www.google.com/maps?q=${ANTHEM_COMMUNITY_MAP.lat},${ANTHEM_COMMUNITY_MAP.lng}&z=14&output=embed`;

  const filterCategories = AMENITY_CATEGORY_ORDER.map((id) =>
    AMENITY_CATEGORIES.find((c) => c.id === id)
  ).filter(Boolean) as typeof AMENITY_CATEGORIES;

  return (
    <div ref={containerRef} className={className}>
      {showFilters && (
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter nearby places by category"
        >
          {filterCategories.map((cat) => {
            const selected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={mapRegionId}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                } ${cat.id === "schools" ? "opacity-80" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      <div
        id={mapRegionId}
        className="relative w-full overflow-hidden rounded-xl border border-border bg-muted"
        style={{ minHeight: MAP_HEIGHT_PX, height: MAP_HEIGHT_PX }}
        aria-label={`Map of ${ANTHEM_COMMUNITY_MAP.name} and nearby ${getCategoryConfig(activeCategory).label.toLowerCase()}`}
      >
        {useFallback ? (
          <iframe
            title={`Map of ${ANTHEM_COMMUNITY_MAP.name}, Henderson`}
            src={embedSrc}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div ref={mapDivRef} className="h-full w-full" />
        )}
      </div>

      {loadError && (
        <p className="mt-2 text-xs text-muted-foreground" role="status">{loadError}</p>
      )}

      <ul className="mt-4 space-y-2" aria-label="Featured nearby places">
        {(useFallback
          ? getCuratedPlacesForCategory(activeCategory)
          : places.length > 0
            ? places.map((p) => ({
                id: p.id,
                name: p.name,
                address: p.address,
                category: activeCategory,
                schemaType: "Place",
                lat: p.lat,
                lng: p.lng,
              }))
            : getCuratedPlacesForCategory(activeCategory)
        ).map((place) => (
          <li
            key={place.id}
            className="flex flex-col gap-0.5 rounded-lg border border-border bg-card px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="font-medium text-foreground">{place.name}</span>
              <p className="text-xs text-muted-foreground">{place.address}</p>
            </div>
            <a
              href={buildDirectionsUrl(place.lat, place.lng)}
              className="text-xs font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Directions
            </a>
          </li>
        ))}
      </ul>

      {!apiKey && (
        <p className="mt-3 text-xs text-muted-foreground">
          Interactive place search appears when{" "}
          <code className="text-[11px]">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> is set in Vercel.
          Until then, this map uses a Google embed plus verified local listings below.
        </p>
      )}
    </div>
  );
}
