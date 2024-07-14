import {
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { AGES_RANGES, GENDERS } from "../constant";
import useSearches from "../hooks/useSearches";
import { SearchModalTrigger, useSearchModal } from "./SearchModal";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import useInterests from "../hooks/useInterests";
const { Search } = Input;
const { confirm } = Modal;
// const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

const items = [
  { key: "1", label: "Today", date: dayjs().subtract(1, "day") },
  { key: "2", label: "This Week", date: dayjs().subtract(1, "week") },
  {
    key: "3",
    label: "This Month",
    date: dayjs().subtract(1, "month"),
  },
  {
    key: "4",
    label: "Last 6 Months",
    date: dayjs().subtract(6, "month"),
  },
  {
    key: "5",
    label: "Last Year",
    date: dayjs().subtract(1, "year"),
  },
];

function SearchTable() {
  let interests = useInterests();
  let [dropdownKey, setDropDownKey] = useState("2");
  let [selectedRowKeys, setSelectedRowKeys] = useState([]);
  let [searchKey, setSearchKey] = useState("");
  let { searches, fetchSearches } = useSearches();
  let { setIsModalOpen, setInitialForm } = useSearchModal();
  let dropDownMenu = {
    items,
    onClick: ({ item, key }) => {
      setDropDownKey(key);
    },
  };
  const selectedItem = items.find((item) => item.key === dropdownKey);
  const dropdownLabel = selectedItem.label;
  let data = [...searches].filter((search) => {
    let createdDate = dayjs(search.date_search_made_on);
    return createdDate.isSameOrAfter(selectedItem.date);
  });

  data = [...data].reverse().map((search, index) => {
    return {
      key: search.id,
      ...search,
    };
  });
  const columns = [
    {
      title: "Search Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <Link to={`/analytics/${record.id}`} className="text-blue-600">
          {text}
        </Link>
      ),
    },
    {
      title: "Target market interests",
      dataIndex: "target_market_interests",
      render: (text, record) => text.join(", "),
      filters: interests.map((interest) => ({
        text: interest.name,
        value: interest.name,
      })),
      onFilter: (value, record) =>
        record.target_market_interests.includes(value),
    },
    {
      title: "Target Gender",
      dataIndex: "gender",
      render: (text, record) => GENDERS[text],
      filters: [
        {
          text: "Male",
          value: "M",
        },
        {
          text: "Female",
          value: "F",
        },
        {
          text: "Both",
          value: "B",
        },
      ],
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: "Target Age",
      dataIndex: "target_age",
      width: 200,
      filters: AGES_RANGES.map((age, idx) => ({
        text: age,
        value: idx + 1,
      })),
      onFilter: (value, record) => record.target_age.includes(value),
      render: (value) => (
        <div className="flex items-center flex-wrap gap-y-2">
          {value.map((ageIndex, idx) => (
            <Tag key={idx}>{AGES_RANGES[ageIndex - 1]}</Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Target Date",
      render: (text, record) => (
        <div className="flex items-center flex-wrap gap-y-2">
          <Tag>{record.start_date}</Tag>
          <Tag>{record.end_date}</Tag>
        </div>
      ),
    },
    {
      title: "Action",
      width: 150,
      render: (record) => (
        <div className="space-y-2">
          <Button
            style={{ paddingLeft: 0 }}
            type="link"
            onClick={() => handleDuplicate(record)}
          >
            Duplicate
          </Button>
          <Link to={`/analytics/${record.id}`} className="text-blue-600">
            View
          </Link>
        </div>
      ),
    },
  ];

  function handleDuplicate(record) {
    setInitialForm(record);
    setIsModalOpen(true);
  }

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
  let deleteSearches = async () => {
    try {
      let messageContent =
        selectedRowKeys.length > 1 ? "Deleted searches" : "Deleted search";
      await Promise.all(
        selectedRowKeys.map(async (key) => {
          await axiosInstance.delete(`/api/search/${key}/`);
        })
      );
      message.success(messageContent);
      fetchSearches();
    } catch (error) {
      console.log(error);
    }
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
        deleteSearches();
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
              menu={dropDownMenu}
              value
            >
              <Space>
                <span className="text-sm">{dropdownLabel}</span>
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
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          showSizeChanger: true,
        }}
      />
    </div>
  );
}

export default SearchTable;