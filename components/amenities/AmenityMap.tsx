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
import { loadGoogleMaps, mapsAuthFailed } from "@/lib/google-maps-loader";
import { searchCategory } from "@/lib/amenities/search-category";

const MAP_HEIGHT_PX = 420;

type MapPlace = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isCommunity?: boolean;
};

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

function buildInfoWindowContent(
  name: string,
  address: string,
  lat: number,
  lng: number
): HTMLElement {
  const wrap = document.createElement("div");
  wrap.style.maxWidth = "240px";
  wrap.style.fontFamily = "system-ui, sans-serif";

  const title = document.createElement("strong");
  title.textContent = name;
  wrap.appendChild(title);

  if (address) {
    wrap.appendChild(document.createElement("br"));
    const addr = document.createElement("span");
    addr.style.fontSize = "12px";
    addr.style.color = "#444";
    addr.textContent = address;
    wrap.appendChild(addr);
  }

  wrap.appendChild(document.createElement("br"));
  const link = document.createElement("a");
  link.href = buildDirectionsUrl(lat, lng);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Directions";
  wrap.appendChild(link);

  return wrap;
}

type AmenityMapProps = {
  defaultCategory?: AmenityCategoryId;
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
  const [useFallback, setUseFallback] = useState(!apiKey || mapsAuthFailed);
  const [places, setPlaces] = useState<MapPlace[]>(() =>
    getCuratedPlacesForCategory(defaultCategory).map(curatedToMapPlace)
  );

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, []);

  const enterFallback = useCallback(() => {
    setUseFallback(true);
    setMapReady(false);
    mapRef.current = null;
    clearMarkers();
  }, [clearMarkers]);

  const renderMarkers = useCallback(
    (map: google.maps.Map, items: MapPlace[]) => {
      if (!window.google?.maps?.importLibrary) return;
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
        infoWindow.setContent(
          buildInfoWindowContent(
            ANTHEM_COMMUNITY_MAP.name,
            ANTHEM_COMMUNITY_MAP.centerAddress,
            ANTHEM_COMMUNITY_MAP.lat,
            ANTHEM_COMMUNITY_MAP.lng
          )
        );
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
          infoWindow.setContent(
            buildInfoWindowContent(place.name, place.address, place.lat, place.lng)
          );
          infoWindow.open({ map, anchor: marker });
        });
        markersRef.current.push(marker);
      });
    },
    [clearMarkers]
  );

  const initMap = useCallback(async () => {
    if (!mapDivRef.current || mapRef.current || useFallback) return;
    const center = { lat: ANTHEM_COMMUNITY_MAP.lat, lng: ANTHEM_COMMUNITY_MAP.lng };
    const map = new google.maps.Map(mapDivRef.current, {
      center,
      zoom: ANTHEM_COMMUNITY_MAP.defaultZoom,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      ...(mapId ? { mapId } : {}),
    });
    mapRef.current = map;
    setMapReady(true);
  }, [mapId, useFallback]);

  const fetchNearbyPlaces = useCallback(
    async (category: AmenityCategoryId) => {
      const curated = getCuratedPlacesForCategory(category).map(curatedToMapPlace);
      if (useFallback || !mapRef.current) {
        setPlaces(curated);
        return;
      }

      const config = getCategoryConfig(category);
      try {
        const results = await searchCategory(category, config.placeTypes);
        const mapped: MapPlace[] = results.map((p) => ({
          id: p.id,
          name: p.name,
          address: p.address,
          lat: p.lat,
          lng: p.lng,
        }));
        const merged = mapped.length > 0 ? mapped : curated;
        setPlaces(merged);
        if (mapRef.current) renderMarkers(mapRef.current, merged);
      } catch {
        setPlaces(curated);
        if (mapRef.current) renderMarkers(mapRef.current, curated);
      }
    },
    [renderMarkers, useFallback]
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
    if (mapsAuthFailed) enterFallback();
  }, [enterFallback]);

  useEffect(() => {
    const onAuthFailure = () => enterFallback();
    window.addEventListener("gmaps:auth-failure", onAuthFailure);
    return () => window.removeEventListener("gmaps:auth-failure", onAuthFailure);
  }, [enterFallback]);

  useEffect(() => {
    if (!shouldLoad) return;
    if (!apiKey || mapsAuthFailed) {
      enterFallback();
      return;
    }

    let cancelled = false;
    loadGoogleMaps(apiKey)
      .then(() => {
        if (!cancelled) return initMap();
      })
      .catch(() => {
        if (!cancelled) enterFallback();
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, enterFallback, initMap, shouldLoad]);

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

  const listPlaces: CuratedPlace[] | MapPlace[] = useFallback
    ? getCuratedPlacesForCategory(activeCategory)
    : places.length > 0
      ? places
      : getCuratedPlacesForCategory(activeCategory);

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

      <ul className="mt-4 space-y-2" aria-label="Featured nearby places">
        {listPlaces.map((place) => (
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
    </div>
  );
}
