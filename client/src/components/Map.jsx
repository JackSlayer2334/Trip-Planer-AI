import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Map({ locations }) {
  if (!locations || !locations.length) {
    return (
      <div className="w-full h-96 my-4 bg-gray-200 flex items-center justify-center">
        <p>No locations to display</p>
      </div>
    );
  }

  const center = [locations[0].lat, locations[0].lng];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: "400px", width: "100%" }}
      className="my-4 rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc, idx) => (
        <Marker key={idx} position={[loc.lat, loc.lng]}>
          <Popup>{loc.name || `Location ${idx + 1}`}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
