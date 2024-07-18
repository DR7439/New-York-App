import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/charts";
import axiosInstance from "../axiosInstance";
import fetchWithCache from "../utils/fetchWithCache";
const LineChart = ({ searchId, zoneId, date }) => {
  let [data, setData] = useState([]);
  function fetchScore() {
    fetchWithCache(
      `/api/zone-details-by-search-date-zone/?search_id=${searchId}&date=${date}&zone_id=${zoneId}`
    ).then((_data) => {
      if (_data) {
        let data = _data.busyness_scores.map((item) => ({
          time: item.time.split("T")[1].split(":")[0],
          value: Math.round(item.busyness_score),
        }));
        setData(data);
      }
    });
  }
  useEffect(() => {
    if (searchId && zoneId && date) {
      fetchScore();
    }
  }, [searchId, zoneId, date]);

  const props = {
    data,
    xField: "time",
    yField: "value",
  };
  if (data.length === 0) {
    return null;
  }

  return <Line {...props} />;
};
export default LineChart;
