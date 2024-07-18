import React, { useState, useEffect } from 'react';
import axiosInstance from "../axiosInstance";
import ReactMapGL, { Layer, Marker, Source, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, AutoComplete } from "antd";

export default function Map() {
    const [geoJson, setGeoJson] = useState(null);
    const [zoneData, setZoneData] = useState(null);
    const [zoneInfo, setZoneInfo] = useState(null);
    const [completeZoneInfo, setCompleteZoneInfo] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [billboards, setBillboards] = useState([]);
    const [zoneNames, setZoneNames]=useState([]);
    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
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
        getZoneInfo(); // Initial call
        const intervalId = setInterval(getZoneInfo, 3600000); // 3600000 ms = 1 hour
    
        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);
    

    useEffect(() => {
        if (zoneInfo) {
            console.log("zoneInfo", zoneInfo);
        }
    }, [zoneInfo]);
/// My handleClick
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
        const zoneNames = zoneData ? zoneData.map(zone => zone.name) : [];
        setZoneNames(zoneNames)
        const intervalID = setInterval(getZonesData, 3600000);
        return () => clearInterval(intervalID);
    }, []);

    useEffect(() => {
        if (zoneData) {
            console.log(zoneData);
            setGeoJson(generateGeoJSON(zoneData));
        }
    }, [zoneData]);

    useEffect(() => {
        if (zoneData) {
            const names = zoneData.map(zone => zone.name);
            setZoneNames(names);
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

    // const generateGeoJSON = (zoneData) => {
    //     let geoJson = {
    //         type: "FeatureCollection",
    //         features: []
    //     };
    //     zoneData.forEach(zone => {
    //         const { id, name, boundary_coordinates,  } = zone;
    //         let geometry;

    //         if (Array.isArray(boundary_coordinates)) {
    //             geometry = {
    //                 type: "Polygon",
    //                 coordinates: [boundary_coordinates]
    //             };
    //         } else {
    //             geometry = {
    //                 type: "MultiPolygon",
    //                 coordinates: [boundary_coordinates]
    //             };
    //         }

    //         const feature = {
    //             type: "Feature",
    //             properties: {
    //                 id: id,
    //                 name: name
    //             },
    //             geometry: geometry
    //         };

    //         geoJson.features.push(feature);
    //     });
    //     return geoJson;
    // };

    const generateGeoJSON = (zoneData) => {
        let geoJson = {
            type: "FeatureCollection",
            features: []
        };
        if (zoneData && zoneInfo && zoneInfo[0] && zoneInfo[0].zone_scores) {
            zoneData.forEach(zone => {
                const { id, name, boundary_coordinates } = zone;
                const zoneScore = zoneInfo[0].zone_scores.find(score => score.zone_id === id);
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
                        name: name,
                        total_score: zoneScore ? zoneScore.total_score : null
                    },
                    geometry: geometry
                };
    
                geoJson.features.push(feature);
            });
        }
        return geoJson;
    };
    
    
    const ColorBar = () => {
        return (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            width: '200px',
            height: '20px',
            background: 'linear-gradient(to right, #FFEBEE, #FFCDD2, #EF9A9A, #E57373, #EF5350, #F44336, #E53935, #D32F2F, #C62828, #B71C1C)',
            borderRadius: '5px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0'}}>
              <span style={{fontSize: '12px'}}>Low Score</span>
              <span style={{fontSize: '12px'}}>High Score</span>
            </div>
          </div>
        );
      };
      
    
    const selectHandler = (selectedZoneName) => {
        const matchedZone = completeZoneInfo.find(zone => zone.name === selectedZoneName);
        console.log("Matched zone:", matchedZone);
      
        if (matchedZone) {
          const totalScore = matchedZone.total_score !== undefined ? matchedZone.total_score : 'N/A';
          const demographicScore = matchedZone.demographic_score !== undefined ? matchedZone.demographic_score : 'N/A';
          const busynessScore = matchedZone.busyness_score !== undefined ? matchedZone.busyness_score : 'N/A';
      
          const newSelectedZone = {
            id: matchedZone.id,
            name: matchedZone.name,
            score: totalScore,
            demographic_score: demographicScore,
            busyness_score: busynessScore,
            clickLngLat: {
              lng: matchedZone.boundary_coordinates[0][0],
              lat: matchedZone.boundary_coordinates[0][1]
            }
          };
          console.log("New selected zone:", newSelectedZone);
          setSelectedZone(newSelectedZone);
          setViewport({
            ...viewport,
            longitude: newSelectedZone.clickLngLat.lng,
            latitude: newSelectedZone.clickLngLat.lat,
            zoom: 14
          });
          setBillboards([]);
        }
      };
      
    
    const resetComponent = () => {
        setFilteredOptions([]);
      };
      
      useEffect(() => {
        if (inputValue === '') {
          resetComponent();
        }
      }, [inputValue]);
      
      const handleSearch = (value) => {
        setInputValue(value);
        setFilteredOptions([]); // Reset filtered options immediately
      
        if (value.trim()) {
          // Use setTimeout to ensure the reset has occurred before filtering
          setTimeout(() => {
            const filtered = zoneNames.filter(name =>
              name.toLowerCase().startsWith(value.toLowerCase())
            );
            setFilteredOptions(filtered.map(name => ({ value: name })));
          }, 0);
        }
      };
      

    // const layerStyle = {
    //     id: "outline",
    //     type: "fill",
    //     source: "polygonData",
    //     layout: {},
    //     paint: {
    //         "fill-color": "#0080ff",
    //         "fill-opacity": 0.5
    //     }
    // };

    const layerStyle = {
        id: "outline",
        type: "fill",
        source: "polygonData",
        layout: {},
        paint: {
            "fill-color": [
                "case",
                ["==", ["get", "total_score"], null],
                "#FFFDE7",  // Pale yellow for null scores
                [
                    "interpolate",
                    ["linear"],
                    ["get", "total_score"],
                    0, "#FFCDD2",
                    20, "#EF9A9A",
                    40, "#E57373",
                    60, "#EF5350",
                    80, "#E53935",
                    100, "#D32F2F",
                    120, "#B71C1C"
                ]
            ],
            "fill-opacity": 0.7
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
        <div className="flex flex-col items-center w-full">
        <div className="w-[200px] p-4">
        <AutoComplete
            value={inputValue}
            options={filteredOptions}
            onSelect={(value) => {
                selectHandler(value);
                setInputValue('');
                setFilteredOptions([]);
            }}
            onSearch={handleSearch}
            placeholder="Search for a zone"
            className="w-full"
            />

        </div>
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
                        <Layer {...layerStyle}
                        
                        ></Layer>
                        <Layer {...layerOutlineStyle}
                        
                        ></Layer>
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
                <Marker longitude={-73.98} latitude={40.74}></Marker>
                <ColorBar/>
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
    </div>
        
    );
}
