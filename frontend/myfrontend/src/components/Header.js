import { BellOutlined, SettingOutlined } from "@ant-design/icons";
import { Avatar, Badge } from "antd";
import React from "react";
import { Link } from "react-router-dom";

let Header = () => {
  return (
    <div className="text-white bg-blue-600 h-12 py-2 px-4 flex items-center justify-between">
      <div className="text-2xl font-medium">Ad Optima</div>
      <div className="flex gap-4 items-center">
        <Link to="/settings">
          <SettingOutlined />
        </Link>
        <Badge count={5} size="small" className="text-white" style={{ backgroundColor: "#ff4d4f" }}>
            <BellOutlined />
        </Badge>
        <div className="flex items-center gap-2">
          <div className="border rounded-full h-fit">
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" size="small"/>
          </div>
          <span>Serati Ma</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
