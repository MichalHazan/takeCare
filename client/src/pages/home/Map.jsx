import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // היבוא של Leaflet

// יצירת רכיב המפה
const Map = () => {
  const position = [32.0853, 34.7818]; // קואורדינטות לתל אביב

  return (
    <div style={{ height: "1000px", width: "500Px" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
        {/* הוספת TileLayer של OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* הוספת Marker עם Popup */}
        <Marker position={position}>
          <Popup >
            This is Tel Aviv!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
