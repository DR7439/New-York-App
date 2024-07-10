// src/Dashboard.js
import React, { useEffect } from "react";
import { Breadcrumb, Select, Spin, Table, Tabs, Tag } from "antd";
import { SearchModalTrigger } from "./components/SearchModal";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import LineChart from "./components/LineChart";
import ColumnChart from "./components/ColumnChart";
import { Link, useParams } from "react-router-dom";
import useSearches from "./hooks/useSearches";
import Maps from "./components/Maps";
import axiosInstance from "./axiosInstance";
import PieChart from "./components/PieChart";

const pad0 = (num) => num.toString().padStart(2, "0");

const timeFilters = [...Array(24).keys()].map((i) => ({
  text: `${pad0(i)}:00`,
  value: `${pad0(i)}:00`,
}));

const columns = [
  {
    title: "Ranking",
    dataIndex: "key",
    sorter: (a, b) => a.key - b.key,
  },
  {
    title: "Location",
    dataIndex: "zone_name",
    sorter: (a, b) => a.zone_name.localeCompare(b.zone_name),
  },
  {
    title: "Time",
    dataIndex: "datetime",
    filters: timeFilters,
    render(text, record) {
      // show the time in the table
      let timeToShow = text.split("T")[1].split(":")[0];
      return <span>{`${timeToShow}:00`}</span>;
    },

    onFilter: (value, record) => {
      let time = `${record.datetime.split("T")[1].split(":")[0]}:00`;
      return time === value;
    },
  },
  {
    title: "Demographic Score",
    dataIndex: "demographic_score",
    sorter: (a, b) => a.demographic_score - b.demographic_score,
    render: (text, record) => (
      <div className="flex items-center justify-center">
        <Tag icon={<CheckCircleOutlined />} color="success">
          {Number(text).toFixed(2)}/100
        </Tag>
      </div>
    ),
  },
  {
    title: "Busyness Score",
    dataIndex: "busyness_score",
    sorter: (a, b) => a.busyness_score - b.busyness_score,
    render: (text, record) => (
      <div className="flex items-center justify-center">
        <Tag icon={<CheckCircleOutlined />} color="success">
          {Number(text).toFixed(2)}/100
        </Tag>
      </div>
    ),
  },
];

function getDateArray(startDate, endDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

const Analytics = () => {
  let { id } = useParams();
  let [selectedDate, setSelectedDate] = useState(null);
  let [selectedZone, setSelectedZone] = useState(null);
  let { getSearchById } = useSearches();
  let [search, setSearch] = useState(null);
  let [topZones, setTopZones] = useState([]);
  let [tableData, setTableData] = useState([]);
  async function loadTableDataByDate(date) {
    
    axiosInstance
      .get(`/api/top-zones/?search_id=${id}&date=${date}`)
      .then((res) => {
        setTopZones(res.data);
        setSelectedZone(res.data[0].zone_id);
      });

    axiosInstance
      .get(
        `/api/top-scores-in-zone?search_id=${id}&date=${date}&zone_id=16&top_n=20`
      )
      .then((res) => {
        let data =
          res.data?.top_scores.map((item, ind) => ({
            key: ind + 1,
            ...item,
          })) || [];
        setTableData(data);
      });
  }
  useEffect(() => {
    // /top-zones/?n=5&search_id=1&date=2024-07-10
    getSearchById(id).then((search) => {
      setSearch(search);
      setSelectedDate(search.start_date);
    });
    // axiosInstance.get(`/api/searches/${id}/top-scores/5/`);
    // axiosInstance.get(`/api/zones`)
  }, []);
  useEffect(() => {
    if (search) {
      loadTableDataByDate(selectedDate);
      // axiosInstance.get(`/api/searches/${id}/top-scores/5/`).then(data => {
      //   setTableData(data.data);
      // });
    }
  }, [search, selectedDate]);
  let searchName = search ? search.name : "";
  if (!search) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  const targetDates = getDateArray(search.start_date, search.end_date);
  const dateOptions = targetDates.map((date) => ({ value: date, label: date }));

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
          },
        ]}
      />
      <div className="mt-12">
        <h1 className="text-4xl font-medium">Analytics</h1>
        <p className="mt-2 text-neutral-500">
          View detailed search results with data analysis and recommendations.
        </p>
        <Maps />
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
      <Table
        className="mt-4"
        columns={columns}
        dataSource={tableData}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
        }}
      />
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-medium">Data Analysis</h3>
          <Tabs
            items={topZones.map((item) => ({
              label: item.zone_name,
              key: item.zone_id,
            }))}
            value={selectedZone}
            onChange={(key) => setSelectedZone(key)}
          />
        </div>
        <div>
          <h4 className="mb-4 font-medium">Busyness Activity by Location</h4>
          <LineChart searchId={id} zoneId={selectedZone} date={selectedDate} />
        </div>
        <div>
          <h4 className="mb-4 font-medium">Demographic by Location</h4>
          <ColumnChart zoneId={selectedZone} />
        </div>
        <div>
          <h4 className="mb-4 font-medium">Point-of-interest by Location</h4>
          <PieChart zoneId={selectedZone} />
        </div>
      </div>
    </>
  );
};

export default Analytics;
