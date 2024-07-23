import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  Button,
  Popover,
  Select,
  Skeleton,
  Spin,
  Switch,
  Table,
  Tabs,
  Tag,
  Tour,
} from "antd";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ColumnChart from "./components/ColumnChart";
import LineChart from "./components/LineChart";
import Maps from "./components/Maps";
import PieChart from "./components/PieChart";
import { SearchModalTrigger } from "./components/SearchModal";
import useSearches from "./hooks/useSearches";
import fetchWithCache from "./utils/fetchWithCache";
import { ANALYTICS_TOUR_STEPS, TABLE_TOOLTIP_TEXT, TOUR_STORAGE_KEY } from "./constant";
import AdvertisingCarousel from "./components/AdvertisingCarousel";

const pad0 = (num) => num.toString().padStart(2, "0");

const timeFilters = [...Array(24).keys()].map((i) => ({
  text: `${pad0(i)}:00`,
  value: `${pad0(i)}:00`,
}));

function parseScoresFromTopZones(topZones) {
  let scores = [];
  topZones.forEach((zone) => {
    let { busyness_scores, ...rest } = zone;
    busyness_scores.forEach((score) => {
      scores.push({
        ...rest,
        datetime: score[0],
        busyness_score: score[1],
        combined_score: score[1] + rest.demographic_score,
      });
    });
  });
  scores = scores
    .sort((a, b) => b.combined_score - a.combined_score)
    .map((item, ind) => ({
      key: ind + 1,
      ...item,
    }));
  return scores;
}

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
  let [selectedZoneId, setSelectedZoneId] = useState(null);
  let [selectedMapZoneId, setSelectedMapZoneId] = useState(null);
  let [showRecommendations, setShowRecommendations] = useState(() => !Boolean(localStorage.getItem(TOUR_STORAGE_KEY.analytic)));
  let { getSearchById } = useSearches();
  let [search, setSearch] = useState(null);
  let [topZones, setTopZones] = useState([]);
  let [tableData, setTableData] = useState([]);
  let [loading, setLoading] = useState(true);
  let [open, setOpen] = useState(false); // open the tour
  let visitedTour = localStorage.getItem(TOUR_STORAGE_KEY.analytic);
  let [advertisingLocations, setAdvertisingLocations] = useState([]);
  const steps = ANALYTICS_TOUR_STEPS.map((step) => ({
    ...step,
    cover: step.imgSrc && <img alt="tour.png" src={step.imgSrc} />,
    target: () =>
      step.selector
        ? document.querySelector(step.selector)
        : document.getElementById(step.id),
  }));
  useEffect(() => {
    if (!loading && !visitedTour) {
      setOpen(true);
    }
  }, [loading]);

  let handleCardClick = (record) => {
    handleRowItemClick(record);
  };
  let handleRowItemClick = (record) => {
    setSelectedZoneId(record.zone_id);
    setSelectedMapZoneId(record.zone_id);
    document.getElementById("map-container").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const columns = [
    {
      title: (
        <div>
          Ranking
          <Popover
            content={
              <div className="text-sm max-w-80">
                {TABLE_TOOLTIP_TEXT.ranking}
              </div>
            }
          >
            <QuestionCircleOutlined className="ml-1" />
          </Popover>
        </div>
      ),
      dataIndex: "key",
      sorter: (a, b) => a.key - b.key,
    },
    {
      title: "Location",
      dataIndex: "zone_name",
      sorter: (a, b) => a.zone_name.localeCompare(b.zone_name),
      filters: topZones.map((zone) => ({
        text: zone.zone_name,
        value: zone.zone_id,
      })),
      onFilter: (value, record) => record.zone_id === value,
      render: (text, record) => (
        <Button type="link" onClick={() => handleRowItemClick(record)}>
          {text}
        </Button>
      ),
    },
    {
      title: "Time",
      dataIndex: "datetime",
      filters: timeFilters,
      render(text, record) {
        // show the time in the table
        let timeToShow = text.split("T")[1].split(":")[0];
        return (
          <Button type="link" onClick={() => handleRowItemClick(record)}>
            {`${timeToShow}:00`}
          </Button>
        );
      },

      onFilter: (value, record) => {
        let time = `${record.datetime.split("T")[1].split(":")[0]}:00`;
        return time === value;
      },
    },
    {
      title: (
        <div>
          Demographic Score{" "}
          <Popover
            content={
              <div className="text-sm max-w-80">
                {TABLE_TOOLTIP_TEXT.demographic}
              </div>
            }
          >
            <QuestionCircleOutlined className="ml-1" />
          </Popover>
        </div>
      ),
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
      title: (
        <div>
          Busyness Score
          <Popover
            content={
              <div className="text-sm max-w-80">
                {TABLE_TOOLTIP_TEXT.busyness}
              </div>
            }
          >
            <QuestionCircleOutlined className="ml-1" />
          </Popover>
        </div>
      ),
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
  async function loadDataByDate(date) {
    setLoading(true);
    // for testing skeleton
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    fetchWithCache(`/api/top-zones/?search_id=${id}&date=${date}`)
      .then((res) => {
        if (res) {
          let topZones = res;
          setTopZones(topZones);
          setSelectedZoneId(topZones[0]?.zone_id);
          let scores = parseScoresFromTopZones(topZones);
          setTableData(scores);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    fetchWithCache(
      `/api/recommend-advertising-locations/?search_id=${id}&date=${date}&top_n=10`
    ).then((res) => {
      if (res) {
        setAdvertisingLocations(res);
      }
    });
  }

  useEffect(() => {
    getSearchById(id).then((search) => {
      setSearch(search);
      setSelectedDate(search.start_date);
    });
  }, []);
  useEffect(() => {
    if (search) {
      loadDataByDate(selectedDate);
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

  const loadingContent = (
    <div className="space-y-12">
      <Skeleton active paragraph={{ rows: 8 }} />
      <Skeleton active paragraph={{ rows: 8 }} />
      <Skeleton active paragraph={{ rows: 8 }} />
      <Skeleton active paragraph={{ rows: 8 }} />
    </div>
  );

  let renderContent = (
    <>
      <div>
        <div className="flex gap-4 justify-between items-center mb-10">
          <div id="select-date" className="flex gap-2 items-center">
            <h4 className="text-xl font-medium">Select Target Date</h4>
            <Select
              className="w-60"
              value={selectedDate}
              onChange={(value) => setSelectedDate(value)}
              options={dateOptions}
            />
          </div>
          <div id="show-recommendations" className="flex gap-2 items-center">
            <h4 className="text-xl font-medium">Show All Recommendations</h4>
            <Switch
              checked={showRecommendations}
              onChange={setShowRecommendations}
            />
          </div>
        </div>

        <div id="advertising-carousel" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-medium">
              Top Recommendation Highlights
            </h4>
            <SearchModalTrigger />
          </div>
          <AdvertisingCarousel
            advertisingLocations={advertisingLocations}
            onCardClick={handleCardClick}
          />
        </div>
        {showRecommendations && (
          <div id="recommendations-table" className="space-y-4">
            <div className="flex items-center justify-between mt-7">
              <h4 className="text-xl font-medium">All Recommendations</h4>
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
          </div>
        )}
      </div>
      <Maps id={id} selectedMapZoneId={selectedMapZoneId} />
      <div className="space-y-8">
        <div id="zone-tabs">
          <h3 className="text-xl font-medium">Data Analysis</h3>
          <Tabs
            items={topZones.map((item) => ({
              label: item.zone_name,
              key: item.zone_id,
            }))}
            activeKey={selectedZoneId}
            onChange={(key) => setSelectedZoneId(key)}
          />
        </div>
        <div id="tour-line-chart">
          <h4 className="mb-4 font-medium">Busyness Activity by Location</h4>
          <LineChart
            searchId={id}
            zoneId={selectedZoneId}
            date={selectedDate}
          />
        </div>
        <div id="tour-column-chart">
          <h4 className="mb-4 font-medium">Demographic by Location</h4>
          <ColumnChart zoneId={selectedZoneId} />
        </div>
        <div id="tour-pie-chart">
          <h4 className="mb-4 font-medium">Point-of-interest by Location</h4>
          <PieChart zoneId={selectedZoneId} />
        </div>
      </div>
    </>
  );

  const handleCloseTour = () => {
    setOpen(false);
    localStorage.setItem(TOUR_STORAGE_KEY.analytic, true);
  };

  return (
    <>
      <Tour open={open} onClose={handleCloseTour} steps={steps} />
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
      </div>
      {loading ? loadingContent : renderContent}
    </>
  );
};

export default Analytics;
