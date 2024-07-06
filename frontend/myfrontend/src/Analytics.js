// src/Dashboard.js
import React, { useEffect } from "react";
import { Breadcrumb, Select, Table, Tag } from "antd";
import { SearchModalTrigger } from "./components/SearchModal";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useState } from "react";
import LineChart from "./components/LineChart";
import ColumnChart from "./components/ColumnChart";
import { Link, useParams } from "react-router-dom";
import useSearches from "./hooks/useSearches";

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

const Analytics = () => {
  let { id } = useParams();
  let [selectedDate, setSelectedDate] = useState(targetDates[0]);
  let { getSearchById } = useSearches();
  let [search, setSearch] = useState(null);
  useEffect(() => {
    getSearchById(id).then(setSearch);
  }, []);
  let searchName = search ? search.name : "";
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/">Dashboard</Link>,
          },
          {
            title: "Search History",
          },
          {
            title: searchName,
          }
        ]}
      />
      <div className="mt-12">
        <h1 className="text-4xl font-medium">Analytics</h1>
        <p className="mt-2 text-neutral-500">
          View detailed search results with data analysis and recommendations.
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between mt-7">
          <h4 className="text-xl font-medium">Recommendations</h4>
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
        <div>
          <h4 className="text-xl font-medium">Data Analysis</h4>
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
