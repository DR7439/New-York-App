import { CheckCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Popover, Table, Tag } from "antd";
import React from "react";
import { TABLE_TOOLTIP_TEXT } from "../constant";

const timeFilters = [...Array(24).keys()].map((i) => {
  let newDate = new Date()
  newDate.setHours(i, 0, 0, 0)
  let time = newDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  return {
    text: time,
    value: time,
  }
})

export function AnalyticTable({ tableData, onRowClick, topZones }) {
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
        <Button
          type="link"
          // onClick={() => handleRowItemClick(record)}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Recommended Time",
      dataIndex: "datetime",
      filters: timeFilters,
      render(text, record) {
        // show the time in the table
        let timeToShow = new Date(text).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <Button
            type="link"
            // onClick={() => handleRowItemClick(record)}
          >
            {timeToShow}
          </Button>
        );
      },

      onFilter: (value, record) => {
        let timeToShow = new Date(record.datetime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return timeToShow === value;
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
        <div className="flex items-center justify-start">
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
        <div className="flex items-center justify-start">
          <Tag icon={<CheckCircleOutlined />} color="success">
            {Number(text).toFixed(2)}/100
          </Tag>
        </div>
      ),
    },
  ];
  return (
    <Table
      className="mt-4"
      columns={columns}
      dataSource={tableData}
      rowClassName="cursor-pointer"
      onRow={(record) => ({
        onClick: () => onRowClick(record),
      })}
      pagination={{
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
      }}
    />
  );
}
