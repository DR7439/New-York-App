import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from "../axiosInstance";
import ReactMapGL, { Layer, Marker, Source, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, AutoComplete } from "antd";
import Icon from '@ant-design/icons/lib/components/Icon';
// import BillboardImage from './public/billboard.png';
import BillboardImage from '/Billboard.jpg';

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
    const [syncedZoneInfo, setSyncedZoneInfo] = useState(null);
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
        getZonesData();
        console.log(zoneData)
        const intervalId = setInterval(() => {
            getZoneInfo();
            getZonesData();
        }, 3600000);
        return () => clearInterval(intervalId);
    }, []);
    
    
    
    
    

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
            console.log("This is the complete zone infor Arslan",completeZoneInfo)
            console.log("Matched zone Arslan!:", matchedZone);
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
        if (completeZoneInfo) {
          setSyncedZoneInfo(completeZoneInfo);
        }
      }, [completeZoneInfo]);

    // const handleClick = (event) => {
    //     if (!event.features || event.features.length === 0) return;
        
    //     const feature = event.features[0];
    //     if (feature) {
    //         setBillboards([]);
    //         const matchedZone = syncedZoneInfo.find(zone => zone.id === feature.properties.id);
            
    //         if (matchedZone) {
    //             const newSelectedZone = {
    //                 id: matchedZone.id,
    //                 name: matchedZone.name,
    //                 score: matchedZone.total_score,
    //                 demographic_score: matchedZone.demographic_score,
    //                 busyness_score: matchedZone.busyness_score,
    //                 clickLngLat: event.lngLat
    //             };
    //             updateSelectedZone(newSelectedZone);
    //         }
    //     }
    // };

    // const handleClick = (event) => {
    //     if (!event.features || event.features.length === 0) return;
        
    //     const feature = event.features[0];
    //     if (feature) {
    //         setBillboards([]);
    //         const matchedZone = completeZoneInfo.find(zone => zone.id === feature.properties.id);
            
    //         if (matchedZone) {
    //             const newSelectedZone = {
    //                 id: matchedZone.id,
    //                 name: matchedZone.name,
    //                 score: matchedZone.total_score,
    //                 demographic_score: matchedZone.demographic_score,
    //                 busyness_score: matchedZone.busyness_score,
    //                 clickLngLat: event.lngLat
    //             };
    //             setSelectedZone(newSelectedZone);
    //         }
    //     }
    // };

    
    
    useEffect(() => {
        console.log("Selected zone updated:", selectedZone);
    }, [selectedZone]);
    
    

    // const combineZoneDataAndInfo = () => {
    //     if (zoneData && zoneInfo && zoneInfo[0] && zoneInfo[0].zone_scores) {
    //         return zoneData.map(zone => {
    //             const scoreInfo = zoneInfo[0].zone_scores.find(score => score.zone_id === zone.id);
    //             return {
    //                 ...zone,
    //                 demographic_score: scoreInfo ? scoreInfo.demographic_score : "N/A",
    //                 busyness_score: scoreInfo ? scoreInfo.busyness_score : "N/A",
    //                 total_score: scoreInfo ? scoreInfo.total_score : "N/A"
    //             };
    //         });
    //     }
    //     return [];
    // }

    const combineZoneDataAndInfo = () => {
        if (zoneData && zoneInfo && zoneInfo[0] && zoneInfo[0].zone_scores) {
            return zoneData.map(zone => {
                const scoreInfo = zoneInfo[0].zone_scores.find(score => score.zone_name === zone.name);
                return {
                    ...zone,
                    demographic_score: scoreInfo ? scoreInfo.demographic_score : "N/A",
                    busyness_score: scoreInfo ? scoreInfo.busyness_score : "N/A",
                    total_score: scoreInfo ? scoreInfo.total_score : "N/A"
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

    // useEffect(() => {
    //     if (zoneData) {
    //         console.log(zoneData);
    //         setGeoJson(generateGeoJSON(zoneData));
    //     }
    // }, [zoneData]);

    useEffect(() => {
        let isMounted = true;
        if (zoneData && isMounted) {
            console.log(zoneData);
            setGeoJson(generateGeoJSON(zoneData));
        }
        return () => {
            isMounted = false;
        };
    }, [zoneData]);
    

    useEffect(() => {
        if (zoneData) {
            const names = zoneData.map(zone => zone.name);
            setZoneNames(names);
        }
    }, [zoneData]);
    

    // const getBillboards = () => {
    //     if (selectedZone && selectedZone.id) {
    //         console.log("Getting billboards for zone:", selectedZone.id);
    //         axiosInstance.get(`/api/billboards/zone/${selectedZone.id}/`)
    //             .then(res => {
    //                 setBillboards(res.data);
    //             }).catch(err => {
    //                 console.log(err);
    //             });
    //     }
    // }

    const getBillboards = () => {
        if (selectedZone && selectedZone.id) {
            console.log(`Making API call for billboards, zone ID: ${selectedZone.id}`);
            axiosInstance.get(`/api/billboards/zone/${selectedZone.id}/`)
                .then(res => {
                    console.log('Billboard data received:', res.data);
                    console.log(`Number of billboards: ${res.data.length}`);
                    setBillboards(res.data);
                }).catch(err => {
                    console.error('Error fetching billboards:', err);
                });
        } else {
            console.log('No selected zone or zone ID available');
        }
    }

    useEffect(() => {
        if (selectedZone && selectedZone.id) {
            getBillboards(selectedZone.id);
        }
    }, [selectedZone]);
    

    // useEffect(() => {
    //     if (selectedZone && selectedZone.id) {
    //         getBillboards();
    //     }
    // }, [selectedZone]);

    useEffect(() => {
        let isMounted = true;
        if (selectedZone && selectedZone.id && isMounted) {
            getBillboards();
        }
        return () => {
            isMounted = false;
        };
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
    
                // const feature = {
                //     type: "Feature",
                //     properties: {
                //         id: id,
                //         name: name,
                //         total_score: zoneScore ? zoneScore.total_score : "N/A"
                //     },
                //     geometry: geometry
                // };

                const feature = {
                    type: "Feature",
                    properties: {
                        id: id,
                        name: name,
                        total_score: zoneScore ? zoneScore.total_score : "N/A",
                        demographic_score: zoneScore ? zoneScore.demographic_score : "N/A",
                        busyness_score: zoneScore ? zoneScore.busyness_score : "N/A"
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

    //   const updateSelectedZone = useCallback((zoneData) => {
    //     setSelectedZone(zoneData);
    //   }, []);
      
    
    // const selectHandler = (selectedZoneName) => {
    //     const matchedZone = completeZoneInfo.find(zone => zone.name === selectedZoneName);
    //     console.log("Matched zone:", matchedZone);
      
    //     if (matchedZone) {
    //       const totalScore = matchedZone.total_score !== undefined ? matchedZone.total_score : 'N/A';
    //       const demographicScore = matchedZone.demographic_score !== undefined ? matchedZone.demographic_score : 'N/A';
    //       const busynessScore = matchedZone.busyness_score !== undefined ? matchedZone.busyness_score : 'N/A';
      
    //       const newSelectedZone = {
    //         id: matchedZone.id,
    //         name: matchedZone.name,
    //         score: totalScore,
    //         demographic_score: demographicScore,
    //         busyness_score: busynessScore,
    //         clickLngLat: {
    //           lng: matchedZone.boundary_coordinates[0][0],
    //           lat: matchedZone.boundary_coordinates[0][1]
    //         }
    //       };
    //       console.log("New selected zone:", newSelectedZone);
    //       setSelectedZone(newSelectedZone);
    //       setViewport({
    //         ...viewport,
    //         longitude: newSelectedZone.clickLngLat.lng,
    //         latitude: newSelectedZone.clickLngLat.lat,
    //         zoom: 14
    //       });
    //       setBillboards([]);
    //     }
    //   };

    //   const selectHandler = (selectedZoneName) => {
    //     const matchedZone = syncedZoneInfo.find(zone => zone.name === selectedZoneName);
        
    //     if (matchedZone) {
    //         const newSelectedZone = {
    //             id: matchedZone.id,
    //             name: matchedZone.name,
    //             score: matchedZone.total_score,
    //             demographic_score: matchedZone.demographic_score,
    //             busyness_score: matchedZone.busyness_score,
    //             clickLngLat: {
    //                 lng: matchedZone.boundary_coordinates[0][0],
    //                 lat: matchedZone.boundary_coordinates[0][1]
    //             }
    //         };
    //         updateSelectedZone(newSelectedZone);
    //         setViewport({
    //             ...viewport,
    //             longitude: newSelectedZone.clickLngLat.lng,
    //             latitude: newSelectedZone.clickLngLat.lat,
    //             zoom: 14
    //         });
    //         setBillboards([]);
    //     }
    // };
      
    // const selectHandler = (selectedZoneName) => {
    //     const matchedZone = syncedZoneInfo.find(zone => zone.name === selectedZoneName);
        
    //     if (matchedZone) {
    //         const newSelectedZone = {
    //             id: matchedZone.id,
    //             name: matchedZone.name,
    //             score: matchedZone.total_score,
    //             demographic_score: matchedZone.demographic_score,
    //             busyness_score: matchedZone.busyness_score,
    //             clickLngLat: {
    //                 lng: matchedZone.boundary_coordinates[0][0],
    //                 lat: matchedZone.boundary_coordinates[0][1]
    //             }
    //         };
    //         updateSelectedZone(newSelectedZone);
    //         setViewport({
    //             ...viewport,
    //             longitude: newSelectedZone.clickLngLat.lng,
    //             latitude: newSelectedZone.clickLngLat.lat,
    //             zoom: 14
    //         });
    //         setBillboards([]);
    //     }
    // };

    // const selectHandler = (selectedZoneName) => {
    //     const matchedZone = syncedZoneInfo.find(zone => zone.name === selectedZoneName);
    //     if (matchedZone) {
    //         // setBillboards([]);
    //         const newSelectedZone = {
    //             id: matchedZone.id,
    //             name: matchedZone.name,
    //             score: matchedZone.total_score,
    //             demographic_score: matchedZone.demographic_score,
    //             busyness_score: matchedZone.busyness_score,
    //             clickLngLat: {
    //                 lng: matchedZone.boundary_coordinates[0][0],
    //                 lat: matchedZone.boundary_coordinates[0][1]
    //             }
    //         };
    //         setSelectedZone(newSelectedZone);
    //         setViewport({
    //             ...viewport,
    //             longitude: newSelectedZone.clickLngLat.lng,
    //             latitude: newSelectedZone.clickLngLat.lat,
    //             zoom: 14
    //         });
    //         // setBillboards([]);
            
    //     }
    // };

    // const selectHandler = (selectedZoneName) => {
    //     const matchedZone = syncedZoneInfo.find(zone => zone.name === selectedZoneName);
    //     if (matchedZone) {
    //         const newSelectedZone = {
    //             id: matchedZone.id,
    //             name: matchedZone.name,
    //             score: matchedZone.total_score,
    //             demographic_score: matchedZone.demographic_score,
    //             busyness_score: matchedZone.busyness_score,
    //             clickLngLat: {
    //                 lng: matchedZone.boundary_coordinates[0][0],
    //                 lat: matchedZone.boundary_coordinates[0][1]
    //             }
               
    //         }
    //         setSelectedZone(newSelectedZone);
    //         setViewport({
    //             ...viewport,
    //             longitude: newSelectedZone.clickLngLat.lng,
    //             latitude: newSelectedZone.clickLngLat.lat,
    //             zoom: 14
    //         });
    
    //         // Immediately call getBillboards after setting selected zone
    //         getBillboards();
    //     }
    // };
    // const selectHandler = (selectedZoneName) => {
    //     const matchedZone = syncedZoneInfo.find(zone => zone.name === selectedZoneName);
    //     if (matchedZone) {
    //         const newSelectedZone = {
    //             id: matchedZone.id,
    //             name: matchedZone.name,
    //             score: matchedZone.total_score,
    //             demographic_score: matchedZone.demographic_score,
    //             busyness_score: matchedZone.busyness_score,
    //             clickLngLat: {
    //                 lng: matchedZone.boundary_coordinates[0][0],
    //                 lat: matchedZone.boundary_coordinates[0][1]
    //             }
    //         };
    //         setSelectedZone(newSelectedZone);
    //         setViewport({
    //             ...viewport,
    //             longitude: newSelectedZone.clickLngLat.lng,
    //             latitude: newSelectedZone.clickLngLat.lat,
    //             zoom: 14
    //         });
    //         setBillboards([]);
    //         axiosInstance.get(`/api/billboards/zone/${newSelectedZone.id}/`)
    //             .then(res => {
    //                 setBillboards(res.data);
    //             }).catch(err => {
    //                 console.error('Error fetching billboards:', err);
    //             });
    //     }
    // };

    const BillboardMarker = ({ longitude, latitude })=>{
        return(
            <Marker longitude={longitude} latitude={latitude} anchor="bottom">
                <img src={BillboardImage} alt="Billboard Image" 
                     style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 0 5px rgba(0,0,0,0.3)'
                }}
                 
                 
                 />
            </Marker>
        )
    }

    

    
    
    
    
    
    
    // const resetComponent = () => {
    //     setFilteredOptions([]);
    //   };
      
    //   useEffect(() => {
    //     if (inputValue === '') {
    //       resetComponent();
    //     }
    //   }, [inputValue]);
      
    //   const handleSearch = (value) => {
    //     setInputValue(value);
    //     setFilteredOptions([]); // Reset filtered options immediately
      
    //     if (value.trim()) {
    //       // Use setTimeout to ensure the reset has occurred before filtering
    //       setTimeout(() => {
    //         const filtered = zoneNames.filter(name =>
    //           name.toLowerCase().startsWith(value.toLowerCase())
    //         );
    //         setFilteredOptions(filtered.map(name => ({ value: name })));
    //       }, 0);
    //     }
    //   };

    //   const handleSearch = (value) => {
    //     setInputValue(value);
    //     const filtered = syncedZoneInfo.filter(zone =>
    //         zone.name.toLowerCase().includes(value.toLowerCase())
    //     );
    //     setFilteredOptions(filtered.map(zone => ({ value: zone.name, key: `${zone.id}-${zone.name}` })));
    // };
    
      


    const layerStyle = {
        id: "outline",
        type: "fill",
        source: "polygonData",
        layout: {},
        paint: {
            "fill-color": [
                "case",
                ["==", ["get", "total_score"], "N/A"],
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
        {/* <div className="w-[200px] p-4">
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

        </div> */}
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
                                anchor="bottom"
                            >
                                <div>
                                    <h3>{selectedZone.name}</h3>
                                    <p>Score: {selectedZone.score}</p>
                                    <p>Demographic: {selectedZone.demographic_score}</p>
                                    <p>Busyness: {selectedZone.busyness_score}</p>
                                </div>
                            </Popup>
                            )}
                    </Source>
                )}
                {/* <Marker longitude={-73.98} latitude={40.74}></Marker> */}
                {selectedZone && billboards.map((billboard, index) => (
                    billboard.longitude && billboard.latitude && !isNaN(billboard.longitude) && !isNaN(billboard.latitude) ? (
                        <BillboardMarker
                            key={index}
                            longitude={billboard.longitude}
                            latitude={billboard.latitude}
                        />
                    ) : null
                ))}

                            
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
