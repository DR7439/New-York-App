import { Line } from "@ant-design/charts";
import React, { useEffect, useState } from "react";
import fetchWithCache from "../utils/fetchWithCache";

function sortByTime(a, b) {
  let aTime = new Date(a.time);
  let bTime = new Date(b.time);
  return aTime - bTime;
}

const LineChart = ({ searchId, zoneId, date }) => {
  let [data, setData] = useState([]);
  function fetchScore() {
    fetchWithCache(
      `/api/zone-details-by-search-date-zone/?search_id=${searchId}&date=${date}&zone_id=${zoneId}`
    ).then((_data) => {
      if (_data) {
        let data = _data.busyness_scores.sort(sortByTime).map((item) => ({
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
