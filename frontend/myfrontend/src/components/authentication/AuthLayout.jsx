import { Col, Row } from "antd";
import LeftSide from "./LeftSide";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Row className="h-screen">
      <LeftSide />
      <Col span={12} className="flex items-center justify-center">
        <Outlet />
      </Col>
    </Row>
  );
}
