import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import axiosInstance from "../axiosInstance";
import React, { useState, useEffect, useRef } from "react";
import fetchWithCache from "../utils/fetchWithCache";
const google = window.google;

export default function Maps() {
  const mapRef = useRef(null);
  const [zoneData, setZoneData] = useState([]);
  const getZonesData = async () => {
    try {
      const data = await fetchWithCache("/api/zones");
      setZoneData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getZonesData();
    const intervalID = setInterval(getZonesData, 3600000);

    return () => clearInterval(intervalID);
  }, []);

  const renderPolygons = (map) => {
    if (map && zoneData) {
      zoneData.forEach((zone) => {
        const key = zone.id;
        const polygonPaths = zone.boundary_coordinates.coordinates.map(
          (coordinate) => {
            return new google.maps.LatLng(coordinate[1], coordinate[0]);
          }
        );

        // Create polygon object
        const polygon = new google.maps.Polygon({
          key: key,
          paths: polygonPaths,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });

        // Set polygon on the map
        polygon.setMap(map);
      });
    }
  };

  const default_position = { lat: 40.78, lng: -73.97 };

  return (
    <APIProvider apiKey="AIzaSyAHMyW1VBDgihMK85YB9Z4oayMxeZ2XEw8">
      <div style={{ width: "100%", height: "418px" }}>
        <Map
          defaultZoom={11}
          defaultCenter={default_position}
          mapId="3379961c48528892"
        >
          {renderPolygons(mapRef.current && mapRef.current.getMapInstance())}
        </Map>
      </div>
    </APIProvider>
  );
}
