import React, { useEffect } from "react";
import { Line } from "@ant-design/charts";
import axiosInstance from "../axiosInstance";
const LineChart = ({ searchId,zoneId, date }) => {
  const data = [
    { time: "1", value: 3 },
    { time: "2", value: 4 },
    { time: "3", value: 3.5 },
    { time: "4", value: 5 },
    { time: "5", value: 4.9 },
    { time: "6", value: 6 },
    { time: "7", value: 7 },
    { time: "8", value: 9 },
    { time: "9", value: 13 },
  ];
  function fetchScore() {
    ///api/searches/<search_id>/scores/
    axiosInstance.get(`/api/searches/${searchId}/scores/`).then((res) => {
      // let data = res.data.map((item) => ({
      //   time: item.datetime.split("T")[1].split(":")[0],
      //   value: item.busyness_score,
      // }));
      // setData(data);
      console.log('9779 res.data', res.data);
    });
  }
  useEffect(() => {
    fetchScore();
  }, [zoneId, date])

  const props = {
    data,
    xField: "time",
    yField: "value",
  };

  return <Line {...props} />;
};
export default LineChart;
