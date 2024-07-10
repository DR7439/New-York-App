import { Pie } from "@ant-design/plots";
import React, { useEffect } from "react";
import axiosInstance from "../axiosInstance";
const PieChart = ({ zoneId }) => {
  let [data, setData] = React.useState([]);
  function fetchData() {
    axiosInstance.get(`/api/zones/${zoneId}/interests`).then((res) => {
      if (res.data) {
        let data = Object.keys(res.data).map((key) => ({
          type: key.replaceAll("to", "-").replaceAll("years", ""),
          point: res.data[key],
        }));
        setData(data);
      }
    });
  }
  useEffect(() => {
    if (zoneId) {
      fetchData();
    }
  }, [zoneId]);
  if (!zoneId || data.length === 0) {
    return null;
  }

  const config = {
    data,
    angleField: "point",
    colorField: "type",
    paddingRight: 80,
    innerRadius: 0.6,
    label: {
      text: "type",
      style: {
        fontWeight: "bold",
      },
      position: "spider",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: "Total 100%",
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 28,
          fontStyle: 500,
        },
      },
    ],
  };
  return <Pie {...config} />;
};

export default PieChart;
