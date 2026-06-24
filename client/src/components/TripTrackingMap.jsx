import React, { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getDefaultCenter } from "../utils/geolocation";
import "./TripTrackingMap.css";

/** Top-down car silhouette; rotates with GPS heading when available. */
const createVehicleIcon = (heading) => {
  const rotation = heading != null && heading >= 0 ? heading : 0;

  return L.divIcon({
    className: "trip-vehicle-marker",
    html: `
      <div class="trip-vehicle-marker__inner" style="transform: rotate(${rotation}deg)">
        <svg viewBox="0 0 32 48" width="32" height="48" aria-hidden="true">
          <ellipse cx="16" cy="24" rx="14" ry="20" fill="rgba(102, 126, 234, 0.18)" />
          <path
            d="M10 8h12c2.2 0 4 1.8 4 4v3.5c1.2.8 2 2.1 2 3.6v8.8c0 1.1-.9 2-2 2h-1.2a2.8 2.8 0 0 1-5.6 0h-5.4a2.8 2.8 0 0 1-5.6 0H8c-1.1 0-2-.9-2-2v-8.8c0-1.5.8-2.8 2-3.6V12c0-2.2 1.8-4 4-4z"
            fill="#667eea"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
          <rect x="11" y="11" width="4.5" height="7" rx="1" fill="#ffffff" opacity="0.9" />
          <rect x="16.5" y="11" width="4.5" height="7" rx="1" fill="#ffffff" opacity="0.9" />
          <rect x="12" y="30" width="8" height="5" rx="1" fill="#ffffff" opacity="0.75" />
        </svg>
      </div>
    `,
    iconSize: [32, 48],
    iconAnchor: [16, 24],
    popupAnchor: [0, -20],
  });
};

const MapFollowVehicle = ({ latitude, longitude, follow }) => {
  const map = useMap();

  useEffect(() => {
    if (!follow || latitude == null || longitude == null) return;
    map.flyTo([latitude, longitude], Math.max(map.getZoom(), 14), {
      duration: 0.8,
    });
  }, [follow, latitude, longitude, map]);

  return null;
};

const formatSpeed = (speedKmh) => {
  if (speedKmh == null) return null;
  return `${Math.round(speedKmh)} km/h`;
};

const TripTrackingMap = ({ latest, trail = [], followVehicle = false }) => {
  const center = useMemo(() => {
    if (latest?.latitude != null && latest?.longitude != null) {
      return { latitude: latest.latitude, longitude: latest.longitude };
    }
    const lastTrail = trail[trail.length - 1];
    if (lastTrail?.latitude != null && lastTrail?.longitude != null) {
      return { latitude: lastTrail.latitude, longitude: lastTrail.longitude };
    }
    return getDefaultCenter();
  }, [latest, trail]);

  const polyline = useMemo(
    () =>
      trail
        .filter((p) => p.latitude != null && p.longitude != null)
        .map((p) => [p.latitude, p.longitude]),
    [trail]
  );

  const hasMarker = latest?.latitude != null && latest?.longitude != null;
  const speedLabel = formatSpeed(latest?.speed_kmh);
  const vehicleIcon = useMemo(
    () => createVehicleIcon(latest?.heading),
    [latest?.heading]
  );

  return (
    <MapContainer
      center={[center.latitude, center.longitude]}
      zoom={hasMarker ? 14 : 11}
      scrollWheelZoom
      className="trip-tracking-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapFollowVehicle
        latitude={latest?.latitude}
        longitude={latest?.longitude}
        follow={followVehicle && hasMarker}
      />
      {polyline.length > 1 && (
        <Polyline
          positions={polyline}
          pathOptions={{ color: "#667eea", weight: 4, opacity: 0.85 }}
        />
      )}
      {hasMarker && (
        <Marker position={[latest.latitude, latest.longitude]} icon={vehicleIcon}>
          <Popup>
            <strong>Vehicle location</strong>
            {speedLabel && (
              <>
                <br />
                {speedLabel}
              </>
            )}
            {latest.recorded_at && (
              <>
                <br />
                {new Date(latest.recorded_at).toLocaleString()}
              </>
            )}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default TripTrackingMap;
