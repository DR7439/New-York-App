import { Card, Select } from "antd";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useState } from "react";
import ReactMapGL, { Layer, Marker, Popup, Source } from "react-map-gl";
import axiosInstance from "../axiosInstance";
import useZones from "../hooks/useZones";
const billboardImageUrl = "https://i.imgur.com/ZOlWTLF.jpeg";
export default function Map({
  id,
  selectedDate,
  selectedMapZoneId,
  selectedTime,
}) {
  // const [isLoading, setIsLoading] = useState(false);
  const { zones: zoneData } = useZones();
  const [geoJson, setGeoJson] = useState(null);
  const [zoneInfo, setZoneInfo] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);
  const [isLoadingBillboards, setIsLoadingBillboards] = useState(false);
  const [completeZoneInfo, setCompleteZoneInfo] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [billboards, setBillboards] = useState([]);
  const [busynessScores, setBusynessScores] = useState([]);
  const [viewport, setViewport] = useState({
    latitude: 40.7831,
    longitude: -73.9712,
    width: "100vw",
    height: "100vh",
    zoom: 10,
  });

  const getZoneInfo = () => {
    const date = new Date(selectedDate);
    const roundedDate = new Date(
      Math.round(date.getTime() / 3600000) * 3600000
    );
    const formattedDate = roundedDate.toISOString().split(".")[0] + "Z";
    axiosInstance
      .get(
        `/api/zone-scores-by-datetime/?search_id=${id}&datetime=${formattedDate}`
      )
      .then((res) => {
        let zone_scores = res?.data?.zone_scores;
        if (zone_scores) {
          setZoneInfo(zone_scores);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getZoneInfo();
  }, [selectedDate, id]);

  const handleClick = (event) => {
    if (!event.features || event.features.length === 0) {
      return;
    }
    const feature = event.features[0];
    if (feature) {
      const matchedZone = completeZoneInfo.find(
        (zone) => zone.id === feature.properties.id
      );
      console.log("This is the complete zone info Arslan", completeZoneInfo);
      console.log("Matched zone Arslan!:", matchedZone);
      if (matchedZone) {
        const newSelectedZone = {
          id: matchedZone.id,
          name: matchedZone.name,
          score: matchedZone.total_score,
          demographic_score: matchedZone.demographic_score,
          busyness_score: matchedZone.busyness_score,
          clickLngLat: event.lngLat,
          selectedHour: null,
        };
        console.log("Setting new selected zone:", newSelectedZone);

        if (!selectedZone || selectedZone.id !== newSelectedZone.id) {
          setSelectedZone(newSelectedZone);
          // setInputValue(newSelectedZone.name);
          setBillboards([]);
          setSelectedHour(null);
          if (newSelectedZone.score !== "N/A") {
            getZoneDetails(matchedZone.name);
          }
          getBillboards(newSelectedZone.id);
        } else {
          setSelectedZone((prevZone) => ({
            ...prevZone,
            clickLngLat: event.lngLat,
          }));
        }

        setViewport({
          ...viewport,
          longitude: event.lngLat[0],
          latitude: event.lngLat[1],
          zoom: 14,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
        });
      }
    }
  };

  useEffect(() => {
    console.log("Selected zone updated:", selectedZone);
  }, [selectedZone]);

  const combineZoneDataAndInfo = () => {
    if (zoneData && zoneInfo.length) {
      return zoneData.map((zone) => {
        const scoreInfo = zoneInfo.find(
          (score) => score.zone_name === zone.name
        );
        return {
          ...zone,
          demographic_score: scoreInfo ? scoreInfo.demographic_score : "N/A",
          busyness_score: scoreInfo ? scoreInfo.busyness_score : "N/A",
          total_score: scoreInfo ? scoreInfo.total_score : "N/A",
        };
      });
    }
    return [];
  };

  useEffect(() => {
    if (zoneData && zoneInfo) {
      const combinedData = combineZoneDataAndInfo();
      console.log("Combined data", combinedData);
      setCompleteZoneInfo(combinedData);
    }
  }, [zoneData, zoneInfo]);

  useEffect(() => {
    const updateCombinedData = () => {
      if (zoneData && zoneInfo) {
        const combinedData = combineZoneDataAndInfo();
        setCompleteZoneInfo(combinedData);
      }
    };

    updateCombinedData();

    // Set up an interval to periodically update the combined data
    const intervalId = setInterval(updateCombinedData, 60000); // Update every minute

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    setGeoJson(generateGeoJSON());
  }, [zoneData, zoneInfo]);

  //My getZoneDetails function
  const getZoneDetails = (zoneName) => {
    const zoneIds = completeZoneInfo
      .filter((zone) => zone.name === zoneName)
      .map((zone) => zone.id);

    const fetchZoneData = (index = 0) => {
      if (index >= zoneIds.length) {
        console.log("No data found for any zone ID");
        return;
      }

      const zoneId = zoneIds[index];

      axiosInstance
        .get(
          `/api/zone-details-by-search-date-zone/?search_id=${id}&date=${selectedDate}&zone_id=${zoneId}`
        )
        .then((res) => {
          if (res.data && res.data.busyness_scores) {
            setBusynessScores(res.data.busyness_scores);
            setSelectedZone((prevZone) => ({
              ...prevZone,
              demographic_score: res.data.demographic_score,
              busyness_score: res.data.busyness_scores[0].busyness_score,
            }));
          } else {
            fetchZoneData(index + 1);
          }
        })
        .catch(() => {
          fetchZoneData(index + 1);
        });
    };

    fetchZoneData();
  };

  // My billboards function

  const getBillboards = () => {
    if (selectedZone && selectedZone.id) {
      setIsLoadingBillboards(true);
      axiosInstance
        .get(`/api/billboards/zone/${selectedZone.id}/`)
        .then((res) => {
          setTimeout(() => {
            setBillboards(res.data);
            setIsLoadingBillboards(false);
          }, 1000); // 1 second delay
        })
        .catch((err) => {
          console.error("Error fetching billboards:", err);
          setIsLoadingBillboards(false);
        });
    }
  };

  useEffect(() => {
    if (selectedZone && selectedZone.id) {
      getBillboards(selectedZone.id);
    }
  }, [selectedZone]);

  useEffect(() => {
    let isMounted = true;
    if (selectedZone && selectedZone.id && isMounted) {
      getBillboards();
    }
    return () => {
      isMounted = false;
    };
  }, [selectedZone]);

  const generateGeoJSON = () => {
    let geoJson = {
      type: "FeatureCollection",
      features: [],
    };
    if (zoneData.length && zoneInfo.length) {
      zoneData.forEach((zone) => {
        const { id, name, boundary_coordinates } = zone;
        const zoneScore = zoneInfo.find((score) => score.zone_id === id);
        let geometry;

        if (Array.isArray(boundary_coordinates)) {
          geometry = {
            type: "Polygon",
            coordinates: [boundary_coordinates],
          };
        } else {
          geometry = {
            type: "MultiPolygon",
            coordinates: [boundary_coordinates],
          };
        }

        const feature = {
          type: "Feature",
          properties: {
            id: id,
            name: name,
            total_score: zoneScore ? zoneScore.total_score : "N/A",
            demographic_score: zoneScore ? zoneScore.demographic_score : "N/A",
            busyness_score: zoneScore ? zoneScore.busyness_score : "N/A",
          },
          geometry: geometry,
        };

        geoJson.features.push(feature);
      });
    }
    return geoJson;
  };

  const ColorBar = () => {
    return (
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "200px",
          height: "24px",
          background:
            "linear-gradient(to right, #FFEBEE, #FFCDD2, #EF9A9A, #E57373, #EF5350, #F44336, #E53935, #D32F2F, #C62828, #B71C1C)",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            padding: "0 5px",
          }}
        >
          <span
            style={{ fontSize: "12px", color: "white", fontWeight: "bold" }}
          >
            Low Score
          </span>
          <span
            style={{ fontSize: "12px", color: "white", fontWeight: "bold" }}
          >
            High Score
          </span>
        </div>
      </div>
    );
  };

  const BillboardMarker = ({ longitude, latitude }) => {
    return (
      <Marker longitude={longitude} latitude={latitude} anchor="bottom">
        <img
          src={billboardImageUrl}
          alt="Billboard Image"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)",
          }}
        />
      </Marker>
    );
  };

  // My orignal useEffect for synchronisation
  useEffect(() => {
    if (selectedMapZoneId && completeZoneInfo && selectedTime) {
      const zone = completeZoneInfo.find((z) => z.id === selectedMapZoneId);
      if (zone) {
        const newSelectedZone = {
          id: zone.id,
          name: zone.name,
          score: zone.total_score,
          demographic_score: zone.demographic_score,
          busyness_score: zone.busyness_score,
          clickLngLat: {
            lng: zone.boundary_coordinates[0][0],
            lat: zone.boundary_coordinates[0][1],
          },
        };
        setSelectedZone(newSelectedZone);
        setViewport({
          ...viewport,
          longitude: newSelectedZone.clickLngLat.lng,
          latitude: newSelectedZone.clickLngLat.lat,
          zoom: 14,
        });
        getZoneDetails(zone.name);
      }
      handleSelectHour(selectedTime);
    }
  }, [selectedMapZoneId, completeZoneInfo, selectedTime]);

  // useEffect(() => {
  //   if (selectedTime) {
  //     handleSelectHour(selectedTime);
  //   }
  // }, [selectedTime]);
  const layerStyle = {
    id: "outline",
    type: "fill",
    source: "polygonData",
    layout: {},
    paint: {
      "fill-color": [
        "case",
        ["==", ["get", "total_score"], "N/A"],
        "#FFFDE7", // Pale yellow for null scores
        [
          "interpolate",
          ["linear"],
          ["get", "total_score"],
          0,
          "#FFEBEE",
          25,
          "#FFCDD2",
          50,
          "#EF9A9A",
          75,
          "#E57373",
          100,
          "#EF5350",
          125,
          "#E53935",
          150,
          "#D32F2F",
          175,
          "#C62828",
          200,
          "#B71C1C",
        ],
      ],
      "fill-opacity": 0.5,
    },
  };

  const layerOutlineStyle = {
    id: "outlines",
    type: "line",
    source: "polygonData",
    layout: {},
    paint: {
      "line-color": "#ff0000",
      "line-opacity": 0.5,
    },
  };

  const handleSelectHour = (value) => {
    setSelectedHour(value);
    const formatTime = (timeString) => {
      const date = new Date(timeString);
      date.setHours(date.getHours() + 1);
      return date.toISOString().split(".")[0] + "Z";
    };
    const formattedValue = formatTime(value);
    const selectedScore = busynessScores.find(
      (score) => score.time === formattedValue
    );
    if (selectedScore) {
      setSelectedZone((prevZone) => ({
        ...prevZone,
        busyness_score: selectedScore.busyness_score,
        selectedHour: value,
      }));
    } else {
      console.log("No score found for selected time");
    }
  };

  let selectedBusynessScore = busynessScores.find(
    (score) => score.time === selectedTime
  );
  let busynessActivity = selectedBusynessScore?.busyness_score || 0;

  return (
    <div id="map-container" className="flex flex-col  w-full">
      <h4 className="text-xl font-medium text-left mb-4">Map Visualization</h4>
      <div className="flex w-full h-[418px] space-x-6">
        <ReactMapGL
          {...viewport}
          className="w-[57%] h-full"
          mapboxAccessToken="pk.eyJ1IjoiYXJzbGFuYWxpOTkiLCJhIjoiY2x5ZzBxcGxmMDVubzJqcjc4bG53YjBwaiJ9.TM09gjnLbkeeSTMJymN-HQ"
          onMove={(evt) => setViewport(evt.viewState)}
          onViewportChange={(newViewport) => setViewport(newViewport)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onClick={handleClick}
          interactiveLayerIds={["outline", "outlines"]}
        >
          {geoJson && (
            <Source id="polygonData" type="geojson" data={geoJson}>
              <Layer {...layerStyle}></Layer>
              <Layer {...layerOutlineStyle}></Layer>
              {selectedZone && (
                <Popup
                  longitude={selectedZone.clickLngLat.lng}
                  latitude={selectedZone.clickLngLat.lat}
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setSelectedZone(null)}
                  className="p-2"
                >
                  <div className="p-2">
                    <h3 className="font-bold">{selectedZone.name}</h3>
                    {selectedZone.selectedHour ? (
                      <>
                        <p>Busyness Activity: {busynessActivity.toFixed(2)}</p>
                        <p>
                          Time:{" "}
                          {new Date(
                            selectedZone.selectedHour
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </>
                    ) : (
                      <p>Select a time to view busyness activity</p>
                    )}
                    {selectedZone.score !== "N/A" && (
                      <Select
                        style={{ width: "100%", marginTop: "10px" }}
                        placeholder="Select hour"
                        value={selectedHour}
                        onChange={handleSelectHour}
                      >
                        {busynessScores
                          .sort((a, b) => new Date(a.time) - new Date(b.time))
                          .map((score) => (
                            <Select.Option key={score.time} value={score.time}>
                              {new Date(score.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Select.Option>
                          ))}
                      </Select>
                    )}
                  </div>
                </Popup>
              )}
            </Source>
          )}
          {selectedZone &&
            billboards.map((billboard, index) =>
              billboard.longitude &&
              billboard.latitude &&
              !isNaN(billboard.longitude) &&
              !isNaN(billboard.latitude) ? (
                <BillboardMarker
                  key={index}
                  longitude={billboard.longitude}
                  latitude={billboard.latitude}
                />
              ) : null
            )}
          <ColorBar />
        </ReactMapGL>
        <Card
          className="w-[39%] h-full overflow-auto"
          title={
            <div className="text-center">Available Billboards by Location</div>
          }
          styles={{ header: { borderBottom: "1px solid #f0f0f0" } }}
        >
          <div className="text-left">
            {!selectedZone && (
              <p className="text-center">
                Select an location from the Recommendations table or click on a
                location from the hilighted area to display billboard
                information.
              </p>
            )}
            {selectedZone && isLoadingBillboards && (
              <p className="text-center">Loading billboard information...</p>
            )}
            {selectedZone &&
              !isLoadingBillboards &&
              billboards.length === 0 && (
                <p className="text-center">No billboards for this location</p>
              )}
            {selectedZone &&
              !isLoadingBillboards &&
              billboards.length > 0 &&
              billboards.map((billboard, index) => (
                <div key={index} className="p-2 border-b border-gray-200">
                  <h3>Street name: {billboard.street_name}</h3>
                  <p>
                    Illumination:{" "}
                    {isNaN(billboard.sign_illumination)
                      ? "N/A"
                      : billboard.sign_illumination}
                  </p>
                  <p>Size: {billboard.sign_sq_footage} sq ft</p>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
