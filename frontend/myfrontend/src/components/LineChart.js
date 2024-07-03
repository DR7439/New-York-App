import React from "react";
import { Line } from "@ant-design/charts";
const LineChart = () => {
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

  const props = {
    data,
    xField: "time",
    yField: "value",
  };

  return <Line {...props} />;
};
export default LineChart;
