// src/Dashboard.js

import { Button, Col, Row, Statistic } from "antd";
import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import SearchTable from "./components/SearchTable";
import { ShoppingOutlined } from "@ant-design/icons";
const Dashboard = () => {
  const { authState, logoutUser } = useContext(AuthContext);
  const { user } = authState;

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-10">
      <div>
        <h1 className="text-4xl font-medium">Dashboard</h1>
        <p className="mt-2 text-neutral-500">
          Track your credit usage and search history.{" "}
        </p>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-medium">Credit Usage</h2>
          <Button type="primary" icon={<ShoppingOutlined />}>Top Up Credit</Button>
        </div>
        <Row gutter={16} className="mt-2">
          <Col span={8}>
            <Statistic title="Active credits" value={500} />
          </Col>
          <Col span={8}>
            <Statistic title="Used today" value={0} />
          </Col>
          <Col span={8}>
            <Statistic title="Average monthly usage" value={0} />
          </Col>
        </Row>
      </div>
      <SearchTable />
    </div>
  );
};

export default Dashboard;
