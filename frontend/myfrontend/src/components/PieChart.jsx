import { Pie } from "@ant-design/plots";
import React, { useEffect } from "react";
import fetchWithCache from "../utils/fetchWithCache";
const PieChart = ({ zoneId }) => {
  let [data, setData] = React.useState([]);
  function fetchData() {
    fetchWithCache(`/api/zones/${zoneId}/interests`).then((_data) => {
      if (_data) {
        let total = 0;
        let data = Object.keys(_data).map((key) => {
          total += _data[key];
          return {
            type: key.replaceAll("to", "-").replaceAll("years", ""),
            point: _data[key],
          };
        });
        data = data.map((item) => {
          let percent = Number(((item.point / total) * 100).toFixed(2));
          let percentStr = "";
          if (percent > 0) {
            percentStr = `${percent}%`;
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
        title: true,
        position: "right",
        rowPadding: 5,
      },
    },
  };
  return <Pie {...config} />;
};

export default PieChart;
