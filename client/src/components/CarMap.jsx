import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const carIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const CarMap = ({ center, cars = [], radiusKm = 10, onSelectCar }) => {
  const mapCenter = [center.latitude, center.longitude];

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom
      className="car-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={mapCenter} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>
      <Circle
        center={mapCenter}
        radius={radiusKm * 1000}
        pathOptions={{ color: "#0d6efd", fillColor: "#0d6efd", fillOpacity: 0.08 }}
      />
      {cars.map((car) => {
        if (!car.location?.coordinates) return null;
        const [lng, lat] = car.location.coordinates;
        if (lat == null || lng == null) return null;
        return (
          <Marker
            key={car.id}
            position={[lat, lng]}
            icon={carIcon}
            eventHandlers={{
              click: () => onSelectCar && onSelectCar(car),
            }}
          >
            <Popup>
              <strong>{car.title}</strong>
              <br />
              ${Number(car.price).toLocaleString()}/day
              {car.distance != null && (
                <>
                  <br />
                  {car.distance.toFixed(1)} km away
                </>
              )}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default CarMap;
