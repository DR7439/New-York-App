import { Column } from "@ant-design/charts";
import React, { useEffect } from "react";
import axiosInstance from "../axiosInstance";

const ColumnChart = ({ zoneId }) => {
  let [data, setData] = React.useState([]);
  useEffect(() => {
    if (zoneId) {
      fetchData();
    }
  }, [zoneId]);
  if (!zoneId) {
    return null;
  }
  const config = {
    xField: "age",
    yField: "score",
  };

  function sortFn(a, b) {
    let aNum = parseInt(a.split("-",)[0]);
    let bNum = parseInt(b.split("-",)[0]);
    return aNum - bNum;
  }

  function fetchData() {
    axiosInstance.get(`/api/zones/${zoneId}/details`).then((res) => {
      // let data = res.data.map((item) => ({
      //   time: item.datetime.split("T")[1].split(":")[0],
      //   value: item.busyness_score,
      // }));
      let age_demographics = res.data.age_demographics;
      let data = Object.keys(age_demographics).sort(sortFn).map((key) => ({
        age: key.replaceAll("to", "-").replaceAll("years", ""),
        score: age_demographics[key],
      }));
      setData(data);
    });
  }

  return <Column data={data} {...config} />;
};

export default ColumnChart;
