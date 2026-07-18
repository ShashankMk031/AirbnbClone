"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { ListingDetail } from "../../types/listing";

interface LocationMapProps {
  listing: ListingDetail;
}

interface Coord {
  lat: number;
  lng: number;
  description: string;
}

const LOCATION_LOOKUP: Record<string, Coord> = {
  bangalore: {
    lat: 12.9716,
    lng: 77.5946,
    description: "Centrally located near Cubbon Park, cafes, and premium shopping areas.",
  },
  bengaluru: {
    lat: 12.9716,
    lng: 77.5946,
    description: "Centrally located near Cubbon Park, cafes, and premium shopping areas.",
  },
  mumbai: {
    lat: 19.0760,
    lng: 72.8777,
    description: "Vibrant neighborhood close to Marine Drive, top local restaurants, and transport.",
  },
  delhi: {
    lat: 28.6139,
    lng: 77.2090,
    description: "Heritage area near Connaught Place with monuments, markets, and metro access.",
  },
  hyderabad: {
    lat: 17.3850,
    lng: 78.4867,
    description: "Premium tech-hub locality near local bakeries, historic sites, and IT parks.",
  },
  goa: {
    lat: 15.2993,
    lng: 74.1240,
    description: "Relaxing beachside neighborhood close to water sports, shacks, and sun-kissed sands.",
  },
  kochi: {
    lat: 9.9312,
    lng: 76.2673,
    description: "Historic maritime quarter close to Chinese fishing nets, cafes, and art galleries.",
  }
};

export default function LocationMap({ listing }: LocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapError, setMapError] = useState(false);

  // Resolve coordinates and description
  let lat = listing.latitude;
  let lng = listing.longitude;
  let desc = "Great area close to restaurants, cafes and public transport.";

  const hasCoords = lat !== null && lat !== undefined && lng !== null && lng !== undefined && !isNaN(lat) && !isNaN(lng);

  if (!hasCoords) {
    const locLower = listing.location.toLowerCase();
    const matchedCity = Object.keys(LOCATION_LOOKUP).find(city => locLower.includes(city));
    if (matchedCity) {
      lat = LOCATION_LOOKUP[matchedCity].lat;
      lng = LOCATION_LOOKUP[matchedCity].lng;
      desc = LOCATION_LOOKUP[matchedCity].description;
    } else {
      // Default fallback coordinates (Bangalore)
      lat = 12.9716;
      lng = 77.5946;
      desc = "Great area close to local markets, dining, and premium stays.";
    }
  }

  const finalLat = lat as number;
  const finalLng = lng as number;

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current || mapError) return;

    // Load Leaflet dynamically inside useEffect to be completely safe from SSR / server webpack builds
    import("leaflet").then((L) => {
      try {
        if (!mapInstanceRef.current && mapContainerRef.current) {
          // Initialize map instance
          mapInstanceRef.current = L.map(mapContainerRef.current, {
            zoomControl: true,
            scrollWheelZoom: false,
          }).setView([finalLat, finalLng], 14);

          // Load open street map tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstanceRef.current);

          // Define absolute custom marker assets to prevent bundler reference errors
          const customIcon = L.icon({
            iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
            shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
          });

          // Add single marker pin
          L.marker([finalLat, finalLng], { icon: customIcon }).addTo(mapInstanceRef.current);
        }
      } catch (err) {
        console.error("Leaflet map rendering failed:", err);
        setMapError(true);
      }
    }).catch((err) => {
      console.error("Failed to load leaflet module dynamically:", err);
      setMapError(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [finalLat, finalLng, mapError]);

  return (
    <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Where you&apos;ll be
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {listing.location}
        </p>
      </div>

      {mapError ? (
        <div className="w-full h-[250px] md:h-[380px] bg-zinc-50 dark:bg-zinc-900/40 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center p-6 space-y-2">
          <span className="text-4xl">🗺️</span>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Map unavailable for this listing</h4>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-xs">
            Coordinates are missing or Leaflet map tiles failed to load in this environment.
          </p>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
          <div
            ref={mapContainerRef}
            className="w-full h-[250px] md:h-[380px] z-10"
          />
        </div>
      )}

      <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
        {desc}
      </p>
    </div>
  );
}
