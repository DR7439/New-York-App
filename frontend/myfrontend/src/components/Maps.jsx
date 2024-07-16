import React, { useState, useEffect } from 'react';
import axiosInstance from "../axiosInstance";
import ReactMapGL, { Layer, Marker, Source, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from "antd";

export default function Map() {
    const [geoJson, setGeoJson] = useState(null);
    const [zoneData, setZoneData] = useState(null);
    const [zoneInfo, setZoneInfo] = useState(null);
    const [completeZoneInfo, setCompleteZoneInfo] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [billboards, setBillboards] = useState([]);
    const [viewport, setViewport] = useState({
        latitude: 40.7831,
        longitude: -73.9712,
        width: '100vw',
        height: '100vh',
        zoom: 14,
    });

    const getZoneInfo = () => {
        const date = new Date();
        const roundedDate = new Date(Math.round(date.getTime() / 3600000) * 3600000);
        const formattedDate = roundedDate.toISOString().split('.')[0] + 'Z';

        axiosInstance.get(`/api/zone-scores-by-datetime/?search_id=1&datetime=${formattedDate}`)
            .then(res => {
                setZoneInfo([res.data]);
            }).catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getZoneInfo();
    }, []);

    useEffect(() => {
        if (zoneInfo) {
            console.log("zoneInfo", zoneInfo);
        }
    }, [zoneInfo]);

  

    const handleClick = (event) => {
        console.log("Click event:", event);
        if (!event.features || event.features.length === 0) {
            console.log("No features found in click event");
            return;
        }
        const feature = event.features[0];
        console.log("Clicked feature:", feature);
        if (feature) {
            setBillboards([]);
            const matchedZone = completeZoneInfo.find(zone => zone.id === feature.properties.id);
            console.log("Matched zone:", matchedZone);
            if (matchedZone) {
                const newSelectedZone = {
                    id: matchedZone.id,
                    name: matchedZone.name,
                    score: matchedZone.total_score,
                    demographic_score: matchedZone.demographic_score,
                    busyness_score: matchedZone.busyness_score,
                    clickLngLat: event.lngLat // Use the click coordinates
                };
                console.log("Setting new selected zone:", newSelectedZone);
                setSelectedZone(newSelectedZone);
            }
        }
    };
    
    
    useEffect(() => {
        console.log("Selected zone updated:", selectedZone);
    }, [selectedZone]);
    
    

    const combineZoneDataAndInfo = () => {
        if (zoneData && zoneInfo && zoneInfo[0] && zoneInfo[0].zone_scores) {
            return zoneData.map(zone => {
                const scoreInfo = zoneInfo[0].zone_scores.find(score => score.zone_id === zone.id);
                return {
                    ...zone,
                    demographic_score: scoreInfo ? scoreInfo.demographic_score : null,
                    busyness_score: scoreInfo ? scoreInfo.busyness_score : null,
                    total_score: scoreInfo ? scoreInfo.total_score : null
                };
            });
        }
        return [];
    }

    useEffect(() => {
        if (zoneData && zoneInfo) {
            const combinedData = combineZoneDataAndInfo();
            console.log("Combined data", combinedData);
            setCompleteZoneInfo(combinedData);
        }
    }, [zoneData, zoneInfo]);

    const getZonesData = () => {
        axiosInstance.get("/api/zones")
            .then(res => {
                setZoneData(res.data);
            }).catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        getZonesData();
        const intervalID = setInterval(getZonesData, 3600000);
        return () => clearInterval(intervalID);
    }, []);

    useEffect(() => {
        if (zoneData) {
            console.log(zoneData);
            setGeoJson(generateGeoJSON(zoneData));
        }
    }, [zoneData]);

    const getBillboards = () => {
        if (selectedZone && selectedZone.id) {
            axiosInstance.get(`/api/billboards/zone/${selectedZone.id}/`)
                .then(res => {
                    setBillboards(res.data);
                }).catch(err => {
                    console.log(err);
                });
        }
    }

    useEffect(() => {
        if (selectedZone && selectedZone.id) {
            getBillboards();
        }
    }, [selectedZone]);

    const generateGeoJSON = (zoneData) => {
        let geoJson = {
            type: "FeatureCollection",
            features: []
        };
        zoneData.forEach(zone => {
            const { id, name, boundary_coordinates } = zone;
            let geometry;

            if (Array.isArray(boundary_coordinates)) {
                geometry = {
                    type: "Polygon",
                    coordinates: [boundary_coordinates]
                };
            } else {
                geometry = {
                    type: "MultiPolygon",
                    coordinates: [boundary_coordinates]
                };
            }

            const feature = {
                type: "Feature",
                properties: {
                    id: id,
                    name: name
                },
                geometry: geometry
            };

            geoJson.features.push(feature);
        });
        return geoJson;
    };

    const layerStyle = {
        id: "outline",
        type: "fill",
        source: "polygonData",
        layout: {},
        paint: {
            "fill-color": "#0080ff",
            "fill-opacity": 0.5
        }
    };

    const layerOutlineStyle = {
        id: 'outlines',
        type: 'line',
        source: 'polygonData',
        layout: {},
        paint: {
            'line-color': '#ff0000',
            'line-opacity': 0.5
        }
    };

    return (
        /// rendering map and card
        <div className="flex w-full h-[418px]">
    <ReactMapGL
        {...viewport}
        className="w-3/5 h-full"
        mapboxAccessToken="pk.eyJ1IjoiYXJzbGFuYWxpOTkiLCJhIjoiY2x5ZzBxcGxmMDVubzJqcjc4bG53YjBwaiJ9.TM09gjnLbkeeSTMJymN-HQ"
        onMove={(evt) => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onClick={handleClick}
        interactiveLayerIds={['outline', 'outlines']}
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
                    >
                        <div>
                            <h3>{selectedZone.name}</h3>
                            <p>Score: {selectedZone.score}</p>
                            <p>Demographic Score: {selectedZone.demographic_score}</p>
                            <p>Busyness Score: {selectedZone.busyness_score}</p>
                        </div>
                    </Popup>
                )}
            </Source>
        )}
        
    </ReactMapGL>

    <Card billboards={billboards} className="w-2/5 h-full overflow-auto">
        <div>
            <h2 className="text-lg font-bold p-4">Available Billboards by Location</h2>
            {billboards && billboards.length > 0 && (
                billboards.map((billboard, index) => (
                    <div key={index} className="p-2 border-b border-gray-200">
                        <h3>Street name: {billboard.street_name}</h3>
                        <p>Illumination: {billboard.sign_illumination}</p>
                        <p>Size: {billboard.sign_sq_footage} sq ft</p>
                    </div>
                ))
            )}
        </div>
    </Card>
</div>    
    );
}
