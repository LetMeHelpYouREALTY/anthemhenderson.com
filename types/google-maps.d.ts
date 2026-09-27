/** Minimal Google Maps JS API types for the amenity map (full types optional via @types/google.maps). */
declare namespace google.maps {
  class Map {
    constructor(el: HTMLElement, opts?: Record<string, unknown>);
  }
  class Marker {
    constructor(opts?: Record<string, unknown>);
    setMap(map: Map | null): void;
    addListener(event: string, handler: () => void): void;
  }
  class InfoWindow {
    constructor(opts?: Record<string, unknown>);
    setContent(content: string): void;
    open(opts: { map: Map; anchor?: Marker }): void;
  }
  interface LatLng {
    lat(): number;
    lng(): number;
  }
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }
  interface PlacesLibrary {
    Place?: {
      searchNearby: (request: Record<string, unknown>) => Promise<{
        places: Array<{
          id?: string;
          displayName?: string | { text?: string };
          formattedAddress?: string;
          location?: LatLng | LatLngLiteral;
          rating?: number;
        }>;
      }>;
    };
  }
  function importLibrary(name: string): Promise<PlacesLibrary | unknown>;
}

declare const google: {
  maps: typeof google.maps;
};
