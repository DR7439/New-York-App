import { Col, Row } from "antd";
import LeftSide from "./LeftSide";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="h-screen grid grid-rows-[1fr_2fr] md:grid-rows-1 md:grid-cols-2">
      <LeftSide />
      <div className="flex items-center justify-center px-4 md:px-8">
        <Outlet />
      </div>
    </div>
  );
}
