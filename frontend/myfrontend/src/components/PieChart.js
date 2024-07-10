import { Pie } from "@ant-design/plots";
import React, { useEffect } from "react";
const PieChart = ({ zoneId }) => {
  let [data, setData] = React.useState([]);
  useEffect(() => {
    if (zoneId) {
      fetchData();
    }
  }, [zoneId]);
  if (!zoneId) {
    return null;
  }

  function fetchData() {
    // axiosInstance.get(`/api/zones/${zoneId}/details`).then((res) => {
    //   // let data = res.data.map((item) => ({
    //   //   time: item.datetime.split("T")[1].split(":")[0],
    //   //   value: item.busyness_score,
    //   // }));
    //   let age_demographics = res.data.age_demographics;
    //   let data = Object.keys(age_demographics).sort(sortFn).map((key) => ({
    //     age: key.replaceAll("to", "-").replaceAll("years", ""),
    //     score: age_demographics[key],
    //   }));
    //   console.log("🚀 ~ data ~ data:", data)
    //   setData(data);
    // });
  }
  const config = {
    data: [
      { type: "avc", value: 27 },
      { type: "xzc", value: 25 },
      { type: "dfe", value: 18 },
      { type: "asdfff", value: 15 },
      { type: "asf", value: 10 },
      { type: "asddf", value: 5 },
    ],
    angleField: "value",
    colorField: "type",
    paddingRight: 80,
    innerRadius: 0.6,
    label: {
      text: "type",
      style: {
        fontWeight: "bold",
      },
      position: 'spider',
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
