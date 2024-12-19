import React from "react";
import { Grid, Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; // היבוא של Leaflet
import "leaflet/dist/leaflet.css";  
import { Icon } from "leaflet";

// יצירת רכיב המפה
const Map = ({users}) => {
  // users.map((co)=>{
  //   console.log(co.userId.location.coordinates)
  // })
  const position = [35.150562, 32.242521]; 

  // const coordinates = [...users.userId.location.coordinates]
 //  console.log(users.userId.location.coordinates)// קואורדינטות לתל אביב
  const customIcon = new Icon({
    iconUrl: require("../../images/placeholder.png"),
    iconSize: [38,38]
  });
  if (! users ) {
    return <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center", padding: "20px" }}>No users found with the selected filters.</Typography>;
  }

  return (
    <div style={{ width: "50vh", boxSizing: "border-box" }}>

    <MapContainer center={position} zoom={8} style={{ height: "100%", width: "100%" }}>
    {/* הוספת TileLayer של OpenStreetMap */}
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    />
    {/* <Marker position={position} icon={customIcon}>
        <Popup >
          This is Tel Aviv!
        </Popup>
      </Marker> */}
    {users.map((crdn) =>(
      <Marker position={crdn.userId.location.coordinates} icon={customIcon}>
        <Popup >
          This is Tel Aviv!
        </Popup>
      </Marker>
))}
      </MapContainer>
    </div>
  );
};

export default Map;
