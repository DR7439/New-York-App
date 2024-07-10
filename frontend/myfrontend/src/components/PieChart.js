import { Pie } from "@ant-design/plots";
import React, { useEffect } from "react";
import axiosInstance from "../axiosInstance";
const PieChart = ({ zoneId }) => {
  let [data, setData] = React.useState([]);
  function fetchData() {
    axiosInstance.get(`/api/zones/${zoneId}/interests`).then((res) => {
      if (res.data) {
        let total = 0;
        let data = Object.keys(res.data).map((key) => {
          total += res.data[key];
          return {
            type: key.replaceAll("to", "-").replaceAll("years", ""),
            point: res.data[key],
          };
        });
        data =data.map((item) => {
          let percent = Number(((item.point / total) * 100).toFixed(2));
          let percentStr = "";
          if (percent > 0) {
            percentStr =  `${percent}%`;
          }
          return { ...item, percent: percentStr };
        });
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
      text: "percent",
      style: {
        fontWeight: "bold",
      },
    },
    tooltip: {
      title: "type",
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
          text: "Total",
          x: "50%",
          y: "46%",
          textAlign: "center",
          fontSize: 20,
          fontStyle: 300,
          textColor: "#f0f"
        },
      },
      {
        type: "text",
        style: {
          text: "100%",
          x: "50%",
          y: "54%",
          textAlign: "center",
          fontSize: 32,
          fontStyle: 500,
        },
      },
    ],
  };
  return <Pie {...config} />;
};

export default PieChart;
