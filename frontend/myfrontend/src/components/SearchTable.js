import {
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchModalTrigger from "./SearchModal";
import axios from "axios";
import { AGES_RANGES, GENDERS } from "../constant";
import useSearches from "../hooks/useSearches";
const { Search } = Input;
const { confirm } = Modal;

const dropdownItems = [
  {
    key: "1",
    label: "This Month",
  },
  {
    key: "2",
    label: "Last 6 Months",
  },
  {
    key: "3",
    label: "Last Year",
  },
];
const columns = [
  {
    title: "Search Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    render: (text, record) => (
      <Link to={`/search/${record.id}`} className="text-blue-600">
        {text}
      </Link>
    ),
  },
  {
    title: "Target market interest",
    dataIndex: "target_market_interests",
    sorter: (a, b) => a.type.localeCompare(b.type),
    render: (text, record) => text.join(", "),
  },
  {
    title: "Target Gender",
    dataIndex: "gender",
    sorter: (a, b) => a.gender.localeCompare(b.gender),
    render: (text, record) => GENDERS[text],
  },
  {
    title: "Target Age",
    dataIndex: "target_age",
    filters: [
      {
        text: "18-25",
        value: "18-25",
      },
      {
        text: "25-40",
        value: "25-40",
      },
      {
        text: "40-60",
        value: "40-60",
      },
    ],
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    render: (value) => (
      <div className="flex items-center">
        {value.map((ageIndex, idx) => (
          <Tag key={idx}>{AGES_RANGES[ageIndex]}</Tag>
        ))}
      </div>
    ),
  },
  {
    title: "Target Date",
    render: (text, record) => (
      <div className="flex items-center">
        <Tag>{record.start_date}</Tag>
        <Tag>{record.end_date}</Tag>
      </div>
    ),
  },
  {
    title: "Action",
    render: () => (
      <div className="space-y-2">
        <Button type="link">Duplicate</Button>
        <Button type="link">View</Button>
      </div>
    ),
  },
];

function SearchTable() {
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);
  let [searchKey, setSearchKey] = useState("");
  let data = useSearches();

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const filteredData = data.filter((record) =>
    record.name.toLowerCase().includes(searchKey.toLowerCase())
  );

  const showConfirm = () => {
    confirm({
      title: "Are you sure you want to delete this search?",
      icon: <ExclamationCircleFilled />,
      content: "Deleted searches can’t be restored.",
      okText: "Yes",
      onOk() {
        const newData = data.filter(
          (record) => !selectedRowKeys.includes(record.key)
        );
        // setData(newData);
        message.success("Deleted search");
      },
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-medium">Search History</h2>
      <div className="flex items-center justify-between mt-7">
        <p className="font-medium">Recent searches</p>
        <div className="flex gap-4 items-center">
          <div className="w-60">
            <Dropdown
              className="cursor-pointer"
              trigger={["click"]}
              menu={{
                dropdownItems,
              }}
            >
              <Space>
                <span className="text-sm">This Week</span>
                <DownOutlined className="text-[12px]" />
              </Space>
            </Dropdown>
          </div>
          <Search
            placeholder="Can't find your search result?"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
          <SearchModalTrigger />
          <Button
            type="text"
            disabled={selectedRowKeys.length === 0}
            onClick={showConfirm}
            className="text-blue-600"
          >
            <DeleteOutlined />
          </Button>
        </div>
      </div>
      <Table
        className="mt-4"
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={filteredData}
      />
    </div>
  );
}

export default SearchTable;