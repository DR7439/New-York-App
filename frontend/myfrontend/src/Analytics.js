// src/Dashboard.js
import React from "react";
import { Select, Table, Tag } from "antd";
import SearchModalTrigger from "./components/SearchModal";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import LineChart from "./components/LineChart";
import ColumnChart from "./components/ColumnChart";
import { render } from "react-dom";

const columns = [
  {
    title: "Ranking",
    dataIndex: "ranking",
    sorter: (a, b) => a - b,
  },
  {
    title: "Location",
    dataIndex: "location",
    sorter: (a, b) => a.location.localeCompare(b.location),
  },
  {
    title: "Market Interest",
    dataIndex: "marketInterest",
    render: (text, record) => text.join(", "),
  },
  {
    title: "Time",
    dataIndex: "time",
    filters: [
      {
        text: "09:00",
        value: "09:00",
      },
      {
        text: "10:00",
        value: "10:00",
      },
      {
        text: "11:00",
        value: "11:00",
      },
      {
        text: "12:00",
        value: "12:00",
      },
    ],
    // onFilter: (value, record) => record.address.indexOf(value) === 0,
  },
  {
    title: "Demographic Score",
    dataIndex: "demographicScore",
    sorter: (a, b) => a.avgDemographicScore - b.avgDemographicScore,
    render: (text, record) => (
      <div className="flex items-center justify-center">
        <Tag icon={<CheckCircleOutlined />} color="success">
          {text}/100
        </Tag>
      </div>
    ),
  },
  {
    title: "Busyness Score",
    dataIndex: "busynessScore",
    sorter: (a, b) => a.avgBusynessScore - b.avgBusynessScore,
    render: (text, record) => (
      <div className="flex items-center justify-center">
        <Tag icon={<CheckCircleOutlined />} color="success">
          {text}/100
        </Tag>
      </div>
    ),
  },
];
const dummyData = [
  {
    ranking: 1,
    location: "Central Park",
    marketInterest: ["Music", "Technology", "Sports"],
    time: "09:00",
    demographicScore: 50,
    busynessScore: 50,
  },
  {
    ranking: 2,
    location: "Upper East Side",
    marketInterest: ["Music", "Travel", "Sports"],
    time: ["12:00"],
    demographicScore: 60,
    busynessScore: 60,
  },
  {
    ranking: 3,
    location: "East Village",
    marketInterest: ["Sports"],
    time: "11:00",
    demographicScore: 70,
    busynessScore: 70,
  },
  {
    ranking: 4,
    location: "Harlem",
    marketInterest: ["Music", "Sports"],
    time: "12:00",
    demographicScore: 80,
    busynessScore: 80,
  },
  {
    ranking: 5,
    location: "Central Park",
    marketInterest: ["Music", "Travel", "Technology", "Sports"],
    time: "10:00",
    demographicScore: 90,
    busynessScore: 90,
  },
];

const targetDates = [
  "2024-06-06",
  "2024-06-07",
  "2024-06-08",
  "2024-06-09",
  "2024-06-10",
];
const dateOptions = targetDates.map((date) => ({ value: date, label: date }));

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

const Analytics = () => {
  let [selectedDate, setSelectedDate] = useState(targetDates[0]);
  return (
    <>
      <div>
        <h1 className="text-4xl font-medium">Analytics</h1>
        <p className="mt-2 text-neutral-500">
          View detailed search results with data analysis and recommendations.
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between mt-7">
          <h4 className="text-2xl font-medium">Recommendations</h4>
          <div className="flex gap-4 items-center">
            <SearchModalTrigger />
          </div>
        </div>
        <div className="flex gap-2 items-center mt-4">
          <span>Select Target Date</span>
          <Select
            className="w-60"
            value={selectedDate}
            onChange={(value) => setSelectedDate(value)}
            options={dateOptions}
          />
        </div>
      </div>
      <Table className="mt-4" columns={columns} dataSource={dummyData} />
      <div className="space-y-8">
        <table className="table-fixed w-full mt-4 border border-neutral-400/30 border-collapse">
          <tbody>
            <tr>
              <td className="w-60 p-4 bg-neutral-200 border border-neutral-400/30">
                Target Market Interest
              </td>
              <td className="p-4 border border-neutral-400/30">
                Technology, Sports, Music, Travel
              </td>
            </tr>
            <tr>
              <td className="p-4 w-60 bg-neutral-200 border border-neutral-400/30">
                Recommended Time & Busyness Score
              </td>
              <td className="p-4 border border-neutral-400/30">
                Time: 10:00 AM; Score: 75.3 <br /> Time: 11:30 AM; Score: 78.3{" "}
                <br /> Time: 17:00 PM; Score: 80.3 <br /> Time: 18:00 PM; Score:
                90.0
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <h4 className="text-2xl font-medium">Data Analysis</h4>
        </div>
        <div>
          <h4 className="mb-4 font-medium">Busyness Activity by Location</h4>
          <LineChart />
        </div>
        <div>
          <h4 className="mb-4 font-medium">Demographic by Location</h4>
          <ColumnChart />
        </div>
      </div>
    </>
  );
};

export default Analytics;
