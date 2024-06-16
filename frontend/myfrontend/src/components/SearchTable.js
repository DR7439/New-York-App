// src/Dashboard.js

import { DownOutlined, PlusOutlined, SmileOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, Space, Table, Tag } from "antd";
import React from "react";
const { Search } = Input;

function SearchTable() {
  const items = [
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
      label: "Last Year"
    },
  ];
  const columns = [
    {
      title: "Search Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Business Type",
      dataIndex: "type",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Target Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Target Age",
      dataIndex: "age",
      filters: [
        {
          text: 'London',
          value: 'London',
        },
        {
          text: 'New York',
          value: 'New York',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
      render: () => (
        <div className="flex items-center">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
          <Tag>Tag 2</Tag>
        </div>
      ),
    },
    {
      title: "Target Date",
      render: () => (
        <div className="flex items-center">
          <Tag>Tag 1</Tag>
          <Tag>Tag 2</Tag>
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
  const data = [
    {
      key: "1",
      name: "John Brown",
      type: "Restaurant",
      gender: "Both Genders",
      age: 32,
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
    },
    {
      key: "4",
      name: "Disabled User",
      age: 99,
    },
  ];

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
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
                items,
              }}
            >
              <Space>
                <span className="text-sm">This Week</span>
                <DownOutlined className="text-[12px]" />
              </Space>
            </Dropdown>
          </div>
          <Search placeholder="Can't find your search result?" />
          <Button icon={<PlusOutlined />} type="primary">
            Add New Search
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
        dataSource={data}
      />
    </div>
  );
}

export default SearchTable;
